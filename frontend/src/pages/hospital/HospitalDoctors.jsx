import React, { useState } from 'react';
import DataTable from '../../components/hospital/DataTable';

const doctors = [
    { id: '#D-201', name: 'Dr. R. Sharma',    specialisation: 'Cardiology',     patients: 48, status: 'Active',   phone: '+91-9810001001', joined: '2019-03-15' },
    { id: '#D-202', name: 'Dr. M. Patel',     specialisation: 'Neurology',      patients: 35, status: 'Active',   phone: '+91-9820002002', joined: '2020-07-01' },
    { id: '#D-203', name: 'Dr. A. Gupta',     specialisation: 'Orthopaedics',   patients: 29, status: 'On Leave', phone: '+91-9830003003', joined: '2018-11-20' },
    { id: '#D-204', name: 'Dr. P. Singh',     specialisation: 'Paediatrics',    patients: 52, status: 'Active',   phone: '+91-9840004004', joined: '2021-01-10' },
    { id: '#D-205', name: 'Dr. K. Nair',      specialisation: 'General Surgery', patients: 41, status: 'Active',   phone: '+91-9850005005', joined: '2019-09-05' },
    { id: '#D-206', name: 'Dr. S. Mehta',     specialisation: 'Dermatology',    patients: 26, status: 'Active',   phone: '+91-9860006006', joined: '2022-03-22' },
    { id: '#D-207', name: 'Dr. L. Verma',     specialisation: 'Oncology',       patients: 18, status: 'On Leave', phone: '+91-9870007007', joined: '2017-06-14' },
    { id: '#D-208', name: 'Dr. N. Krishnan',  specialisation: 'Radiology',      patients: 63, status: 'Active',   phone: '+91-9880008008', joined: '2020-02-28' },
];

const statusBadge = (status) => {
    const styles = {
        Active:   { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
        'On Leave': { background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a' },
    };
    const s = styles[status] || { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' };
    return (
        <span style={{
            ...s,
            padding: '3px 12px',
            borderRadius: 20,
            fontSize: '0.72rem',
            fontWeight: 700,
            display: 'inline-block',
        }}>
            {status === 'Active' ? '● ' : '○ '}{status}
        </span>
    );
};

const DoctorDetailModal = ({ doctor, onClose }) => (
    <div
        style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
    >
        <div
            onClick={e => e.stopPropagation()}
            style={{
                background: 'var(--surface)',
                borderRadius: 20,
                padding: 36,
                width: '100%',
                maxWidth: 480,
                boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
                border: '1px solid var(--border)',
                animation: 'fadeIn 0.2s ease',
            }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{
                    width: 60, height: 60, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1e40af, #0d9488)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '1.2rem',
                }}>
                    {doctor.name.split(' ').slice(-1)[0]?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: 'var(--primary)', margin: 0 }}>{doctor.name}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text2)', margin: 0 }}>{doctor.specialisation} · {doctor.id}</p>
                </div>
                <button
                    onClick={onClose}
                    style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: 'var(--text3)', lineHeight: 1 }}
                >×</button>
            </div>

            {/* Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px', marginBottom: 28 }}>
                {[
                    ['Doctor ID', doctor.id],
                    ['Status', doctor.status],
                    ['Active Patients', doctor.patients],
                    ['Phone', doctor.phone],
                    ['Joined', doctor.joined],
                    ['Specialisation', doctor.specialisation],
                ].map(([label, val]) => (
                    <div key={label}>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text3)', marginBottom: 4 }}>{label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>{val}</div>
                    </div>
                ))}
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>Close</button>
        </div>
    </div>
);

const columns = [
    { key: 'id',             label: 'Doctor ID' },
    { key: 'name',           label: 'Full Name' },
    { key: 'specialisation', label: 'Specialisation' },
    { key: 'patients',       label: 'Patients',
        render: (val) => <span style={{ fontWeight: 700 }}>{val}</span>,
    },
    { key: 'status', label: 'Status', render: statusBadge },
];

const HospitalDoctors = () => {
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: 'var(--primary)', margin: 0 }}>
                    Doctors Management
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 6 }}>
                    {doctors.length} registered doctors · Apollo Hospital, Delhi
                </p>
            </div>

            {/* Summary Badges */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#16a34a' }}>
                    ● Active: {doctors.filter(d => d.status === 'Active').length}
                </div>
                <div style={{ background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 10, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, color: '#b45309' }}>
                    ○ On Leave: {doctors.filter(d => d.status === 'On Leave').length}
                </div>
                <div style={{ background: 'var(--primary-light)', border: '1px solid #bfdbfe', borderRadius: 10, padding: '8px 16px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--primary)' }}>
                    👥 Total Patients: {doctors.reduce((acc, d) => acc + d.patients, 0)}
                </div>
            </div>

            <DataTable
                title="Doctor Registry"
                columns={columns}
                data={doctors}
                searchKey="name"
                renderActions={(row) => (
                    <button
                        className="btn btn-outline btn-sm"
                        onClick={() => setSelectedDoctor(row)}
                    >
                        👁 View
                    </button>
                )}
                emptyMsg="No doctors found matching search."
            />

            {selectedDoctor && (
                <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
            )}
        </div>
    );
};

export default HospitalDoctors;
