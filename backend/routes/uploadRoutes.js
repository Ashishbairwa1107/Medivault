const express = require('express');
const router = express.Router();

const upload = require('../utils/upload');
const { uploadSingleFile } = require('../controllers/uploadController');

// Standardized upload route
router.post('/single', upload.single('file'), uploadSingleFile);

module.exports = router;
