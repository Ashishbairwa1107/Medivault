require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Consent = require('../models/Consent');
const MedicalRecord = require('../models/MedicalRecord');

const seedConsentData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('🌱 Connected to DB for seeding...');

        // Find a doctor and their hospital
        const doctor = await User.findOne({ role: 'doctor' });
        if (!doctor) {
            console.log('❌ No doctor found. Please register a doctor first.');
            process.exit(1);
        }

        const hospitalId = doctor.hospitalId;
        if (!hospitalId) {
            console.log('❌ Doctor has no hospitalId linked.');
            process.exit(1);
        }

        // Find some patients
        const patients = await User.find({ role: 'patient' }).limit(3);
        if (patients.length < 3) {
            console.log('❌ Need at least 3 patients for seeding.');
            process.exit(1);
        }

        // Clear existing consents for these patients/hospital
        await Consent.deleteMany({ hospitalId });

        const consentData = [
            {
                patientId: patients[0]._id,
                patientName: patients[0].name,
                patientUpid: patients[0].upid,
                hospitalId: hospitalId,
                accessStatus: 'active',
                grantedAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
                expiryAt: new Date(Date.now() + 86400000 * 30), // 30 days from now
            },
            {
                patientId: patients[1]._id,
                patientName: patients[1].name,
                patientUpid: patients[1].upid,
                hospitalId: hospitalId,
                accessStatus: 'revoked',
                grantedAt: new Date(Date.now() - 86400000 * 10),
                expiryAt: new Date(Date.now() + 86400000 * 20),
            },
            {
                patientId: patients[2]._id,
                patientName: patients[2].name,
                patientUpid: patients[2].upid,
                hospitalId: hospitalId,
                accessStatus: 'expired',
                grantedAt: new Date(Date.now() - 86400000 * 60),
                expiryAt: new Date(Date.now() - 86400000 * 1), // expired yesterday
            }
        ];

        await Consent.insertMany(consentData);
        console.log('✅ Consent dummy data seeded successfully!');

        // Create a dummy medical record for the active patient
        await MedicalRecord.deleteMany({ patientId: patients[0]._id });
        await MedicalRecord.create({
            patientId: patients[0]._id,
            doctorId: doctor._id,
            hospitalId: hospitalId,
            diagnosis: 'Seasonal Influenza',
            prescription: 'Paracetamol 500mg, Rest for 3 days',
            date: new Date(),
            fileName: 'sample_report.pdf'
        });
        console.log('✅ Dummy medical record created for Active patient!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('💥 Seeding error:', error.message);
        process.exit(1);
    }
};

seedConsentData();
