const express = require('express');
const cors = require('cors')
const path = require('path');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const userManagementRoutes = require('./routes/userManagement');
const phoneBookRoutes = require('./routes/phoneBook');
const shareContactRoutes = require('./routes/shareContactRoutes'); // Import the share contact routes


const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());

app.use('/auth', authRoutes);
app.use('/user', userManagementRoutes);
app.use('/phonebook', phoneBookRoutes);
app.use('/contacts', shareContactRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
