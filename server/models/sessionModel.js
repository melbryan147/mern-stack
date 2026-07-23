const db = require('../db');

async function createSession(userId, token, ip, agent, expiresAt) {
  await db.execute(
    'INSERT INTO sessions (session_id, user_id, token, ip_address, user_agent, expires_at) VALUES (UUID(), ?, ?, ?, ?, ?)',
    [userId, token, ip, agent, expiresAt]
  );
}

async function findSession(token) {
  const [rows] = await db.execute('SELECT * FROM sessions WHERE token = ?', [token]);
  return rows[0];
}

module.exports = { createSession, findSession };
