const express = require('express');
const { toggleUserStatus, insertUser,updateUser,deleteUser, getUserById, getAllUsers} = require('../controllers/userManagementController');
const {protect, isSamerole} = require('../middleware/index');
const router = express.Router();

router.post('/toggle', protect,isSamerole, toggleUserStatus);
router.post('/insert', protect, insertUser);
router.get('/get/:userId', protect, getUserById);
router.get('/all', protect, getAllUsers);
router.put('/update/:userId', protect, updateUser);
router.delete('/delete/:userId', protect, deleteUser);

module.exports = router;
