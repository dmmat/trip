import { Hono } from 'hono';
import { hashPassword, verifyPassword, generateId, generateToken } from '../services/crypto.js';
import { createSession, deleteSession } from '../services/session.js';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.js';
import { setSessionCookie, clearSessionCookie } from '../middleware/auth.js';

export const authRoutes = new Hono();

// ─── Email Registration ───────────────────────────────────

authRoutes.post('/register', async (c) => {
  const { name, email, password, locale, role, companyName, companyDescription } = await c.req.json();

  if (!name || !email || !password) {
    return c.json({ error: 'Name, email and password are required' }, 400);
  }

  if (password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  // Check if user exists
  const existing = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (existing) {
    return c.json({ error: 'Email already registered' }, 409);
  }

  const userId = generateId();
  const passwordHash = await hashPassword(password);

  const userRole = ['user', 'operator'].includes(role) ? role : 'user';
  await c.env.DB.prepare(
    'INSERT INTO users (id, email, name, password_hash, locale, role, company_name, company_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(userId, email.toLowerCase(), name, passwordHash, locale || 'uk', userRole, companyName || null, companyDescription || null).run();

  // Send verification email
  const token = generateToken();
  await sendVerificationEmail(c.env, email.toLowerCase(), token);

  // Create session (user can use app but with limited features until verified)
  const sessionId = await createSession(c.env.DB, userId);
  setSessionCookie(c, sessionId);

  return c.json({
    user: { id: userId, name, email: email.toLowerCase(), locale: locale || 'uk', email_verified: false, role: userRole },
    message: 'Registration successful. Please check your email to verify.',
  });
});

// ─── Email Login ──────────────────────────────────────────

authRoutes.post('/login', async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const user = await c.env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user || !user.password_hash) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const valid = await verifyPassword(password, user.password_hash);
  if (!valid) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const sessionId = await createSession(c.env.DB, user.id);
  setSessionCookie(c, sessionId);

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      locale: user.locale,
      role: user.role,
      email_verified: !!user.email_verified,
    },
  });
});

// ─── Verify Email ─────────────────────────────────────────

authRoutes.post('/verify-email', async (c) => {
  const { token } = await c.req.json();

  const data = await c.env.KV.get(`email_verify:${token}`, 'json');
  if (!data) {
    return c.json({ error: 'Invalid or expired verification token' }, 400);
  }

  await c.env.DB.prepare(
    'UPDATE users SET email_verified = 1 WHERE email = ?'
  ).bind(data.email).run();

  await c.env.KV.delete(`email_verify:${token}`);

  return c.json({ message: 'Email verified successfully' });
});

// ─── Resend Verification ──────────────────────────────────

authRoutes.post('/resend-verification', async (c) => {
  const { email } = await c.req.json();

  const user = await c.env.DB.prepare(
    'SELECT id, email_verified FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  if (!user) {
    return c.json({ message: 'If the email exists, a verification link was sent.' });
  }

  if (user.email_verified) {
    return c.json({ message: 'Email is already verified.' });
  }

  const token = generateToken();
  await sendVerificationEmail(c.env, email.toLowerCase(), token);

  return c.json({ message: 'Verification email sent.' });
});

// ─── Forgot Password ─────────────────────────────────────

authRoutes.post('/forgot-password', async (c) => {
  const { email } = await c.req.json();

  const user = await c.env.DB.prepare(
    'SELECT id FROM users WHERE email = ?'
  ).bind(email.toLowerCase()).first();

  // Always return success to prevent email enumeration
  if (user) {
    const token = generateToken();
    await sendPasswordResetEmail(c.env, email.toLowerCase(), token);
  }

  return c.json({ message: 'If the email exists, a reset link was sent.' });
});

// ─── Reset Password ──────────────────────────────────────

