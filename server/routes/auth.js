const express = require('express');
const { requestReset, confirmReset } = require('../controllers/passwordResetController');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/reset/request', requestReset);
router.post('/reset/confirm', confirmReset);

module.exports = router;
