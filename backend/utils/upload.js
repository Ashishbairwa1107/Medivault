const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads folder exists using absolute path
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set storage engine
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Use absolute path here
    },
    filename: function (req, file, cb) {
        // Create a unique filename: timestamp + original extension + sanitize name
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const cleanName = file.originalname.replace(/\s+/g, '_');
        cb(null, uniqueSuffix + '-' + cleanName);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /jpeg|jpg|png|pdf|webp/;
    // Check extension
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('Error: Images or PDFs Only!'));
    }
}

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 20 * 1024 * 1024 }, // Increased to 20MB
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

module.exports = upload;
