const db = require('../db');

async function createResetToken(userId, token, expiresAt) {
  await db.pool.execute(
    'INSERT INTO password_resets (reset_id, user_id, reset_token, expires_at, used) VALUES (UUID(), ?, ?, ?, FALSE)',
    [userId, token, expiresAt]
  );
}

async function findResetToken(token) {
  const [rows] = await db.pool.execute(
    'SELECT * FROM password_resets WHERE reset_token = ? AND used = FALSE AND expires_at > NOW()',
    [token]
  );
  return rows[0];
}

async function markTokenUsed(token) {
  await db.pool.execute(
    'UPDATE password_resets SET used = TRUE WHERE reset_token = ?',
    [token]
  );
}

module.exports = { createResetToken, findResetToken, markTokenUsed };
