const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { findUserByEmail } = require('../models/userModel');
const { createResetToken, findResetToken, markTokenUsed } = require('../models/passwordResetModel');
const db = require('../db');

// Step 1: Request password reset
async function requestReset(req, res) {
  const { email } = req.body;
  const user = await findUserByEmail(email);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour expiry

  await createResetToken(user.user_id, token, expiresAt);

  // Normally you'd send this token via email
  res.json({ message: 'Password reset requested', resetToken: token });
}

// Step 2: Confirm password reset
async function confirmReset(req, res) {
  const { token, newPassword } = req.body;
  const reset = await findResetToken(token);

  if (!reset) return res.status(400).json({ error: 'Invalid or expired token' });

  const hash = await bcrypt.hash(newPassword, 10);

  await db.pool.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', [hash, reset.user_id]);
  await markTokenUsed(token);

  res.json({ message: 'Password reset successful' });
}

module.exports = { requestReset, confirmReset };
