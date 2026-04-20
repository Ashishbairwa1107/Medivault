const express = require('express');
const { createDoctor, getDoctors } = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, authorize('hospital'), getDoctors)
    .post(protect, authorize('hospital'), createDoctor);

module.exports = router;
