const express = require('express');
const router = express.Router();

const {
  getRecords,
  createRecord,
  uploadReport,
  updateRecord
} = require('../controllers/recordController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../utils/upload');

// Get all records / create new record
router
  .route('/')
  .get(protect, getRecords)
  .post(protect, createRecord);

// Update record by ID
router
  .route('/:id')
  .put(protect, updateRecord);

// Upload report file
router.post('/upload', protect, upload.single('file'), uploadReport);

module.exports = router;