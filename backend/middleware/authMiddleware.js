const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey_change_me_in_production');
        
        // Mocking user fetching...
        const User = require('../models/User');
        req.user = await User.findById(decoded.id).select('-password');
        
        next();
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Role ${req.user? req.user.role : 'Unknown'} is not authorized to access this route` });
        }
        next();
    };
};

module.exports = { protect, authorize };
