import { Hono } from 'hono';
import { generateId, generateToken } from '../services/crypto.js';

export const inviteRoutes = new Hono();

// ─── Create invite link ──────────────────────────────────

inviteRoutes.post('/', async (c) => {
  const user = c.get('user');
  const { tripId, tourId, maxUses, expiresInDays } = await c.req.json();

  if (!tripId && !tourId) {
    return c.json({ error: 'tripId or tourId required' }, 400);
  }

  // Verify ownership
  if (tripId) {
    const participant = await c.env.DB.prepare(
      "SELECT role FROM trip_participants WHERE trip_id = ? AND user_id = ?"
    ).bind(tripId, user.id).first();
    if (!participant) return c.json({ error: 'Not a participant' }, 403);
  }

  if (tourId) {
    const tour = await c.env.DB.prepare(
      'SELECT operator_id FROM operator_tours WHERE id = ?'
    ).bind(tourId).first();
    if (!tour || tour.operator_id !== user.id) return c.json({ error: 'Not tour owner' }, 403);
  }

  const code = generateToken().substring(0, 12);
  const expiresAt = expiresInDays
    ? new Date(Date.now() + expiresInDays * 86400000).toISOString()
    : null;

  await c.env.DB.prepare(
    'INSERT INTO invite_links (id, code, trip_id, tour_id, created_by, max_uses, expires_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(generateId(), code, tripId || null, tourId || null, user.id, maxUses || 0, expiresAt).run();

  return c.json({ code, url: `${c.env.FRONTEND_URL}/join/${code}` }, 201);
});

// ─── Use invite link (join trip/tour) ────────────────────

inviteRoutes.post('/:code/join', async (c) => {
  const user = c.get('user');
  const code = c.req.param('code');

  const invite = await c.env.DB.prepare(
    'SELECT * FROM invite_links WHERE code = ?'
  ).bind(code).first();

  if (!invite) return c.json({ error: 'Invalid invite code' }, 404);
  if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
    return c.json({ error: 'Invite expired' }, 410);
  }
  if (invite.max_uses > 0 && invite.uses >= invite.max_uses) {
    return c.json({ error: 'Invite link usage limit reached' }, 410);
  }

  // Join trip
  if (invite.trip_id) {
    const existing = await c.env.DB.prepare(
      'SELECT id FROM trip_participants WHERE trip_id = ? AND user_id = ?'
    ).bind(invite.trip_id, user.id).first();

    if (!existing) {
      await c.env.DB.prepare(
        'INSERT INTO trip_participants (id, trip_id, user_id, role) VALUES (?, ?, ?, ?)'
      ).bind(generateId(), invite.trip_id, user.id, 'participant').run();
    }
  }

  // Join tour
  if (invite.tour_id) {
    const existing = await c.env.DB.prepare(
      'SELECT id FROM tour_participants WHERE tour_id = ? AND user_id = ?'
    ).bind(invite.tour_id, user.id).first();

    if (!existing) {
      await c.env.DB.prepare(
        'INSERT INTO tour_participants (id, tour_id, user_id) VALUES (?, ?, ?)'
      ).bind(generateId(), invite.tour_id, user.id).run();
    }
  }

  // Increment uses
  await c.env.DB.prepare(
    'UPDATE invite_links SET uses = uses + 1 WHERE id = ?'
  ).bind(invite.id).run();

  return c.json({
    joined: true,
    tripId: invite.trip_id,
    tourId: invite.tour_id,
  });
});

// ─── Get invite info (public) ────────────────────────────

inviteRoutes.get('/:code', async (c) => {
  const code = c.req.param('code');

  const invite = await c.env.DB.prepare(
    'SELECT il.*, t.name as trip_name, ot.name as tour_name FROM invite_links il LEFT JOIN trips t ON il.trip_id = t.id LEFT JOIN operator_tours ot ON il.tour_id = ot.id WHERE il.code = ?'
  ).bind(code).first();

  if (!invite) return c.json({ error: 'Invalid invite' }, 404);

  return c.json({
    code: invite.code,
    tripName: invite.trip_name,
    tourName: invite.tour_name,
    valid: (!invite.expires_at || new Date(invite.expires_at) > new Date()) &&
           (invite.max_uses === 0 || invite.uses < invite.max_uses),
  });
});
