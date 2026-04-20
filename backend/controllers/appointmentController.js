const Appointment = require('../models/Appointment');

// @desc    Book new appointment
// @route   POST /api/appointments/book
// @access  Private (Patient)
const bookAppointment = async (req, res) => {
    try {
        const { doctorName, department, appointmentDate, timeSlot } = req.body;

        if (req.user.role !== 'patient') {
            return res.status(403).json({ message: 'Only patients can book appointments' });
        }

        const newAppointment = new Appointment({
            patientId: req.user._id,
            doctorName,
            department,
            appointmentDate: new Date(appointmentDate),
            timeSlot,
            status: 'Pending'
        });

        const savedAppointment = await newAppointment.save();
        const populated = await savedAppointment.populate('patientId', 'name upid');
        
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointment: populated
        });
    } catch (error) {
        console.error('Book appointment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get patient appointments  
// @route   GET /api/appointments/patient/:id
// @access  Private
const getPatientAppointments = async (req, res) => {
    try {
        const patientId = req.params.id || req.user._id;

        // Verify requesting correct patient
        if (req.user.role !== 'patient' || req.user._id.toString() !== patientId) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const appointments = await Appointment.find({ patientId })
            .sort({ appointmentDate: -1 })
            .populate('patientId', 'name upid');

        res.json(appointments);
    } catch (error) {
        console.error('Get appointments error:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    bookAppointment,
    getPatientAppointments
};

