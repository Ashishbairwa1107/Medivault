const mongoose = require('mongoose');

const ConsentSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String },
    patientUpid: { type: String },
    hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    accessStatus: { 
        type: String, 
        enum: ['active', 'revoked', 'expired'], 
        default: 'active' 
    },
    grantedAt: { type: Date, default: Date.now },
    expiryAt: { type: Date },
    lastAccessed: { type: Date },
}, { timestamps: true });

// Index for faster lookups
ConsentSchema.index({ hospitalId: 1, accessStatus: 1 });

module.exports = mongoose.model('Consent', ConsentSchema);
