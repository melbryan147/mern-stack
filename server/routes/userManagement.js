const express = require('express');
const { toggleUserStatus } = require('../controllers/userManagementController');
const router = express.Router();

router.post('/toggle', toggleUserStatus);

module.exports = router;
