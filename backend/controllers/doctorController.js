const User = require('../models/User');

// @desc    Create a new doctor
// @route   POST /api/doctors
// @access  Private (Hospital Admin)
const createDoctor = async (req, res) => {
    try {
        const { name, email, specialization, password, phone, address, department } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        const doctor = await User.create({
            name,
            email,
            password: password || 'MediVault@123',
            role: 'doctor',
            specialization,
            department,
            phone,
            address,
            hospitalId: req.user._id // The hospital admin who added them
        });

        res.status(201).json({
            success: true,
            message: 'Doctor added successfully',
            doctor: {
                _id: doctor._id,
                id: doctor.upid,
                name: doctor.name,
                email: doctor.email,
                specialization: doctor.specialization,
                status: 'Active'
            }
        });
    } catch (error) {
        console.error('Create doctor error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all doctors for a hospital
// @route   GET /api/doctors
// @access  Private (Hospital Admin)
const getDoctors = async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor', hospitalId: req.user._id });
        
        // Map to match the frontend expected structure if needed
        const mappedDoctors = doctors.map(doc => ({
            _id: doc._id,
            id: doc.upid,
            name: doc.name,
            specialization: doc.specialization,
            status: 'Active',
            patients: 0 // Mocking patient count for now
        }));
        
        res.json(mappedDoctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createDoctor, getDoctors };
