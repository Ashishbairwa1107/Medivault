import React from 'react';
import { X, Download, Printer, FileText, User, Stethoscope, Calendar, Activity, Pill, ClipboardList } from 'lucide-react';

const conditionStyle = (c) => ({
    Critical:   { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
    Monitoring: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    Stable:     { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
}[c] || { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' });

const Section = ({ icon: Icon, title, children }) => (
    <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, paddingBottom: 10, borderBottom: '1px solid #f1f5f9' }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={16} color="#1e40af" />
            </div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', margin: 0 }}>{title}</h4>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 24px' }}>{children}</div>
    </div>
);

const Field = ({ label, value, fullWidth }) => (
    <div style={fullWidth ? { gridColumn: 'span 2' } : {}}>
        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>{label}</p>
        <p style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 500, margin: 0 }}>{value || '—'}</p>
    </div>
);

const DoctorRecordModal = ({ patient, onClose }) => {
    const record = {
        recordId:      patient.recordId    || '#REC-1042',
        date:          patient.lastVisit   || '2025-04-10',
        visitType:     'OPD',
        hospital:      'AIIMS Delhi',
        doctor:        'Dr. R. Sharma',
        specialty:     'General Medicine',
        chiefComplaint: patient.chiefComplaint || 'Fever 101°F, body ache, dry cough for 3 days',
        diagnosis:     patient.diagnosis   || 'Seasonal Influenza (Flu) — ICD-10: J11.1',
        prescription:  patient.prescriptions || 'Paracetamol 500mg 1 BD × 5d\nCetirizine 10mg 1 OD × 5d\nSteam inhalation TDS',
        followUp:      '2025-04-17',
        status:        'Treated',
    };

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
            <div
                style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 760, maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #0f766e 100%)', padding: '24px 32px', borderRadius: '20px 20px 0 0', flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center' }}>
                                    <FileText size={18} color="white" />
                                </div>
                                <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {record.recordId}
                                </span>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', margin: '0 0 4px', fontFamily: 'serif' }}>Medical Record</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.875rem' }}>
                                {record.visitType} Visit • {record.date} • {record.hospital}
                            </p>
                        </div>
                        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer' }}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div style={{ padding: '28px 32px', flex: 1 }}>
                    {/* Basic Info */}
                    <Section icon={User} title="Basic Information">
                        <Field label="Patient Name" value={patient.name} />
                        <Field label="Patient ID"   value={patient.id} />
                        <Field label="Age / Gender" value={patient.ageGender} />
                        <Field label="Blood Group"  value={patient.bloodGroup} />
                        <div style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', gap: 10 }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Condition:</p>
                            <span style={{ ...conditionStyle(patient.condition), padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{patient.condition}</span>
                        </div>
                    </Section>

                    {/* Clinical */}
                    <Section icon={Stethoscope} title="Clinical Details">
                        <Field label="Doctor"    value={record.doctor} />
                        <Field label="Specialty" value={record.specialty} />
                        <Field label="Hospital"  value={record.hospital} />
                        <Field label="Visit Type" value={record.visitType} />
                        <Field label="Visit Date" value={record.date} />
                        <Field label="Follow-up"  value={record.followUp} />
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 3px' }}>Status</p>
                            <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '4px 14px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700 }}>{record.status}</span>
                        </div>
                    </Section>

                    {/* Complaint + Diagnosis */}
                    <Section icon={Activity} title="Complaint & Diagnosis">
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Chief Complaint</p>
                            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '12px 16px', fontSize: '0.9rem', color: '#0f172a' }}>{record.chiefComplaint}</div>
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px' }}>Diagnosis</p>
                            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', fontSize: '0.9rem', color: '#1e40af', fontWeight: 600 }}>{record.diagnosis}</div>
                        </div>
                    </Section>

                    {/* Prescriptions */}
                    <Section icon={Pill} title="Prescription">
                        <div style={{ gridColumn: 'span 2' }}>
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 16px' }}>
                                {record.prescription.split('\n').map((line, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontSize: '0.875rem', color: '#065f46', marginBottom: i < record.prescription.split('\n').length - 1 ? 8 : 0 }}>
                                        <span style={{ color: '#0d9488', fontWeight: 700, flexShrink: 0 }}>•</span>
                                        {line}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Section>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 32px', borderTop: '1px solid #f1f5f9', display: 'flex', gap: 12, flexShrink: 0, background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
                    <button
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                        onMouseLeave={e => e.currentTarget.style.background = '#1e40af'}
                    >
                        <Download size={18} /> Download PDF
                    </button>
                    <button
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', background: 'white', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                        <Printer size={18} /> Print
                    </button>
                    <button onClick={onClose} style={{ padding: '13px 24px', background: 'white', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DoctorRecordModal;
