const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { bookAppointment, getPatientAppointments } = require('../controllers/appointmentController');

const router = express.Router();

router.post('/book', protect, bookAppointment);
router.get('/patient/:id', protect, getPatientAppointments);

module.exports = router;

