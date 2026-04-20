const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'hospital', 'admin'], required: true },
    upid: { type: String, unique: true, sparse: true },
    profilePhoto: { type: String },
    hospitalId: { type: String }, // For doctors
    specialization: { type: String }, // NEW: Added for doctors
    department: { type: String }, // NEW: Added for doctors
    googleId: { type: String, sparse: true, unique: true },
    phone: { type: String },
    address: { type: String },
    dob: { type: Date },
    bloodGroup: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    aadhaar: { type: String },
}, { timestamps: true });

UserSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    
    if (this.role === 'patient' && !this.upid) {
        const year = new Date().getFullYear();
        const rand = Math.floor(10000 + Math.random() * 90000); // 5 digits
        this.upid = `MV-${year}-${rand}`;
    }
    
    if (this.role === 'doctor' && !this.upid) {
        const rand = Math.floor(100 + Math.random() * 900);
        this.upid = `#D-${rand}`;
    }
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
