const fs = require('fs');
const path = require('path');

// @desc    Handle single file upload
// @route   POST /api/upload
// @access  Public (for demo)
const uploadSingleFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Build full URL for access
        const protocol = req.protocol;
        const host = req.get('host');
        const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        res.status(200).json({
            success: true,
            message: 'File uploaded successfully',
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { uploadSingleFile };
