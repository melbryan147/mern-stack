const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, findUserByEmail } = require('../models/userModel');
const { createSession } = require('../models/sessionModel');

const SECRET = 'supersecretkey';

async function signup(req, res) {
  const { username, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  const userId = await createUser(username, email, hash);
  res.json({ message: 'User created', userId });
}

async function signin(req, res) {
  const { email, password } = req.body;
  const user = await findUserByEmail(email);

  if (!user) return res.status(404).json({ error: 'User not found' });

  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user.user_id }, SECRET, { expiresIn: '1h' });
  await createSession(user.user_id, token, req.ip, req.headers['user-agent'], new Date(Date.now() + 3600000));

  res.json({ message: 'Login successful', token });
}

module.exports = { signup, signin };
