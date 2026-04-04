export async function authMiddleware(c, next) {
  // Skip auth for auth routes
  if (c.req.path.startsWith('/api/auth')) {
    return next();
  }

  const sessionId = getCookie(c, 'session_id');
  if (!sessionId) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const session = await c.env.DB.prepare(
      'SELECT s.*, u.id as user_id, u.email, u.name, u.avatar, u.locale FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.id = ? AND s.expires_at > datetime(\'now\')'
    ).bind(sessionId).first();

    if (!session) {
      return c.json({ error: 'Session expired' }, 401);
    }

    c.set('user', {
      id: session.user_id,
      email: session.email,
      name: session.name,
      avatar: session.avatar,
      locale: session.locale,
    });

    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return c.json({ error: 'Unauthorized' }, 401);
  }
}

function getCookie(c, name) {
  const cookie = c.req.header('Cookie');
  if (!cookie) return null;
  const match = cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function setSessionCookie(c, sessionId, maxAge = 60 * 60 * 24 * 30) {
  const isSecure = c.req.url.startsWith('https');
  c.header(
    'Set-Cookie',
    `session_id=${sessionId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isSecure ? '; Secure' : ''}`
  );
}

export function clearSessionCookie(c) {
  c.header(
    'Set-Cookie',
    'session_id=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0'
  );
}
