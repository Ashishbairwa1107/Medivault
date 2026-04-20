import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, User, Calendar, MapPin } from 'lucide-react';

const TODAY = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const APPOINTMENTS = [
    { id: 'APT-001', time: '09:00 AM', patient: 'Priya Sharma',  patientId: 'MV-P001', age: '34/F', type: 'Follow-up',    reason: 'Flu recovery check',          room: 'OPD-3', status: 'Completed' },
    { id: 'APT-002', time: '09:30 AM', patient: 'Mohan Das',     patientId: 'MV-P002', age: '58/M', type: 'Routine',      reason: 'BP monitoring',               room: 'OPD-3', status: 'Completed' },
    { id: 'APT-003', time: '10:00 AM', patient: 'Ananya Gupta',  patientId: 'MV-P004', age: '28/F', type: 'Follow-up',    reason: 'Diabetes management review', room: 'OPD-3', status: 'Completed' },
    { id: 'APT-004', time: '10:30 AM', patient: 'Suresh Nair',   patientId: 'MV-P005', age: '45/M', type: 'OPD',          reason: 'Asthma consultation',         room: 'OPD-3', status: 'Completed' },
    { id: 'APT-005', time: '11:00 AM', patient: 'Kavita Mehta',  patientId: 'MV-P006', age: '52/F', type: 'Follow-up',    reason: 'Thyroid levels review',       room: 'OPD-3', status: 'Completed' },
    { id: 'APT-006', time: '11:30 AM', patient: 'Meena Rao',     patientId: 'MV-P007', age: '39/F', type: 'Emergency',    reason: 'Severe migraine episode',     room: 'ER-1',  status: 'Completed' },
    { id: 'APT-007', time: '12:00 PM', patient: 'Rajan Kapoor',  patientId: 'MV-P003', age: '65/M', type: 'Critical',     reason: 'Post-cardiac care review',    room: 'ICU-2', status: 'Completed' },
    { id: 'APT-008', time: '12:30 PM', patient: 'Amit Verma',    patientId: 'MV-P008', age: '71/M', type: 'Critical',     reason: 'CKD dialysis review',         room: 'ICU-2', status: 'Completed' },
    { id: 'APT-009', time: '02:00 PM', patient: 'Deepak Sharma', patientId: 'MV-P009', age: '42/M', type: 'OPD',          reason: 'General health screening',    room: 'OPD-3', status: 'Completed' },
    { id: 'APT-010', time: '02:30 PM', patient: 'Rajni Patel',   patientId: 'MV-P010', age: '55/F', type: 'Follow-up',    reason: 'Post-surgery wound check',    room: 'OPD-1', status: 'In Progress' },
    { id: 'APT-011', time: '03:00 PM', patient: 'Harish Kumar',  patientId: 'MV-P011', age: '30/M', type: 'OPD',          reason: 'Chest pain evaluation',       room: 'OPD-2', status: 'Waiting' },
    { id: 'APT-012', time: '03:30 PM', patient: 'Sonal Verma',   patientId: 'MV-P012', age: '26/F', type: 'Routine',      reason: 'Prenatal check-up',           room: 'OPD-3', status: 'Waiting' },
];

const statusConfig = {
    Completed:   { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle },
    'In Progress': { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', icon: Clock },
    Waiting:     { bg: '#fffbeb', color: '#d97706', border: '#fde68a', icon: AlertCircle },
};

const typeColor = {
    'Follow-up':  { bg: '#eff6ff',  color: '#3b82f6'  },
    Routine:      { bg: '#f0fdf4',  color: '#16a34a'  },
    OPD:          { bg: '#f5f3ff',  color: '#7c3aed'  },
    Emergency:    { bg: '#fef2f2',  color: '#ef4444'  },
    Critical:     { bg: '#fef2f2',  color: '#dc2626'  },
};

const DoctorAppointments = () => {
    const [filter, setFilter] = useState('All');

    const total = APPOINTMENTS.length;
    const completed = APPOINTMENTS.filter(a => a.status === 'Completed').length;
    const remaining = APPOINTMENTS.filter(a => a.status !== 'Completed').length;

    const filtered = filter === 'All' ? APPOINTMENTS : APPOINTMENTS.filter(a => a.status === filter);

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>Appointments</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>
                    <Calendar size={14} style={{ display: 'inline', marginRight: 5, verticalAlign: 'middle' }} />
                    {TODAY}
                </p>
            </div>

            {/* Summary strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
                {[
                    { label: 'Total Today', value: total,     color: '#1e40af', bg: '#eff6ff', border: '#bfdbfe' },
                    { label: 'Completed',   value: completed, color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                    { label: 'Remaining',   value: remaining, color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
                ].map(s => (
                    <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 14, padding: '20px 24px', textAlign: 'center' }}>
                        <p style={{ fontSize: '2.2rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: s.color, margin: '4px 0 0', opacity: 0.8 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {['All', 'Waiting', 'In Progress', 'Completed'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{ padding: '9px 18px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: filter === f ? '#1e40af' : 'white', color: filter === f ? 'white' : '#64748b', transition: 'all 0.15s' }}
                    >{f}</button>
                ))}
            </div>

            {/* Timeline list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.map((apt, i) => {
                    const sc = statusConfig[apt.status] || statusConfig.Waiting;
                    const Icon = sc.icon;
                    const tc = typeColor[apt.type] || typeColor.OPD;
                    return (
                        <div key={apt.id}
                            style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 20, transition: 'box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.10)'}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)'}
                        >
                            {/* Time */}
                            <div style={{ minWidth: 80, textAlign: 'center' }}>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1e40af' }}>{apt.time.split(' ')[0]}</div>
                                <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{apt.time.split(' ')[1]}</div>
                            </div>

                            {/* Divider */}
                            <div style={{ width: 2, height: 48, background: `${sc.border}`, borderRadius: 2, flexShrink: 0 }} />

                            {/* Avatar + patient */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.8rem', flexShrink: 0 }}>
                                    {apt.patient.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{apt.patient}</div>
                                    <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{apt.patientId} • {apt.age}</div>
                                </div>
                            </div>

                            {/* Reason */}
                            <div style={{ flex: 2, fontSize: '0.875rem', color: '#475569' }}>{apt.reason}</div>

                            {/* Type badge */}
                            <span style={{ ...tc, padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>{apt.type}</span>

                            {/* Room */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#94a3b8', minWidth: 64 }}>
                                <MapPin size={13} /> {apt.room}
                            </div>

                            {/* Status */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: sc.bg, border: `1px solid ${sc.border}`, color: sc.color, padding: '5px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                                <Icon size={12} /> {apt.status}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DoctorAppointments;
