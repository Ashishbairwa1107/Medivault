const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// Load env vars
dotenv.config({ path: './.env' });

const app = express();

// Database connection + Server start (async)
const startServer = async () => {
  try {
    await connectDB();
    
    // Ensure uploads directory exists on startup
    const fs = require('fs');
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }
    
    // ✅ CORS CONFIG - Enhanced for cross-origin image fetching
    const corsOptions = {
      origin: function (origin, callback) {
        const allowedOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:3000"];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
    };

    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(cookieParser());

    // Serve uploads statically with CORP headers
    app.use('/uploads', (req, res, next) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    }, express.static(path.join(__dirname, 'uploads')));

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/users', require('./routes/userRoutes'));
    app.use('/api/profile', require('./routes/userRoutes')); // Support for /api/profile/update
    app.use('/api/records', require('./routes/recordRoutes'));
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/consents', require('./routes/consentRoutes'));
    app.use('/api/chat', require('./routes/chatRoutes'));
    app.use('/api/upload', require('./routes/uploadRoutes'));
    app.use('/api/doctors', require('./routes/doctorRoutes'));

    // Test route
    app.get('/', (req, res) => res.send('MediVault API running'));

    // Debug route to check if a file exists in uploads
    app.get('/api/debug/check-file/:filename', (req, res) => {
      const fs = require('fs');
      const filePath = path.join(__dirname, 'uploads', req.params.filename);
      if (fs.existsSync(filePath)) {
        res.json({ 
          success: true, 
          exists: true, 
          filename: req.params.filename,
          absolutePath: filePath 
        });
      } else {
        res.status(404).json({ 
          success: false, 
          exists: false, 
          message: `File ${req.params.filename} not found in uploads folder` 
        });
      }
    });

    // Start server ONLY after DB ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health: http://localhost:${PORT}`);
      
      const mongoose = require('mongoose');
      setTimeout(async () => {
         if(mongoose.connection.readyState === 1) {
             console.log("🟢 The database is actively connected and accepting writes!");
         }
      }, 3000);
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