authRoutes.post('/reset-password', async (c) => {
  const { token, password } = await c.req.json();

  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const data = await c.env.KV.get(`password_reset:${token}`, 'json');
  if (!data) {
    return c.json({ error: 'Invalid or expired reset token' }, 400);
  }

  const passwordHash = await hashPassword(password);
  await c.env.DB.prepare(
    'UPDATE users SET password_hash = ? WHERE email = ?'
  ).bind(passwordHash, data.email).run();

  await c.env.KV.delete(`password_reset:${token}`);

  return c.json({ message: 'Password reset successfully' });
});

// ─── Logout ───────────────────────────────────────────────

authRoutes.post('/logout', async (c) => {
  const cookie = c.req.header('Cookie');
  const match = cookie?.match(/session_id=([^;]*)/);
  if (match) {
    await deleteSession(c.env.DB, decodeURIComponent(match[1]));
  }
  clearSessionCookie(c);
  return c.json({ message: 'Logged out' });
});

// ─── Get Current User ─────────────────────────────────────

authRoutes.get('/me', async (c) => {
  const cookie = c.req.header('Cookie');
  const match = cookie?.match(/session_id=([^;]*)/);
  if (!match) {
    return c.json({ user: null });
  }

  const session = await c.env.DB.prepare(
    "SELECT u.id, u.email, u.name, u.avatar, u.phone, u.location, u.locale, u.role, u.email_verified FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > datetime('now')"
  ).bind(decodeURIComponent(match[1])).first();

  if (!session) {
    clearSessionCookie(c);
    return c.json({ user: null });
  }

  return c.json({
    user: {
      id: session.id,
      email: session.email,
      name: session.name,
      avatar: session.avatar,
      phone: session.phone,
      location: session.location,
      locale: session.locale,
      role: session.role,
      email_verified: !!session.email_verified,
    },
  });
});

// ─── OAuth: Google ────────────────────────────────────────

authRoutes.get('/google', async (c) => {
  const state = generateToken();
  await c.env.KV.put(`oauth_state:${state}`, 'google', { expirationTtl: 600 });

  const params = new URLSearchParams({
    client_id: c.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/google`,
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'offline',
    prompt: 'consent',
  });

  return c.json({ url: `https://accounts.google.com/o/oauth2/v2/auth?${params}` });
});

authRoutes.post('/google/callback', async (c) => {
  const { code, state } = await c.req.json();

  // Verify state
  const storedProvider = await c.env.KV.get(`oauth_state:${state}`);
  if (storedProvider !== 'google') {
    return c.json({ error: 'Invalid state' }, 400);
  }
  await c.env.KV.delete(`oauth_state:${state}`);

  // Exchange code for token
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/google`,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return c.json({ error: 'Failed to get access token' }, 400);
  }

  // Get user info
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const profile = await userRes.json();

  return handleOAuthLogin(c, {
    provider: 'google',
    providerUserId: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
  });
});

// ─── OAuth: Facebook ──────────────────────────────────────

authRoutes.get('/facebook', async (c) => {
  const state = generateToken();
  await c.env.KV.put(`oauth_state:${state}`, 'facebook', { expirationTtl: 600 });

  const params = new URLSearchParams({
    client_id: c.env.FACEBOOK_APP_ID,
    redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/facebook`,
    response_type: 'code',
    scope: 'email,public_profile',
    state,
  });

  return c.json({ url: `https://www.facebook.com/v19.0/dialog/oauth?${params}` });
});

