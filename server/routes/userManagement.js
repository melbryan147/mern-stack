const express = require('express');
const { toggleUserStatus, insertUser,updateUser,deleteUser, getUserById, getAllUsers} = require('../controllers/userManagementController');
const router = express.Router();

router.post('/toggle', toggleUserStatus);
router.post('/insert', insertUser);
router.get('/get/:userId', getUserById);
router.get('/all', getAllUsers);
router.put('/update/:userId', updateUser);
router.delete('/delete/:userId', deleteUser);

module.exports = router;
