import React from 'react';
import UploadForm from '../../components/hospital/UploadForm';
import { useNavigate } from 'react-router-dom';

const HospitalUpload = () => {
    const navigate = useNavigate();

    const handleUploadSuccess = (reportId) => {
        alert(`Report uploaded successfully! ID: ${reportId}`);
        // Optionally navigate to patients or stay
    };

    return (
        <div>
            <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 16 }}>
                <button 
                    onClick={() => navigate('/hospital/patients')}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '12px 24px',
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        fontSize: '0.9rem',
                        color: 'var(--text)',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    👥 Back to Patients
                </button>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: 'var(--primary)' }}>
                    Upload Patient Report
                </div>
            </div>

            <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 20,
                padding: 32,
                boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                maxWidth: '1000px'
            }}>
                <UploadForm onSuccess={handleUploadSuccess} />
            </div>
        </div>
    );
};

export default HospitalUpload;