authRoutes.post('/facebook/callback', async (c) => {
  const { code, state } = await c.req.json();

  const storedProvider = await c.env.KV.get(`oauth_state:${state}`);
  if (storedProvider !== 'facebook') {
    return c.json({ error: 'Invalid state' }, 400);
  }
  await c.env.KV.delete(`oauth_state:${state}`);

  // Exchange code for token
  const tokenRes = await fetch('https://graph.facebook.com/v19.0/oauth/access_token?' + new URLSearchParams({
    client_id: c.env.FACEBOOK_APP_ID,
    client_secret: c.env.FACEBOOK_APP_SECRET,
    code,
    redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/facebook`,
  }));

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return c.json({ error: 'Failed to get access token' }, 400);
  }

  // Get user info
  const userRes = await fetch(
    `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`
  );
  const profile = await userRes.json();

  return handleOAuthLogin(c, {
    provider: 'facebook',
    providerUserId: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.picture?.data?.url,
    accessToken: tokenData.access_token,
  });
});

// ─── OAuth: X (Twitter) ──────────────────────────────────

authRoutes.get('/x', async (c) => {
  const state = generateToken();
  // X uses PKCE with OAuth 2.0
  const codeVerifier = generateToken();
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  await c.env.KV.put(`oauth_state:${state}`, JSON.stringify({ provider: 'x', codeVerifier }), {
    expirationTtl: 600,
  });

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: c.env.X_CLIENT_ID,
    redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/x`,
    scope: 'users.read tweet.read offline.access',
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return c.json({ url: `https://twitter.com/i/oauth2/authorize?${params}` });
});

authRoutes.post('/x/callback', async (c) => {
  const { code, state } = await c.req.json();

  const stateData = await c.env.KV.get(`oauth_state:${state}`, 'json');
  if (!stateData || stateData.provider !== 'x') {
    return c.json({ error: 'Invalid state' }, 400);
  }
  await c.env.KV.delete(`oauth_state:${state}`);

  // Exchange code for token
  const tokenRes = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + btoa(`${c.env.X_CLIENT_ID}:${c.env.X_CLIENT_SECRET}`),
    },
    body: new URLSearchParams({
      code,
      grant_type: 'authorization_code',
      redirect_uri: `${c.env.FRONTEND_URL}/auth/callback/x`,
      code_verifier: stateData.codeVerifier,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    return c.json({ error: 'Failed to get access token' }, 400);
  }

  // Get user info
  const userRes = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  const userData = await userRes.json();
  const profile = userData.data;

  return handleOAuthLogin(c, {
    provider: 'x',
    providerUserId: profile.id,
    email: null, // X doesn't always provide email
    name: profile.name || profile.username,
    avatar: profile.profile_image_url,
    accessToken: tokenData.access_token,
    refreshToken: tokenData.refresh_token,
  });
});

// ─── Shared OAuth handler ─────────────────────────────────

async function handleOAuthLogin(c, { provider, providerUserId, email, name, avatar, accessToken, refreshToken }) {
  // Check if OAuth account already linked
  const existing = await c.env.DB.prepare(
    'SELECT user_id FROM oauth_accounts WHERE provider = ? AND provider_user_id = ?'
  ).bind(provider, providerUserId).first();

  let userId;

  if (existing) {
    userId = existing.user_id;
    // Update tokens
    await c.env.DB.prepare(
      'UPDATE oauth_accounts SET access_token = ?, refresh_token = ? WHERE provider = ? AND provider_user_id = ?'
    ).bind(accessToken, refreshToken || null, provider, providerUserId).run();
  } else {
    // Check if user with this email exists
    let user = email
      ? await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase()).first()
      : null;

    if (user) {
      userId = user.id;
    } else {
      // Create new user
      userId = generateId();
      await c.env.DB.prepare(
        'INSERT INTO users (id, email, name, avatar, email_verified) VALUES (?, ?, ?, ?, 1)'
      ).bind(userId, email?.toLowerCase() || `${provider}_${providerUserId}@oauth.local`, name, avatar).run();
    }

    // Link OAuth account
    await c.env.DB.prepare(
      'INSERT INTO oauth_accounts (id, user_id, provider, provider_user_id, access_token, refresh_token) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(generateId(), userId, provider, providerUserId, accessToken, refreshToken || null).run();
  }

  // Get user data
  const user = await c.env.DB.prepare(
    'SELECT id, email, name, avatar, locale, email_verified FROM users WHERE id = ?'
  ).bind(userId).first();

  const sessionId = await createSession(c.env.DB, userId);
  setSessionCookie(c, sessionId);

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      locale: user.locale,
      email_verified: !!user.email_verified,
    },
  });
}
