const db = require('../db');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { createUser, findUserByEmail } = require('../models/userModel');

// Activate/Deactivate user
async function toggleUserStatus(req, res) {
  try {
    const { targetUserId, action, performedBy } = req.body;
    const newStatus = action === "activate";
    console.log(req.body)
    // Update user status
    await db.pool.execute(
      "UPDATE users SET is_active = ?, updated_at = NOW() WHERE user_id = ?",
      [newStatus, targetUserId]
    );

    // // Insert into audit log
    // await db.pool.execute(
    //   "INSERT INTO user_management_actions (performed_by, target_user, action) VALUES (?, ?, ?)",
    //   [performedBy, targetUserId, action]
    // );

    // Fetch updated user row
    const [updatedRows] = await db.pool.execute(
      "SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE user_id = ?",
      [targetUserId]
    );

    if (updatedRows.length === 0) {
      return res.status(404).json({ error: "User not found after update" });
    }

    // Return the updated user object
    console.log(updatedRows[0])
    res.json(updatedRows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function insertUser(req, res) {
  try {
    const { username, email, password, role} = req.body;
    const hash = await bcrypt.hash(password, 10);
    const userId = await createUser(username, email, hash,role);
    res.json({ message: 'User created', userId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function updateUser(req, res) {
  try {
    const { userId } = req.params;
    const [rows] = await db.pool.execute(
      "SELECT * FROM users WHERE user_id = ?",
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const { username, email, role } = req.body;

    // fallback to existing values if not provided
    const updatedUsername = username ?? rows[0].username;
    const updatedEmail = email ?? rows[0].email;
    const updatedRole = role ?? rows[0].role;

    // perform update
    await db.pool.execute(
      "UPDATE users SET username = ?, email = ?, role = ?, updated_at = NOW() WHERE user_id = ?",
      [updatedUsername, updatedEmail, updatedRole, userId]
    );

    // fetch updated row
    const [updatedRows] = await db.pool.execute(
      "SELECT user_id, username, email, password_hash, role, is_active, created_at, updated_at FROM users WHERE user_id = ?",
      [userId]
    );

    res.json(updatedRows[0]); // return the updated user object
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function deleteUser(req, res) {
  try {
    const { userId } = req.params;
    await db.pool.execute('DELETE FROM users WHERE user_id = ?', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    const [rows] = await db.pool.execute('SELECT * FROM users WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
async function getAllUsers(req, res) {
  try {
    const [rows] = await db.pool.execute('SELECT * FROM users');
    res.json(rows);
  }
  catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
module.exports = { toggleUserStatus, insertUser, updateUser, deleteUser, getUserById, getAllUsers };
