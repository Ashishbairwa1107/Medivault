const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  addDoctor
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);

// Doctor management
router.post('/add-doctor', protect, addDoctor);

module.exports = router;