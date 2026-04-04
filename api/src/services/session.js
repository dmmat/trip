import { generateId } from './crypto.js';

export async function createSession(db, userId) {
  const sessionId = generateId();
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days

  await db.prepare(
    'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
  ).bind(sessionId, userId, expiresAt).run();

  return sessionId;
}

export async function deleteSession(db, sessionId) {
  await db.prepare('DELETE FROM sessions WHERE id = ?').bind(sessionId).run();
}

export async function cleanExpiredSessions(db) {
  await db.prepare("DELETE FROM sessions WHERE expires_at < datetime('now')").run();
}
