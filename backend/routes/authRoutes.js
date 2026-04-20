const express = require('express');
const {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  addDoctor
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

console.log('registerUser:', typeof registerUser);
console.log('loginUser:', typeof loginUser);
console.log('logoutUser:', typeof logoutUser);
console.log('googleAuth:', typeof googleAuth);
console.log('addDoctor:', typeof addDoctor);
console.log('protect:', typeof protect);

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/google', googleAuth);

// TEMPORARILY COMMENT THIS
// router.post('/add-doctor', protect, addDoctor);

module.exports = router;