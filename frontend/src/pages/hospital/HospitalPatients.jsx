import React, { useState } from 'react';
import DataTable from '../../components/hospital/DataTable';
import { useNavigate } from 'react-router-dom';

const patients = [
    { id: '#P-001', name: 'Arjun Kumar', ward: 'OPD', status: 'Discharged', age: 32, doctor: 'Dr. R. Sharma', admitted: '2025-04-01' },
    { id: '#P-002', name: 'Priya Verma', ward: 'ICU', status: 'Admitted', age: 28, doctor: 'Dr. M. Patel', admitted: '2025-04-05' },
    { id: '#P-003', name: 'Rohit Singh', ward: 'Ward 3-B', status: 'Stable', age: 45, doctor: 'Dr. A. Gupta', admitted: '2025-04-03' },
    { id: '#P-004', name: 'Meena Rao', ward: 'OPD', status: 'Discharged', age: 61, doctor: 'Dr. P. Singh', admitted: '2025-04-06' },
    { id: '#P-005', name: 'Vikram Desai', ward: 'ICU', status: 'Critical', age: 38, doctor: 'Dr. K. Nair', admitted: '2025-04-07' },
    { id: '#P-006', name: 'Sita Devi', ward: 'Ward 2-A', status: 'Stable', age: 52, doctor: 'Dr. S. Mehta', admitted: '2025-04-02' },
    { id: '#P-007', name: 'Rajesh Patel', ward: 'OPD', status: 'Discharged', age: 29, doctor: 'Dr. L. Verma', admitted: '2025-04-04' },
    { id: '#P-008', name: 'Anita Joshi', ward: 'Ward 3-B', status: 'Recovering', age: 67, doctor: 'Dr. N. Krishnan', admitted: '2025-04-08' },
];

const wardBadge = (ward) => {
    const styles = {
        'OPD': { bg: '#dbeafe', color: '#1e40af', dot: '●' },
        'ICU': { bg: '#fee2e2', color: '#dc2626', dot: '🔴' },
        'Ward 3-B': { bg: '#fed7aa', color: '#d97706', dot: '🟠' },
        'Ward 2-A': { bg: '#d1fae5', color: '#059669', dot: '🟢' },
    };
    const s = styles[ward] || { bg: '#f1f5f9', color: '#64748b', dot: '○' };
    return (
        <span style={{
            padding: '4px 12px',
            borderRadius: 20,
            fontSize: '0.75rem',
            fontWeight: 700,
            background: s.bg,
            color: s.color,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            border: `1px solid ${s.color}20`
        }}>
            {s.dot} {ward}
        </span>
    );
};

const statusBadge = (status) => ({
    Discharged: { bg: '#f0fdf4', color: '#16a34a' },
    Admitted: { bg: '#fee2e2', color: '#dc2626' },
    Stable: { bg: '#ecfdf5', color: '#059669' },
    Critical: { bg: '#fef3c7', color: '#d97706' },
    Recovering: { bg: '#dbeafe', color: '#1e40af' },
})[status] || { bg: '#f8fafc', color: '#64748b' };

const PatientDetailModal = ({ patient, onClose }) => (
    <div style={{
        position: 'fixed', inset: 0, zIndex: 10000, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'
    }} onClick={onClose}>
        <div onClick={e => e.stopPropagation()} style={{
            background: 'var(--surface)', borderRadius: 20, padding: 32, maxWidth: '500px', width: '90%',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', maxHeight: '90vh', overflowY: 'auto', border: '1px solid var(--border)'
        }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 28 }}>
                <div style={{
                    width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700
                }}>
                    {patient.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0 }}>{patient.name}</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text2)', margin: 4 }}>ID: {patient.id}</p>
                    {wardBadge(patient.ward)}
                </div>
                <button onClick={onClose} style={{ marginLeft: 'auto', fontSize: '1.8rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text3)' }}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                {[
                    ['Age', patient.age],
                    ['Ward', wardBadge(patient.ward)],
                    ['Status', <span style={{ padding: '4px 12px', background: statusBadge(patient.status).bg, color: statusBadge(patient.status).color, borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 }}>{patient.status}</span>],
                    ['Doctor', patient.doctor],
                    ['Admitted', patient.admitted],
                ].map(([label, value]) => (
                    <div key={label}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text3)', marginBottom: 6, textTransform: 'uppercase' }}>{label}</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 500 }}>{value}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const columns = [
    { key: 'id', label: 'Patient ID' },
    { key: 'name', label: 'Name', render: name => <span style={{ fontWeight: 600 }}>{name}</span> },
    { key: 'ward', label: 'Ward', render: wardBadge },
    { key: 'status', label: 'Status', render: (status) => (
        <span style={{
            padding: '3px 10px', background: statusBadge(status).bg, color: statusBadge(status).color,
            borderRadius: 16, fontSize: '0.72rem', fontWeight: 700
        }}>{status}</span>
    )},
    { key: 'doctor', label: 'Doctor' },
    { key: 'admitted', label: 'Admitted' },
];

const HospitalPatients = () => {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const navigate = useNavigate();

    return (
        <div>
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: 'var(--primary)', margin: 0 }}>
                    Patients Registry
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 6 }}>
                    Apollo Hospital — Current Admissions & Occupancy
                </p>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#dbeafe', border: '1px solid #bfdbfe', padding: '10px 20px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, color: '#1e40af' }}>
                    👥 OPD: 156
                </div>
                <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '10px 20px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, color: '#dc2626' }}>
                    🔴 ICU: 24
                </div>
                <div style={{ background: '#fed7aa', border: '1px solid #fdba74', padding: '10px 20px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, color: '#d97706' }}>
                    🟠 Ward 3-B: 89
                </div>
                <div style={{ background: 'var(--primary-light)', padding: '10px 20px', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, color: 'var(--primary)' }}>
                    📊 81% Occupancy (324/400)
                </div>
            </div>

            <DataTable
                title="Patient Registry"
                columns={columns}
                data={patients}
                searchKey="name"
                renderActions={(row) => (
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button
                            className="btn btn-outline btn-sm"
                            onClick={() => setSelectedPatient(row)}
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                            👁 View
                        </button>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate('/hospital/upload')}
                            style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                        >
                            ➕ Report
                        </button>
                    </div>
                )}
            />

            {selectedPatient && (
                <PatientDetailModal patient={selectedPatient} onClose={() => setSelectedPatient(null)} />
            )}
        </div>
    );
};

export default HospitalPatients;

