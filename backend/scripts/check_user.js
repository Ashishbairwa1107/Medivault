require('dotenv').config();
const mongoose = require('mongoose');

// Path to User model - Adjust if needed
const User = require('./models/User');

const checkUser = async () => {
    try {
        const emailToCheck = process.argv[2];
        
        if (!emailToCheck) {
            console.log('Usage: node check_user.js <email>');
            process.exit(1);
        }

        console.log(`🔍 Connecting to DB: ${process.env.MONGODB_URI.split('@')[1] || 'Local'}`);
        await mongoose.connect(process.env.MONGODB_URI);
        
        const user = await User.findOne({ email: emailToCheck.toLowerCase().trim() });
        
        if (user) {
            console.log('✅ User Found!');
            console.log('----------------');
            console.log(`ID: ${user._id}`);
            console.log(`Name: ${user.name}`);
            console.log(`Email: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Registered At: ${user.createdAt}`);
            console.log('----------------');
        } else {
            console.log(`❌ No user found with email: ${emailToCheck}`);
        }
        
        await mongoose.connection.close();
    } catch (e) {
        console.error('💥 Error:', e.message);
        process.exit(1);
    }
};

checkUser();
