const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: './.env' });

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/medivault');

        // Clear existing data and drop indexes natively
        try { await User.collection.drop(); } catch (e) {}

        // Create Seed Users dynamically
        await User.create([
            {
                name: 'System Admin',
                email: 'admin@demo.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Apollo Hospital',
                email: 'hospital@demo.com',
                password: 'password123',
                role: 'hospital'
            },
            {
                name: 'Dr. Sharma',
                email: 'doctor@demo.com',
                password: 'password123',
                role: 'doctor'
            },
            {
                name: 'Demo Patient',
                email: 'patient@demo.com',
                password: 'password123',
                role: 'patient'
            }
        ]);

        console.log('Database successfully seeded with demo users!');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding data: ${error.message}`);
        process.exit(1);
    }
};

seedData();
