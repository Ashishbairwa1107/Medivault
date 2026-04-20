const express = require('express');
const { getRecords, createRecord, uploadReport, updateRecord } = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getRecords)
    .post(protect, createRecord);

router.route('/:id')
    .put(protect, updateRecord);

const upload = require('../utils/upload');
router.post('/upload', protect, upload.single('file'), uploadReport);

module.exports = router;

