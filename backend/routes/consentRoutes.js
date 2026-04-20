const express = require('express');
const { 
    getConsents, 
    toggleConsent, 
    getDoctorConsents, 
    getDoctorActiveConsents, 
    getPatientConsentRecord,
    grantConsent,
    revokeConsent
} = require('../controllers/consentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Patient routes
router.route('/')
    .get(protect, authorize('patient'), getConsents)
    .post(protect, authorize('patient'), toggleConsent);

router.post('/grant', protect, authorize('patient'), grantConsent);
router.post('/revoke', protect, authorize('patient'), revokeConsent);

// Doctor routes
router.get('/doctor', protect, authorize('doctor', 'hospital'), getDoctorConsents);
router.get('/doctor/active', protect, authorize('doctor', 'hospital'), getDoctorActiveConsents);
router.get('/report/:patientId', protect, authorize('doctor', 'hospital'), getPatientConsentRecord);

module.exports = router;
