const express = require('express');
const router = express.Router();
const upload = require('../utils/upload');
const { uploadSingleFile } = require('../controllers/uploadController');

// Standardized upload route
// We use 'file' as the field name in FormData
router.post('/single', upload.single('file'), uploadSingleFile);

module.exports = router;
