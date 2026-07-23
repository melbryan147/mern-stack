const db = require('../db');

async function createUser(username, email, passwordHash, role = 'user') {
  const [result] = await db.execute(
    'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [username, email, passwordHash, role]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

module.exports = { createUser, findUserByEmail };
