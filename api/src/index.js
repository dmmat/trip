import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authRoutes } from './routes/auth.js';
import { tripRoutes } from './routes/trips.js';
import { userRoutes } from './routes/users.js';
import { authMiddleware } from './middleware/auth.js';

const app = new Hono();

// CORS
app.use('*', async (c, next) => {
  const corsMiddleware = cors({
    origin: [c.env.FRONTEND_URL, 'http://localhost:5173'],
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  return corsMiddleware(c, next);
});

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Auth routes (public)
app.route('/api/auth', authRoutes);

// Protected routes
app.use('/api/*', authMiddleware);
app.route('/api/trips', tripRoutes);
app.route('/api/users', userRoutes);

// 404
app.notFound((c) => c.json({ error: 'Not found' }, 404));

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

export default app;
