const express = require('express');
const authRoutes = require('./routes/auth');
const userManagementRoutes = require('./routes/userManagement');

const app = express();
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userManagementRoutes);
app.use('/phonebook', require('./routes/phoneBook'));
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
