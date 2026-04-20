const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

// ================= CORS CONFIG =================
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:3000',
  'https://medivault-rose.vercel.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log('❌ CORS BLOCKED:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// ================= MIDDLEWARE =================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const startServer = async () => {
  try {
    await connectDB();

    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    app.use(
      '/uploads',
      (req, res, next) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
        next();
      },
      express.static(uploadDir)
    );

    // ================= DEBUG ROUTE IMPORTS =================
    const authRoutes = require('./routes/authRoutes');
    const userRoutes = require('./routes/userRoutes');
    const recordRoutes = require('./routes/recordRoutes');

    console.log('authRoutes type:', typeof authRoutes);
    console.log('userRoutes type:', typeof userRoutes);
    console.log('recordRoutes type:', typeof recordRoutes);

    // Start with only known-needed routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/records', recordRoutes);

    // Temporarily disable the rest until startup is stable
    // const appointmentRoutes = require('./routes/appointmentRoutes');
    // const consentRoutes = require('./routes/consentRoutes');
    // const chatRoutes = require('./routes/chatRoutes');
    // const uploadRoutes = require('./routes/uploadRoutes');
    // const doctorRoutes = require('./routes/doctorRoutes');

    // console.log('appointmentRoutes type:', typeof appointmentRoutes);
    // console.log('consentRoutes type:', typeof consentRoutes);
    // console.log('chatRoutes type:', typeof chatRoutes);
    // console.log('uploadRoutes type:', typeof uploadRoutes);
    // console.log('doctorRoutes type:', typeof doctorRoutes);

    // app.use('/api/appointments', appointmentRoutes);
    // app.use('/api/consents', consentRoutes);
    // app.use('/api/chat', chatRoutes);
    // app.use('/api/upload', uploadRoutes);
    // app.use('/api/doctors', doctorRoutes);

    app.get('/', (req, res) => {
      res.send('🚀 MediVault API running');
    });

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log('🌐 Backend Live');
    });
  } catch (error) {
    console.error('💥 Failed to start server:', error);
    process.exit(1);
  }
};

startServer();