import React, { useState } from 'react';
import { Pill, PlusCircle, Search } from 'lucide-react';

const PRESCRIPTIONS = [
    { rxId: 'RX-2025-001', patient: 'Priya Sharma',  patientId: 'MV-P001', date: '2025-04-10', medicines: 'Paracetamol 500mg, Cetirizine 10mg',       duration: '5 days',   status: 'Active'    },
    { rxId: 'RX-2025-002', patient: 'Mohan Das',     patientId: 'MV-P002', date: '2025-04-11', medicines: 'Amlodipine 5mg, Losartan 50mg',             duration: 'Ongoing',  status: 'Active'    },
    { rxId: 'RX-2025-003', patient: 'Ananya Gupta',  patientId: 'MV-P004', date: '2025-04-08', medicines: 'Metformin 500mg, Glimepiride 1mg',          duration: '30 days',  status: 'Active'    },
    { rxId: 'RX-2025-004', patient: 'Suresh Nair',   patientId: 'MV-P005', date: '2025-04-05', medicines: 'Salbutamol inhaler, Budesonide 200mcg',     duration: '2 weeks',  status: 'Active'    },
    { rxId: 'RX-2025-005', patient: 'Kavita Mehta',  patientId: 'MV-P006', date: '2025-04-09', medicines: 'Levothyroxine 50mcg',                       duration: 'Ongoing',  status: 'Active'    },
    { rxId: 'RX-2025-006', patient: 'Meena Rao',     patientId: 'MV-P007', date: '2025-04-11', medicines: 'Sumatriptan 50mg, Propranolol 40mg',        duration: '10 days',  status: 'Active'    },
    { rxId: 'RX-2025-007', patient: 'Amit Verma',    patientId: 'MV-P008', date: '2025-04-07', medicines: 'Furosemide 40mg, Enalapril 5mg',            duration: 'Ongoing',  status: 'Active'    },
    { rxId: 'RX-2025-008', patient: 'Priya Sharma',  patientId: 'MV-P001', date: '2025-02-15', medicines: 'Azithromycin 500mg, Dolo 650mg',            duration: '5 days',   status: 'Completed' },
    { rxId: 'RX-2025-009', patient: 'Rajan Kapoor',  patientId: 'MV-P003', date: '2025-03-01', medicines: 'Aspirin 325mg, Clopidogrel 75mg',           duration: 'Ongoing',  status: 'Completed' },
    { rxId: 'RX-2024-010', patient: 'Mohan Das',     patientId: 'MV-P002', date: '2024-12-20', medicines: 'Atenolol 50mg',                             duration: '1 month',  status: 'Completed' },
];

const statusStyle = {
    Active:    { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    Completed: { background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1' },
};

const DoctorPrescriptions = () => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [newRx, setNewRx] = useState({ patient: '', medicines: '', duration: '' });

    const filtered = PRESCRIPTIONS.filter(rx => {
        const matchSearch = rx.patient.toLowerCase().includes(search.toLowerCase()) || rx.rxId.includes(search);
        const matchStatus = filterStatus === 'All' || rx.status === filterStatus;
        return matchSearch && matchStatus;
    });

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>Prescriptions</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Issue and manage digital prescriptions</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <PlusCircle size={16} /> New Prescription
                </button>
            </div>

            {/* Quick-issue form */}
            {showForm && (
                <div style={{ background: 'white', border: '1px solid #bfdbfe', borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: '0 4px 12px rgba(30,64,175,0.08)' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1rem', color: '#1e40af', marginBottom: 16 }}>Issue New Prescription</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Patient Name</label>
                            <input value={newRx.patient} onChange={e => setNewRx({...newRx, patient: e.target.value})} placeholder="e.g. Priya Sharma" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Duration</label>
                            <input value={newRx.duration} onChange={e => setNewRx({...newRx, duration: e.target.value})} placeholder="e.g. 5 days, Ongoing" style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', boxSizing: 'border-box' }} />
                        </div>
                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: 6 }}>Medicines</label>
                            <textarea value={newRx.medicines} onChange={e => setNewRx({...newRx, medicines: e.target.value})} placeholder="e.g. Paracetamol 500mg 1 BD × 5 days, Cetirizine 10mg..." rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                        <button style={{ padding: '10px 24px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Issue Prescription</button>
                        <button onClick={() => setShowForm(false)} style={{ padding: '10px 24px', background: 'white', color: '#475569', border: '1px solid #e2e8f0', borderRadius: 10, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by patient or RX ID..." style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {['All', 'Active', 'Completed'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: filterStatus === s ? '#1e40af' : 'white', color: filterStatus === s ? 'white' : '#64748b' }}>{s}</button>
                ))}
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['RX ID', 'Patient', 'Patient ID', 'Date', 'Medicines', 'Duration', 'Status'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((rx, i) => (
                            <tr key={rx.rxId} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '16px 20px', fontSize: '0.8rem', fontWeight: 700, color: '#1e40af', fontFamily: 'monospace' }}>{rx.rxId}</td>
                                <td style={{ padding: '16px 20px', fontWeight: 600, fontSize: '0.875rem', color: '#0f172a' }}>{rx.patient}</td>
                                <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: '#64748b' }}>{rx.patientId}</td>
                                <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#475569' }}>{rx.date}</td>
                                <td style={{ padding: '16px 20px', fontSize: '0.8rem', color: '#475569', maxWidth: 220 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rx.medicines}</div></td>
                                <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#475569' }}>{rx.duration}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ ...statusStyle[rx.status], padding: '4px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{rx.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DoctorPrescriptions;
