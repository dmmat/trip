import { Hono } from 'hono';
import { generateId } from '../services/crypto.js';

export const tripRoutes = new Hono();

// ─── List user's trips ───────────────────────────────────

tripRoutes.get('/', async (c) => {
  const user = c.get('user');

  const trips = await c.env.DB.prepare(`
    SELECT t.*, tp.role,
      (SELECT COUNT(*) FROM trip_participants WHERE trip_id = t.id) as participant_count
    FROM trips t
    JOIN trip_participants tp ON tp.trip_id = t.id AND tp.user_id = ?
    ORDER BY t.created_at DESC
  `).bind(user.id).all();

  // Enrich with locations
  const enriched = await Promise.all(
    trips.results.map(async (trip) => {
      const locations = await c.env.DB.prepare(
        'SELECT name FROM trip_locations WHERE trip_id = ? ORDER BY sort_order'
      ).bind(trip.id).all();

      const expenses = await c.env.DB.prepare(
        'SELECT COALESCE(SUM(amount), 0) as total FROM expense_items WHERE trip_id = ?'
      ).bind(trip.id).first();

      return {
        ...trip,
        locations: locations.results.map((l) => l.name),
        totalExpenses: expenses.total,
      };
    })
  );

  return c.json({ trips: enriched });
});

// ─── Get single trip ─────────────────────────────────────

tripRoutes.get('/:id', async (c) => {
  const user = c.get('user');
  const tripId = c.req.param('id');

  // Verify user is participant
  const participant = await c.env.DB.prepare(
    'SELECT role FROM trip_participants WHERE trip_id = ? AND user_id = ?'
  ).bind(tripId, user.id).first();

  if (!participant) {
    return c.json({ error: 'Trip not found' }, 404);
  }

  const trip = await c.env.DB.prepare('SELECT * FROM trips WHERE id = ?').bind(tripId).first();
  if (!trip) return c.json({ error: 'Trip not found' }, 404);

  // Load all related data
  const [locations, participants, categories, schedule, documents, messages] = await Promise.all([
    c.env.DB.prepare('SELECT * FROM trip_locations WHERE trip_id = ? ORDER BY sort_order').bind(tripId).all(),
    c.env.DB.prepare(`
      SELECT u.id, u.name, u.email, u.avatar, tp.role
      FROM trip_participants tp JOIN users u ON tp.user_id = u.id
      WHERE tp.trip_id = ?
    `).bind(tripId).all(),
    c.env.DB.prepare('SELECT * FROM expense_categories WHERE trip_id = ?').bind(tripId).all(),
    c.env.DB.prepare('SELECT * FROM schedule_days WHERE trip_id = ? ORDER BY date').bind(tripId).all(),
    c.env.DB.prepare('SELECT * FROM documents WHERE trip_id = ? ORDER BY created_at DESC').bind(tripId).all(),
    c.env.DB.prepare(`
      SELECT cm.*, u.name as user_name, u.avatar as user_avatar
      FROM chat_messages cm JOIN users u ON cm.user_id = u.id
      WHERE cm.trip_id = ? ORDER BY cm.created_at ASC
    `).bind(tripId).all(),
  ]);

  // Load expense items for each category
  const expenseCategories = await Promise.all(
    categories.results.map(async (cat) => {
      const items = await c.env.DB.prepare(`
        SELECT ei.*, u.name as paid_by_name
        FROM expense_items ei JOIN users u ON ei.paid_by = u.id
        WHERE ei.category_id = ?
      `).bind(cat.id).all();

      const itemsWithSplits = await Promise.all(
        items.results.map(async (item) => {
          const splits = await c.env.DB.prepare(
            'SELECT user_id FROM expense_splits WHERE expense_item_id = ?'
          ).bind(item.id).all();
          return { ...item, splitBetween: splits.results.map((s) => s.user_id) };
        })
      );

      return { ...cat, items: itemsWithSplits };
    })
  );

  // Load events for each schedule day
  const scheduleDays = await Promise.all(
    schedule.results.map(async (day) => {
      const events = await c.env.DB.prepare(
        'SELECT * FROM schedule_events WHERE day_id = ? ORDER BY sort_order, time'
      ).bind(day.id).all();
      return { ...day, events: events.results };
    })
  );

  return c.json({
    trip: {
      ...trip,
      locations: locations.results,
      participants: participants.results,
      expenses: { categories: expenseCategories },
      schedule: { days: scheduleDays },
      documents: documents.results,
      chat: { messages: messages.results },
    },
  });
});

