const express = require('express');
const router = express.Router();
const phoneBookController = require('../controllers/phoneBookController');

router.post('/contacts', phoneBookController.addContact);
router.get('/contacts', phoneBookController.getContacts);
router.put('/contacts/:id', phoneBookController.updateContact);
router.delete('/contacts/:id', phoneBookController.deleteContact);

module.exports = router;
