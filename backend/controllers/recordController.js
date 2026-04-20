const mongoose = require('mongoose');
const MedicalRecord = require('../models/MedicalRecord');
const Consent = require('../models/Consent');
const User = require('../models/User');
const { getPresignedViewerUrl } = require('../utils/getPresignedViewerUrl');
const { uploadFile } = require('../utils/awsS3');

// @desc    Get patient records
// @route   GET /api/records
// @access  Private
const getRecords = async (req, res) => {
    try {
        if (req.user.role === 'patient') {
            // Patient can see all their own records
            const records = await MedicalRecord.find({ patientId: req.user._id }).populate('doctorId', 'name').populate('hospitalId', 'name');
            
            // Construct URLs for local files
            const recordsWithUrls = records.map(record => {
                const doc = record.toObject();
                if (doc.fileName) {
                    doc.reportUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${doc.fileName}`;
                }
                return doc;
            });
            
            return res.json(recordsWithUrls);
        } else if (req.user.role === 'doctor' || req.user.role === 'hospital') {
            // Doctors/Hospitals need to check consent
            const { patientId } = req.query;
            if (!patientId) {
                return res.status(400).json({ message: 'Patient ID required' });
            }

            const hasConsent = await Consent.findOne({
                patientId,
                entityId: req.user._id,
                accessGranted: true
            });

            if (!hasConsent) {
                return res.status(403).json({ message: 'Access denied: Patient has not granted consent' });
            }

            const records = await MedicalRecord.find({ patientId }).populate('doctorId', 'name').populate('hospitalId', 'name');
            
            // Construct URLs for local files
            const recordsWithUrls = records.map(record => {
                const doc = record.toObject();
                if (doc.fileName) {
                    doc.reportUrl = `${process.env.BACKEND_URL || 'http://localhost:5000'}/uploads/${doc.fileName}`;
                }
                return doc;
            });
            
            return res.json(recordsWithUrls);
        } else {
            return res.status(403).json({ message: 'Role not authorized to fetch records directly' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a medical record
// @route   POST /api/records
// @access  Private (Doctor / Hospital)
const createRecord = async (req, res) => {
    const { patientId, diagnosis, chiefComplaint, prescriptions, reportUrl, status } = req.body;
    
    try {
        if (req.user.role !== 'doctor' && req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Only Doctors and Hospitals can create records' });
        }

        const newRecord = new MedicalRecord({
            patientId,
            doctorId: req.user.role === 'doctor' ? req.user._id : req.body.doctorId,
            hospitalId: req.user.role === 'hospital' ? req.user._id : req.body.hospitalId,
            diagnosis,
            chiefComplaint,
            prescriptions,
            reportUrl,
            status
        });

        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload report file
// @route   POST /api/records/upload
// @access  Private (Hospital)
// @desc    Upload report file
// @route   POST /api/records/upload
// @access  Private (Hospital)
const uploadReport = async (req, res) => {
    try {
        if (req.user.role !== 'hospital') {
            return res.status(403).json({ message: 'Only Hospital Admins can upload reports' });
        }

        const { patientId = 'dummy-test', reportType, reportDate, notes, orderingDoctor, diagnosis, hospitalName } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ message: 'No file uploaded' });
        
        // TEMP: Disabled patient validation for testing - allow dummy/empty patientId
        /*
        const patient = await User.findOne({ 
            $or: [{ upid: patientId }, { _id: mongoose.isValidObjectId(patientId) ? patientId : null }],
            role: 'patient' 
        });
        if (!patient) {
            return res.status(400).json({ message: `Patient with ID '${patientId}' not found` });
        }
        const patientIdForRecord = patient._id;
        */
        const patientIdForRecord = patientId || 'dummy-patient';

        // Build full URL
        const protocol = req.protocol;
        const host = req.get('host');
        const fullUrl = `${protocol}://${host}/uploads/${file.filename}`;

        // Create record
        const newRecord = new MedicalRecord({
            patientId: patientIdForRecord,  // Raw string from input - no DB lookup
            hospitalId: req.user._id,
            hospitalName: hospitalName || req.user.name,
            reportType,
            reportDate: reportDate ? new Date(reportDate) : new Date(),
            diagnosis,
            notes,
            orderingDoctor,
            fileName: file.filename,
            fileType: file.mimetype,
            reportUrl: fullUrl,
            uploadedAt: Date.now(),
            status: 'Uploaded'
        });

        const savedRecord = await newRecord.save();

        res.status(201).json({ 
            message: 'Report uploaded successfully',
            success: true,
            record: savedRecord,
            reportUrl: fullUrl
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update record
// @route   PUT /api/records/:id
// @access  Private (Doctor / Hospital)
const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Only allow updates to specific fields
    const allowedUpdates = ['diagnosis', 'chiefComplaint', 'notes', 'orderingDoctor', 'status', 'patientName', 'doctorName', 'hospitalName'];
    const updateFields = {};
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        updateFields[field] = updates[field];
      }
    });
    
    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: 'No valid fields to update' });
    }
    
    const record = await MedicalRecord.findByIdAndUpdate(
      id, 
      updateFields, 
      { new: true, runValidators: true }
    ).populate('doctorId', 'name').populate('hospitalId', 'name');
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({
      message: 'Record updated successfully',
      record
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecords, createRecord, uploadReport, updateRecord };

