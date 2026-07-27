const express = require('express');
const cors = require('cors')
const authRoutes = require('./routes/auth');
const userManagementRoutes = require('./routes/userManagement');
const phoneBookRoutes = require('./routes/phoneBook');
const shareContactRoutes = require('./routes/shareContactRoutes'); // Import the share contact routes


const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/user', userManagementRoutes);
app.use('/phonebook', phoneBookRoutes);
app.use('/contacts', shareContactRoutes);
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
