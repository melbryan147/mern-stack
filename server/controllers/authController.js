const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { createSession } = require('../models/sessionModel');

const SECRET = process.env.JWT_SECRET;

async function signup(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);

    const userId = await createUser(username, email, hash, role);
    res.json({ message: 'User created', userId });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
}

async function signin(req, res) {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.user_id }, SECRET, { expiresIn: '1h' });
  await createSession(user.user_id, token, req.ip, req.headers['user-agent'], new Date(Date.now() + 3600000));

  res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: 'Error signing in' });
  }
}

module.exports = { signup, signin };
