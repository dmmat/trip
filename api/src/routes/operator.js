import { Hono } from 'hono';
import { generateId } from '../services/crypto.js';

export const operatorRoutes = new Hono();

// Middleware: ensure user is operator
operatorRoutes.use('*', async (c, next) => {
  const user = c.get('user');
  if (user.role !== 'operator') {
    return c.json({ error: 'Operator access required' }, 403);
  }
  return next();
});

// ─── Dashboard stats ─────────────────────────────────────

operatorRoutes.get('/stats', async (c) => {
  const user = c.get('user');

  const [tours, clients, revenue, invites] = await Promise.all([
    c.env.DB.prepare('SELECT COUNT(*) as count FROM operator_tours WHERE operator_id = ?').bind(user.id).first(),
    c.env.DB.prepare('SELECT COUNT(DISTINCT tp.user_id) as count FROM tour_participants tp JOIN operator_tours ot ON tp.tour_id = ot.id WHERE ot.operator_id = ?').bind(user.id).first(),
    c.env.DB.prepare('SELECT COALESCE(SUM(tp.amount_paid), 0) as total FROM tour_participants tp JOIN operator_tours ot ON tp.tour_id = ot.id WHERE ot.operator_id = ?').bind(user.id).first(),
    c.env.DB.prepare('SELECT COUNT(*) as count FROM invite_links WHERE created_by = ? AND tour_id IS NOT NULL').bind(user.id).first(),
  ]);

  return c.json({
    tours: tours.count,
    clients: clients.count,
    revenue: revenue.total,
    invites: invites.count,
  });
});

// ─── List operator's tours ───────────────────────────────

operatorRoutes.get('/tours', async (c) => {
  const user = c.get('user');

  const tours = await c.env.DB.prepare(`
    SELECT ot.*,
      (SELECT COUNT(*) FROM tour_participants WHERE tour_id = ot.id) as participant_count,
      (SELECT COALESCE(SUM(amount_paid), 0) FROM tour_participants WHERE tour_id = ot.id) as total_revenue
    FROM operator_tours ot WHERE ot.operator_id = ? ORDER BY ot.created_at DESC
  `).bind(user.id).all();

  return c.json({ tours: tours.results });
});

// ─── Create tour ─────────────────────────────────────────

operatorRoutes.post('/tours', async (c) => {
  const user = c.get('user');
  const { name, description, startDate, endDate, price, currency, maxParticipants, tags, locations } = await c.req.json();

  if (!name) return c.json({ error: 'Tour name required' }, 400);

  const tourId = generateId();
  await c.env.DB.prepare(
    'INSERT INTO operator_tours (id, operator_id, name, description, start_date, end_date, price, currency, max_participants, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(tourId, user.id, name, description || null, startDate || null, endDate || null, price || 0, currency || 'UAH', maxParticipants || 0, JSON.stringify(tags || [])).run();

  if (locations?.length) {
    for (let i = 0; i < locations.length; i++) {
      const loc = typeof locations[i] === 'string' ? { name: locations[i] } : locations[i];
      await c.env.DB.prepare(
        'INSERT INTO tour_locations (id, tour_id, name, country, sort_order) VALUES (?, ?, ?, ?, ?)'
      ).bind(generateId(), tourId, loc.name, loc.country || null, i).run();
    }
  }

  return c.json({ tour: { id: tourId, name } }, 201);
});

// ─── Get tour details ────────────────────────────────────

operatorRoutes.get('/tours/:id', async (c) => {
  const user = c.get('user');
  const tourId = c.req.param('id');

  const tour = await c.env.DB.prepare(
    'SELECT * FROM operator_tours WHERE id = ? AND operator_id = ?'
  ).bind(tourId, user.id).first();

  if (!tour) return c.json({ error: 'Tour not found' }, 404);

  const [locations, participants, expenses, invites] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM tour_locations WHERE tour_id = ? ORDER BY sort_order').bind(tourId).all(),
    c.env.DB.prepare('SELECT tp.*, u.name, u.email, u.avatar FROM tour_participants tp JOIN users u ON tp.user_id = u.id WHERE tp.tour_id = ?').bind(tourId).all(),
    c.env.DB.prepare('SELECT * FROM tour_expenses WHERE tour_id = ? ORDER BY created_at DESC').bind(tourId).all(),
    c.env.DB.prepare('SELECT * FROM invite_links WHERE tour_id = ? ORDER BY created_at DESC').bind(tourId).all(),
  ]);

  return c.json({
    tour: {
      ...tour,
      tags: JSON.parse(tour.tags || '[]'),
      locations: locations.results,
      participants: participants.results,
      expenses: expenses.results,
      invites: invites.results,
    },
  });
});

// ─── Update tour ─────────────────────────────────────────

operatorRoutes.put('/tours/:id', async (c) => {
  const user = c.get('user');
  const tourId = c.req.param('id');
  const { name, description, startDate, endDate, price, currency, maxParticipants, status, tags } = await c.req.json();

  const tour = await c.env.DB.prepare(
    'SELECT id FROM operator_tours WHERE id = ? AND operator_id = ?'
  ).bind(tourId, user.id).first();

  if (!tour) return c.json({ error: 'Tour not found' }, 404);

  await c.env.DB.prepare(
    "UPDATE operator_tours SET name = COALESCE(?, name), description = COALESCE(?, description), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), price = COALESCE(?, price), currency = COALESCE(?, currency), max_participants = COALESCE(?, max_participants), status = COALESCE(?, status), tags = COALESCE(?, tags), updated_at = datetime('now') WHERE id = ?"
  ).bind(name, description, startDate, endDate, price, currency, maxParticipants, status, tags ? JSON.stringify(tags) : null, tourId).run();

  return c.json({ message: 'Tour updated' });
});

// ─── Add tour expense ────────────────────────────────────

operatorRoutes.post('/tours/:id/expenses', async (c) => {
  const user = c.get('user');
  const tourId = c.req.param('id');
  const { name, category, amount, currency } = await c.req.json();

  const tour = await c.env.DB.prepare(
    'SELECT id FROM operator_tours WHERE id = ? AND operator_id = ?'
  ).bind(tourId, user.id).first();

  if (!tour) return c.json({ error: 'Tour not found' }, 404);

  const id = generateId();
  await c.env.DB.prepare(
    'INSERT INTO tour_expenses (id, tour_id, name, category, amount, currency) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(id, tourId, name, category || null, amount, currency || 'UAH').run();

  return c.json({ expense: { id, name, amount } }, 201);
});

// ─── Delete tour ─────────────────────────────────────────

operatorRoutes.delete('/tours/:id', async (c) => {
  const user = c.get('user');
  const tourId = c.req.param('id');

  const tour = await c.env.DB.prepare(
    'SELECT id FROM operator_tours WHERE id = ? AND operator_id = ?'
  ).bind(tourId, user.id).first();

  if (!tour) return c.json({ error: 'Tour not found' }, 404);

  await c.env.DB.prepare('DELETE FROM operator_tours WHERE id = ?').bind(tourId).run();
  return c.json({ message: 'Tour deleted' });
});
