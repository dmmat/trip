import { Hono } from 'hono';

export const userRoutes = new Hono();

// ─── Get current user profile ─────────────────────────────

userRoutes.get('/me', async (c) => {
  const user = c.get('user');

  const fullUser = await c.env.DB.prepare(
    'SELECT id, email, name, avatar, phone, location, locale, email_verified, created_at FROM users WHERE id = ?'
  ).bind(user.id).first();

  return c.json({ user: fullUser });
});

// ─── Update profile ───────────────────────────────────────

userRoutes.put('/me', async (c) => {
  const user = c.get('user');
  const { name, phone, location, locale, avatar } = await c.req.json();

  await c.env.DB.prepare(
    "UPDATE users SET name = COALESCE(?, name), phone = COALESCE(?, phone), location = COALESCE(?, location), locale = COALESCE(?, locale), avatar = COALESCE(?, avatar), updated_at = datetime('now') WHERE id = ?"
  ).bind(name, phone, location, locale, avatar, user.id).run();

  const updated = await c.env.DB.prepare(
    'SELECT id, email, name, avatar, phone, location, locale, email_verified FROM users WHERE id = ?'
  ).bind(user.id).first();

  return c.json({ user: updated });
});

// ─── Update locale ────────────────────────────────────────

userRoutes.put('/me/locale', async (c) => {
  const user = c.get('user');
  const { locale } = await c.req.json();

  if (!['uk', 'en'].includes(locale)) {
    return c.json({ error: 'Invalid locale' }, 400);
  }

  await c.env.DB.prepare(
    'UPDATE users SET locale = ? WHERE id = ?'
  ).bind(locale, user.id).run();

  return c.json({ locale });
});
