const User = require('../models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// ✅ FIXED TOKEN GENERATOR
const generateToken = (res, userId) => {
    const token = jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,           // ✅ always true in production
        sameSite: "none",       // ✅ MOST IMPORTANT FIX
        maxAge: 30 * 24 * 60 * 60 * 1000
    });
};

// ================= REGISTER =================
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

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                upid: user.upid
            });
        } else {
            console.log('❌ REGISTER FAIL: Invalid user data');
            res.status(400).json({ message: 'Invalid user data' });
        }

    } catch (error) {
        console.error('💥 REGISTER ERROR:', error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
    try {
        console.log('🔐 LOGIN ATTEMPT - req.body:', req.body);

        let { email, password, role } = req.body;

        if (!email || !password || !role) {
            console.log('❌ LOGIN FAIL: Missing required fields');
            return res.status(400).json({ message: 'Email, password, and role are required' });
        }

        email = email.toLowerCase().trim();

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('❌ LOGIN FAIL: User not found');
            return res.status(401).json({ message: 'User not found' });
        }

        const userRoleLower = user.role.toLowerCase();
        const requestedRoleLower = role.toLowerCase();

        if (userRoleLower !== requestedRoleLower) {
            console.log('❌ LOGIN FAIL: Role mismatch');
            return res.status(401).json({
                message: `Wrong role selected. This account is registered as ${user.role}`
            });
        }

        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            console.log('❌ LOGIN FAIL: Wrong password');
            return res.status(401).json({ message: 'Wrong password' });
        }

        console.log('✅ LOGIN SUCCESS:', user.email);

        generateToken(res, user._id);

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

// ================= LOGOUT =================
exports.logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
        sameSite: "none",
        secure: true
    });
    res.status(200).json({ message: 'Logged out successfully' });
};

// ================= GOOGLE AUTH =================
exports.googleAuth = async (req, res) => {
    const { token, role } = req.body;

    try {
        const response = await axios.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
        );

        const profile = response.data;

        if (!profile || !profile.email) {
            return res.status(400).json({ message: 'Invalid Google token' });
        }

        const { email, name, sub: googleId } = profile;

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                role: role || 'patient',
                password: Math.random().toString(36).slice(-10),
                googleId
            });
        }

        generateToken(res, user._id);

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            upid: user.upid
        });

    } catch (error) {
        console.error('Google Auth Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Authentication with Google failed' });
    }
};