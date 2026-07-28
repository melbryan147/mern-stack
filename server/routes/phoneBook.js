const express = require('express');
const router = express.Router();
const {setSecurityHeaders} = require('../middleware');
const {protect, isSamerole} = require('../middleware/index');

const phoneBookController = require('../controllers/phoneBookController');

router.post('/contacts', protect,setSecurityHeaders, phoneBookController.addContact);
router.get('/contacts', protect, phoneBookController.getContacts);
router.put('/contacts/:id',protect, setSecurityHeaders, phoneBookController.updateContact);
router.delete('/contacts/:id',protect, phoneBookController.deleteContact);

module.exports = router;
