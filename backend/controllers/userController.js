const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        bloodGroup: user.bloodGroup || 'Not set',
        dob: user.dob || 'Not set',
        phone: user.phone || 'Not set',
        address: user.address || 'Not set',
        aadhaar: user.aadhaar || 'Not set',
        gender: user.gender || 'Not set',
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.bloodGroup = req.body.bloodGroup || user.bloodGroup;
      user.dob = req.body.dob || user.dob;
      user.phone = req.body.phone || user.phone;
      user.address = req.body.address || user.address;
      user.aadhaar = req.body.aadhaar || user.aadhaar;
      user.gender = req.body.gender || user.gender;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bloodGroup: updatedUser.bloodGroup,
        dob: updatedUser.dob,
        phone: updatedUser.phone,
        address: updatedUser.address,
        aadhaar: updatedUser.aadhaar,
        gender: updatedUser.gender,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};
