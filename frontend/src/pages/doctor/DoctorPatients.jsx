import React, { useState, useContext } from 'react';
import { DoctorContext } from './DoctorDashboardPage';
import { Search, UserPlus, Filter } from 'lucide-react';

const PATIENTS = [
    { id: 'MV-P001', name: 'Priya Sharma',  ageGender: '34 / F', bloodGroup: 'O+',  lastVisit: '2025-04-10', condition: 'Stable',     recordId: '#REC-1042', diagnosis: 'Seasonal Influenza', chiefComplaint: 'Fever, body ache, cough', prescriptions: 'Paracetamol 500mg 1 BD × 5d, Cetirizine 10mg 1 OD × 5d' },
    { id: 'MV-P002', name: 'Mohan Das',     ageGender: '58 / M', bloodGroup: 'B+',  lastVisit: '2025-04-11', condition: 'Monitoring', recordId: '#REC-1038', diagnosis: 'Hypertension Stage 2',  chiefComplaint: 'Persistent headache, dizziness',            prescriptions: 'Amlodipine 5mg 1 OD, Losartan 50mg 1 OD'       },
    { id: 'MV-P003', name: 'Rajan Kapoor',  ageGender: '65 / M', bloodGroup: 'A-',  lastVisit: '2025-04-12', condition: 'Critical',   recordId: '#REC-1025', diagnosis: 'Acute MI (STEMI)',      chiefComplaint: 'Chest pain, shortness of breath',           prescriptions: 'Aspirin 325mg, Clopidogrel 75mg, Atorvastatin 40mg' },
    { id: 'MV-P004', name: 'Ananya Gupta',  ageGender: '28 / F', bloodGroup: 'AB+', lastVisit: '2025-04-08', condition: 'Stable',     recordId: '#REC-1019', diagnosis: 'Type 2 Diabetes',       chiefComplaint: 'Fatigue, frequent urination',               prescriptions: 'Metformin 500mg 1 BD, Glimepiride 1mg 1 OD'      },
    { id: 'MV-P005', name: 'Suresh Nair',   ageGender: '45 / M', bloodGroup: 'B-',  lastVisit: '2025-04-05', condition: 'Stable',     recordId: '#REC-1015', diagnosis: 'Bronchial Asthma',      chiefComplaint: 'Wheezing, breathlessness at night',         prescriptions: 'Salbutamol inhaler, Budesonide 200mcg'           },
    { id: 'MV-P006', name: 'Kavita Mehta',  ageGender: '52 / F', bloodGroup: 'O-',  lastVisit: '2025-04-09', condition: 'Monitoring', recordId: '#REC-1010', diagnosis: 'Hypothyroidism',         chiefComplaint: 'Weight gain, cold intolerance',             prescriptions: 'Levothyroxine 50mcg 1 OD'                        },
    { id: 'MV-P007', name: 'Meena Rao',     ageGender: '39 / F', bloodGroup: 'A+',  lastVisit: '2025-04-11', condition: 'Stable',     recordId: '#REC-1008', diagnosis: 'Migraine',              chiefComplaint: 'Severe throbbing headache, nausea',         prescriptions: 'Sumatriptan 50mg PRN, Propranolol 40mg 1 BD'     },
    { id: 'MV-P008', name: 'Amit Verma',    ageGender: '71 / M', bloodGroup: 'B+',  lastVisit: '2025-04-07', condition: 'Critical',   recordId: '#REC-1003', diagnosis: 'Chronic Kidney Disease', chiefComplaint: 'Swelling, decreased urine output',          prescriptions: 'Furosemide 40mg 1 OD, Enalapril 5mg 1 OD'       },
];

const conditionStyle = (c) => ({
    Critical:   { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
    Monitoring: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    Stable:     { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
}[c] || { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' });

const DoctorPatients = () => {
    const { openModal } = useContext(DoctorContext);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('All');

    const conditions = ['All', 'Stable', 'Monitoring', 'Critical'];

    const filtered = PATIENTS.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'All' || p.condition === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>My Patients</h3>
                    <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>{filtered.length} patients under your care</p>
                </div>
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 10, fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
                    <UserPlus size={16} /> Add Patient
                </button>
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name or patient ID..."
                        style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white', outline: 'none', boxSizing: 'border-box' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    {conditions.map(c => (
                        <button
                            key={c}
                            onClick={() => setFilter(c)}
                            style={{
                                padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                                background: filter === c ? '#1e40af' : 'white',
                                color: filter === c ? 'white' : '#64748b',
                            }}
                        >{c}</button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['Patient ID', 'Name', 'Age / Gender', 'Blood Group', 'Last Visit', 'Condition', 'Action'].map(h => (
                                <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((p, i) => (
                            <tr
                                key={p.id}
                                style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <td style={{ padding: '16px 20px', fontSize: '0.85rem', fontWeight: 600, color: '#1e40af', fontFamily: 'monospace' }}>{p.id}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0 }}>
                                            {p.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{p.name}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#475569' }}>{p.ageGender}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ background: '#eff6ff', color: '#1e40af', border: '1px solid #bfdbfe', borderRadius: 6, padding: '3px 10px', fontSize: '0.8rem', fontWeight: 700 }}>{p.bloodGroup}</span>
                                </td>
                                <td style={{ padding: '16px 20px', fontSize: '0.875rem', color: '#64748b' }}>{p.lastVisit}</td>
                                <td style={{ padding: '16px 20px' }}>
                                    <span style={{ ...conditionStyle(p.condition), padding: '4px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>{p.condition}</span>
                                </td>
                                <td style={{ padding: '16px 20px' }}>
                                    <button
                                        onClick={() => openModal(p)}
                                        style={{ padding: '7px 18px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 8, fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#1e40af'}
                                    >Records</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        <Search size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p style={{ fontWeight: 600 }}>No patients match your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export { PATIENTS };
export default DoctorPatients;
