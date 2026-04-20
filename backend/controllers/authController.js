const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const generateToken = (res, userId) => {
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET || 'supersecretkey_change_me_in_production', {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 Days
    });
};

exports.registerUser = async (req, res) => {
    console.log('📝 REGISTER ATTEMPT - req.body:', req.body);
    let { name, email, password, role } = req.body;
    try {
        if (!name || !email || !password || !role) {
            console.log('❌ REGISTER FAIL: Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }
        
        email = email.toLowerCase().trim();
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('❌ REGISTER FAIL: User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }
        
        const user = await User.create({ name, email, password, role });
        
        if (user) {
            console.log('✅ REGISTER SUCCESS:', user.email);
            generateToken(res, user._id);
            res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role, upid: user.upid });
        } else {
            console.log('❌ REGISTER FAIL: Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('💥 REGISTER ERROR:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

exports.loginUser = async (req, res) => {
    try {
        // Debug: Log incoming request
        console.log('🔐 LOGIN ATTEMPT - req.body:', req.body);
        
        let { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            console.log('❌ LOGIN FAIL: Missing required fields');
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }

        email = email.toLowerCase().trim();
        console.log("Login Attempt Email:", email);

        // Find user by email
        const user = await User.findOne({ email }).select('+password');
        console.log('🔍 USER FOUND:', user ? `ID:${user._id} Role:${user.role}` : 'No user');
        
        if (!user) {
            console.log('❌ LOGIN FAIL: User not found for email:', email);
            return res.status(401).json({ message: 'User not found' });
        }

        // Role validation (case-insensitive)
        const userRoleLower = user.role.toLowerCase();
        const requestedRoleLower = role.toLowerCase();
        console.log('🔍 ROLE CHECK - DB:', userRoleLower, 'Requested:', requestedRoleLower);
        
        if (userRoleLower !== requestedRoleLower) {
            console.log('❌ LOGIN FAIL: Role mismatch');
            return res.status(401).json({ message: `Wrong role selected. This account is registered as ${user.role}` });
        }

        // Password validation
        const isMatch = await user.matchPassword(password);
        console.log('🔍 PASSWORD MATCH:', isMatch);
        
        if (!isMatch) {
            console.log('❌ LOGIN FAIL: Wrong password');
            return res.status(401).json({ message: 'Wrong password' });
        }

        // Success - generate token
        console.log('✅ LOGIN SUCCESS for user:', user.email);
        generateToken(res, user._id);
        
        // Return user data (exclude upid if null)
        const { upid, ...userData } = user.toObject();
        res.json({ 
            ...userData, 
            upid: upid || null,
            role: userRoleLower 
        });
        
    } catch (error) {
        console.error('💥 LOGIN ERROR:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.googleAuth = async (req, res) => {
    const { token, role } = req.body;
    try {
        // Fetch user profile from Google using the access token
        const response = await axios.get(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`);
        const profile = response.data;
        
        if (!profile || !profile.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, sub: googleId } = profile;
        
        // Find existing user or create new one
        let user = await User.findOne({ email });
        
        if (!user) {
            // Create user with a random password if it's a new social login
            user = await User.create({
                name,
                email,
                role: role || 'patient',
                password: Math.random().toString(36).slice(-10),
                googleId // Note: You might need to add this field to your User model
            });
        }
        
        generateToken(res, user._id);
        res.json({ _id: user._id, name: user.name, email: user.email, role: user.role, upid: user.upid });
    } catch (error) {
        console.error('Google Auth Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Authentication with Google failed' });
    }
};

// Admin/Hospital adds a doctor
exports.addDoctor = async (req, res) => {
    const { name, email, specialization, contact, room } = req.body;
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Only Hospital Admins can add doctors' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // Generate a temporary password
        const tempPassword = 'Doctor@' + Math.floor(1000 + Math.random() * 9000);

        const doctor = await User.create({
            name,
            email,
            password: tempPassword,
            role: 'doctor',
            hospitalId: req.user._id,
            phone: contact,
            address: `Room: ${room}`
        });

        res.status(201).json({
            message: 'Doctor added successfully',
            doctor: {
                _id: doctor._id,
                name: doctor.name,
                email: doctor.email,
                upid: doctor.upid,
                specialization: specialization // Note: might need to add this field to User model properly
            },
            tempPassword // In a real app, send via email
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const allowedUpdates = ['name', 'phone', 'address', 'dob', 'bloodGroup', 'gender', 'aadhaar'];
        const updates = {};
        
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            updates, 
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            upid: updatedUser.upid,
            phone: updatedUser.phone,
            address: updatedUser.address,
            dob: updatedUser.dob,
            bloodGroup: updatedUser.bloodGroup,
            gender: updatedUser.gender,
            aadhaar: updatedUser.aadhaar
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(400).json({ message: error.message });
    }
};
