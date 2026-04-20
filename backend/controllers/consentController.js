const Consent = require('../models/Consent');
const User = require('../models/User');
const MedicalRecord = require('../models/MedicalRecord');

// @desc    Get all consents for a doctor's hospital
// @route   GET /api/consents/doctor
const getDoctorConsents = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId || req.user._id; // If doctor, use hospitalId, else current user
        const consents = await Consent.find({ hospitalId })
            .populate('patientId', 'name email upid')
            .sort({ createdAt: -1 });
        res.json(consents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active consents for a doctor's hospital
// @route   GET /api/consents/doctor/active
const getDoctorActiveConsents = async (req, res) => {
    try {
        const hospitalId = req.user.hospitalId || req.user._id;
        const consents = await Consent.find({ hospitalId, accessStatus: 'active' })
            .populate('patientId', 'name email upid');
        res.json(consents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get patient reports if consent is active
// @route   GET /api/consents/report/:patientId
const getPatientConsentRecord = async (req, res) => {
    try {
        const { patientId } = req.params;
        const hospitalId = req.user.hospitalId || req.user._id;

        const consent = await Consent.findOne({ patientId, hospitalId, accessStatus: 'active' });
        
        if (!consent) {
            return res.status(403).json({ message: 'Access denied: No active consent found' });
        }

        // Fetch medical records for this patient
        const records = await MedicalRecord.find({ patientId }).populate('doctorId', 'name').populate('hospitalId', 'name');
        
        // Log access
        consent.lastAccessed = Date.now();
        await consent.save();

        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Patient grants access to a hospital
// @route   POST /api/consents/grant
const grantConsent = async (req, res) => {
    const { hospitalId, expiryDate } = req.body;
    try {
        const hospital = await User.findById(hospitalId);
        if (!hospital) return res.status(404).json({ message: 'Hospital not found' });

        let consent = await Consent.findOne({ patientId: req.user._id, hospitalId });

        if (consent) {
            consent.accessStatus = 'active';
            consent.expiryAt = expiryDate ? new Date(expiryDate) : null;
            await consent.save();
        } else {
            consent = await Consent.create({
                patientId: req.user._id,
                patientName: req.user.name,
                patientUpid: req.user.upid,
                hospitalId,
                expiryAt: expiryDate ? new Date(expiryDate) : null
            });
        }
        res.json(consent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Patient revokes access
// @route   POST /api/consents/revoke
const revokeConsent = async (req, res) => {
    const { hospitalId } = req.body;
    try {
        const consent = await Consent.findOne({ patientId: req.user._id, hospitalId });
        if (!consent) return res.status(404).json({ message: 'Consent record not found' });

        consent.accessStatus = 'revoked';
        await consent.save();
        res.json(consent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Legacy support or patient view
const getConsents = async (req, res) => {
    try {
        const consents = await Consent.find({ patientId: req.user._id }).populate('hospitalId', 'name role');
        res.json(consents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const toggleConsent = async (req, res) => {
    const { entityId, accessGranted } = req.body;
    try {
        let consent = await Consent.findOne({ patientId: req.user._id, hospitalId: entityId });
        if (consent) {
            consent.accessStatus = accessGranted ? 'active' : 'revoked';
            await consent.save();
        } else {
            consent = await Consent.create({
                patientId: req.user._id,
                hospitalId: entityId,
                accessStatus: accessGranted ? 'active' : 'revoked'
            });
        }
        res.json(consent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { 
    getConsents, 
    toggleConsent, 
    getDoctorConsents, 
    getDoctorActiveConsents, 
    getPatientConsentRecord,
    grantConsent,
    revokeConsent
};
