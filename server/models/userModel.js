const db = require('../db');

async function createUser(username, email, passwordHash, role) {
  try {
    const [result] = await db.pool.execute(
      'INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, role]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function findUserByEmail(email) {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
}

module.exports = { createUser, findUserByEmail };
