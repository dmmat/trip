// Email service using KV for verification tokens
// In production, integrate with Resend, Mailgun, or SendGrid

export async function sendVerificationEmail(env, email, token) {
  const verifyUrl = `${env.FRONTEND_URL}/verify-email?token=${token}`;

  // Store token in KV with 24h expiration
  await env.KV.put(`email_verify:${token}`, JSON.stringify({ email }), {
    expirationTtl: 86400, // 24 hours
  });

  // If EMAIL_API_KEY is configured, send actual email
  // For now, log the verification URL (replace with real email service)
  if (env.EMAIL_API_KEY) {
    // Example with Resend API
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM || 'TripPlanner <noreply@tripplanner.app>',
          to: [email],
          subject: 'Verify your email - TripPlanner',
          html: `
            <h2>Welcome to TripPlanner!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="${verifyUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">Verify Email</a>
            <p>Or copy this link: ${verifyUrl}</p>
            <p>This link expires in 24 hours.</p>
          `,
        }),
      });
    } catch (err) {
      console.error('Failed to send email:', err);
    }
  } else {
    console.log(`[DEV] Verification URL for ${email}: ${verifyUrl}`);
  }
}

export async function sendPasswordResetEmail(env, email, token) {
  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${token}`;

  await env.KV.put(`password_reset:${token}`, JSON.stringify({ email }), {
    expirationTtl: 3600, // 1 hour
  });

  if (env.EMAIL_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.EMAIL_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: env.EMAIL_FROM || 'TripPlanner <noreply@tripplanner.app>',
          to: [email],
          subject: 'Reset your password - TripPlanner',
          html: `
            <h2>Password Reset</h2>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display:inline-block;padding:12px 24px;background:#2563eb;color:white;text-decoration:none;border-radius:8px;">Reset Password</a>
            <p>Or copy this link: ${resetUrl}</p>
            <p>This link expires in 1 hour.</p>
          `,
        }),
      });
    } catch (err) {
      console.error('Failed to send reset email:', err);
    }
  } else {
    console.log(`[DEV] Password reset URL for ${email}: ${resetUrl}`);
  }
}
