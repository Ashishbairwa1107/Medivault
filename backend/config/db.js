const mongoose = require('mongoose');

// Helper to create a dummy user to verify writes
const createTestUser = async () => {
    try {
        const User = require('../models/User'); // Import dynamically after connection
        const randomNum = Math.floor(Math.random() * 1000);
        const testUser = await User.create({
            name: `Atlas Test User ${randomNum}`,
            email: `test_atlas_${randomNum}@demo.com`,
            password: 'securepassword123',
            role: 'patient'
        });
        console.log(`🧪 Verified: Dummy "Test User" saved to Cloud Database! User ID: ${testUser._id}`);
    } catch (e) {
        if (e.code === 11000) {
            console.log('🧪 Verified: Connection is working. Dummy test user already exists.');
        } else {
            console.error('🧪 Test User Data Verification Failed:', e.message);
        }
    }
};

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medivault';
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI missing from backend/.env');
    }

    console.log('🔗 Connecting to MongoDB:', mongoURI.includes('localhost') ? 'Local' : 'Atlas Cloud Cluster');
    
    const conn = await mongoose.connect(mongoURI, {
      maxPoolSize: 10,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 15000, // Helps force fail faster if completely blocked
    });
    
    console.log('☁️ ✅ MongoDB Cloud Atlas Cluster Connected Successfully!');
    console.log('📍 Host:', conn.connection.host);
    console.log('📁 Database:', conn.connection.name);
    
    // Quick Verification Test if it's the cloud cluster
    if (!mongoURI.includes('localhost')) {
       await createTestUser();
    }
    
  } catch (error) {
    console.error('\n❌ MongoDB Connection FAILED --------');
    console.error('Error Code:', error.code || 'N/A');
    console.error('Error Name:', error.name);
    console.error('SysCall:', error.syscall || 'N/A');
    console.error('Full Error Detail:', error);
    console.error('---------------------------------------\n');
    process.exit(1);
  }
};

module.exports = connectDB;
