const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

// Load env vars
dotenv.config();

const app = express();

// ================= CORS CONFIG =================
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://medivault-rose.vercel.app"
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("❌ CORS BLOCKED:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
};

// ================= MIDDLEWARE =================
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= START SERVER =================
const startServer = async () => {
  try {
    await connectDB();

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log('📁 Created uploads directory');
    }

    // ================= STATIC FILES =================
    app.use('/uploads', (req, res, next) => {
      res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
      next();
    }, express.static(uploadDir));

    // ================= ROUTES =================
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/users', require('./routes/userRoutes')); // ✅ ONLY THIS
    app.use('/api/records', require('./routes/recordRoutes'));
    app.use('/api/appointments', require('./routes/appointmentRoutes'));
    app.use('/api/consents', require('./routes/consentRoutes'));
    app.use('/api/chat', require('./routes/chatRoutes'));
    app.use('/api/upload', require('./routes/uploadRoutes'));
    app.use('/api/doctors', require('./routes/doctorRoutes'));

    // ================= TEST ROUTE =================
    app.get('/', (req, res) => {
      res.send('🚀 MediVault API running');
    });

    // ================= PORT =================
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Backend Live`);
    });

  } catch (error) {
    console.error('💥 Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();