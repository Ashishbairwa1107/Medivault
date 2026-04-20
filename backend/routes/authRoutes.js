const express = require('express');
const { registerUser, loginUser, logoutUser, googleAuth, addDoctor } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);
router.post('/add-doctor', protect, addDoctor);

module.exports = router;
