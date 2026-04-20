const mongoose = require('mongoose');

const MedicalRecordSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String },
    doctorName: { type: String },
    hospitalName: { type: String },
    diagnosis: { type: String },
    chiefComplaint: { type: String },
    reportType: { type: String, required: true },
    reportDate: { type: Date, required: true },
    notes: { type: String },
    orderingDoctor: { type: String },
    prescriptions: [{
        medicineName: { type: String },
        dosage: { type: String },
        duration: { type: String }
    }],
    reportUrl: { type: String },
    fileName: { type: String },
    fileType: { type: String },
    uploadedAt: { type: Date, default: Date.now },
    status: { type: String, default: 'Uploaded' }
}, { timestamps: true });

module.exports = mongoose.model('MedicalRecord', MedicalRecordSchema);