// ─── Create trip ─────────────────────────────────────────

tripRoutes.post('/', async (c) => {
  const user = c.get('user');
  const { name, description, startDate, endDate, locations } = await c.req.json();

  if (!name) {
    return c.json({ error: 'Trip name is required' }, 400);
  }

  const tripId = generateId();

  await c.env.DB.prepare(
    'INSERT INTO trips (id, name, description, start_date, end_date, created_by) VALUES (?, ?, ?, ?, ?, ?)'
  ).bind(tripId, name, description || null, startDate || null, endDate || null, user.id).run();

  // Add creator as organizer
  await c.env.DB.prepare(
    'INSERT INTO trip_participants (id, trip_id, user_id, role) VALUES (?, ?, ?, ?)'
  ).bind(generateId(), tripId, user.id, 'organizer').run();

  // Add locations
  if (locations?.length) {
    for (let i = 0; i < locations.length; i++) {
      const loc = typeof locations[i] === 'string' ? { name: locations[i] } : locations[i];
      await c.env.DB.prepare(
        'INSERT INTO trip_locations (id, trip_id, name, country, sort_order) VALUES (?, ?, ?, ?, ?)'
      ).bind(generateId(), tripId, loc.name, loc.country || null, i).run();
    }
  }

  return c.json({
    trip: { id: tripId, name, description, start_date: startDate, end_date: endDate },
  }, 201);
});

// ─── Update trip ─────────────────────────────────────────

tripRoutes.put('/:id', async (c) => {
  const user = c.get('user');
  const tripId = c.req.param('id');
  const { name, description, startDate, endDate, status } = await c.req.json();

  // Check organizer
  const participant = await c.env.DB.prepare(
    'SELECT role FROM trip_participants WHERE trip_id = ? AND user_id = ?'
  ).bind(tripId, user.id).first();

  if (!participant || participant.role !== 'organizer') {
    return c.json({ error: 'Only organizers can update trips' }, 403);
  }

  await c.env.DB.prepare(
    "UPDATE trips SET name = COALESCE(?, name), description = COALESCE(?, description), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), status = COALESCE(?, status), updated_at = datetime('now') WHERE id = ?"
  ).bind(name, description, startDate, endDate, status, tripId).run();

  return c.json({ message: 'Trip updated' });
});

// ─── Delete trip ─────────────────────────────────────────

tripRoutes.delete('/:id', async (c) => {
  const user = c.get('user');
  const tripId = c.req.param('id');

  const trip = await c.env.DB.prepare(
    'SELECT created_by FROM trips WHERE id = ?'
  ).bind(tripId).first();

  if (!trip || trip.created_by !== user.id) {
    return c.json({ error: 'Only trip creator can delete' }, 403);
  }

  await c.env.DB.prepare('DELETE FROM trips WHERE id = ?').bind(tripId).run();
  return c.json({ message: 'Trip deleted' });
});

// ─── Chat: Send message ─────────────────────────────────

tripRoutes.post('/:id/messages', async (c) => {
  const user = c.get('user');
  const tripId = c.req.param('id');
  const { message } = await c.req.json();

  if (!message?.trim()) {
    return c.json({ error: 'Message is required' }, 400);
  }

  const participant = await c.env.DB.prepare(
    'SELECT id FROM trip_participants WHERE trip_id = ? AND user_id = ?'
  ).bind(tripId, user.id).first();

  if (!participant) {
    return c.json({ error: 'Not a participant' }, 403);
  }

  const msgId = generateId();
  await c.env.DB.prepare(
    'INSERT INTO chat_messages (id, trip_id, user_id, message) VALUES (?, ?, ?, ?)'
  ).bind(msgId, tripId, user.id, message.trim()).run();

  return c.json({
    message: { id: msgId, trip_id: tripId, user_id: user.id, message: message.trim(), user_name: user.name },
  }, 201);
});
