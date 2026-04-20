import React, { useState } from 'react';
import { PlusCircle, Save, RotateCcw, User, Calendar, Stethoscope, ClipboardList, Pill, AlertCircle } from 'lucide-react';

const VISIT_TYPES = ['OPD', 'Follow-up', 'Emergency', 'Routine', 'In-Patient'];
const PATIENT_LIST = [
    { id: 'MV-P001', name: 'Priya Sharma'  },
    { id: 'MV-P002', name: 'Mohan Das'     },
    { id: 'MV-P003', name: 'Rajan Kapoor'  },
    { id: 'MV-P004', name: 'Ananya Gupta'  },
    { id: 'MV-P005', name: 'Suresh Nair'   },
    { id: 'MV-P006', name: 'Kavita Mehta'  },
    { id: 'MV-P007', name: 'Meena Rao'     },
    { id: 'MV-P008', name: 'Amit Verma'    },
];

const EMPTY = { patientId: '', patientName: '', visitDate: '', visitType: 'OPD', chiefComplaint: '', diagnosis: '', prescription: '', notes: '' };

const FieldLabel = ({ icon: Icon, label, required }) => (
    <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        <Icon size={13} color="#1e40af" /> {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
);

const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    borderRadius: 10,
    border: '1.5px solid #e2e8f0',
    fontSize: '0.9rem',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border 0.2s',
    boxSizing: 'border-box',
    background: 'white',
};

const AddDiagnosis = () => {
    const [form, setForm] = useState(EMPTY);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

        // Auto-fill patient name from ID selection
        if (name === 'patientId') {
            const match = PATIENT_LIST.find(p => p.id === value);
            if (match) setForm(prev => ({ ...prev, patientId: value, patientName: match.name }));
        }
    };

    const validate = () => {
        const e = {};
        if (!form.patientId)       e.patientId       = 'Patient is required';
        if (!form.visitDate)       e.visitDate       = 'Visit date is required';
        if (!form.chiefComplaint)  e.chiefComplaint  = 'Chief complaint is required';
        if (!form.diagnosis)       e.diagnosis       = 'Diagnosis is required';
        return e;
    };

    const handleSubmit = () => {
        const e = validate();
        if (Object.keys(e).length) { setErrors(e); return; }
        setSubmitted(true);
        setTimeout(() => { setSubmitted(false); setForm(EMPTY); }, 3500);
    };

    const fieldFocus = (e) => { e.target.style.borderColor = '#1e40af'; e.target.style.boxShadow = '0 0 0 3px rgba(30,64,175,0.1)'; };
    const fieldBlur  = (e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; };

    if (submitted) return (
        <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 500, gap: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #bbf7d0' }}>
                <Save size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#16a34a', margin: 0 }}>Diagnosis Saved!</h3>
            <p style={{ color: '#64748b', margin: 0 }}>Medical record for <strong>{form.patientName || 'patient'}</strong> has been securely stored.</p>
        </div>
    );

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>Add New Diagnosis</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Create a new clinical record for a patient</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
                {/* Left: Main Form */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {/* Patient + Date Row */}
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'serif', color: '#1e40af', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <User size={18} color="#1e40af" /> Patient Details
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                            <div>
                                <FieldLabel icon={User} label="Patient" required />
                                <select name="patientId" value={form.patientId} onChange={handleChange}
                                    style={{ ...inputStyle, borderColor: errors.patientId ? '#ef4444' : '#e2e8f0' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur}>
                                    <option value="">— Select Patient —</option>
                                    {PATIENT_LIST.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}
                                </select>
                                {errors.patientId && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.patientId}</p>}
                            </div>
                            <div>
                                <FieldLabel icon={User} label="Patient Name" />
                                <input name="patientName" value={form.patientName} onChange={handleChange} placeholder="Auto-filled on selection" style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }} readOnly onFocus={fieldFocus} onBlur={fieldBlur} />
                            </div>
                            <div>
                                <FieldLabel icon={Calendar} label="Visit Date" required />
                                <input type="date" name="visitDate" value={form.visitDate} onChange={handleChange} max={new Date().toISOString().split('T')[0]}
                                    style={{ ...inputStyle, borderColor: errors.visitDate ? '#ef4444' : '#e2e8f0' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur} />
                                {errors.visitDate && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.visitDate}</p>}
                            </div>
                            <div>
                                <FieldLabel icon={Stethoscope} label="Visit Type" required />
                                <select name="visitType" value={form.visitType} onChange={handleChange} style={inputStyle} onFocus={fieldFocus} onBlur={fieldBlur}>
                                    {VISIT_TYPES.map(v => <option key={v}>{v}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Clinical Details */}
                    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, fontFamily: 'serif', color: '#1e40af', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <ClipboardList size={18} color="#1e40af" /> Clinical Details
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                            <div>
                                <FieldLabel icon={AlertCircle} label="Chief Complaint" required />
                                <textarea name="chiefComplaint" value={form.chiefComplaint} onChange={handleChange} placeholder="e.g. Fever 101°F for 3 days, body ache, dry cough..." rows={3}
                                    style={{ ...inputStyle, resize: 'vertical', borderColor: errors.chiefComplaint ? '#ef4444' : '#e2e8f0' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur} />
                                {errors.chiefComplaint && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.chiefComplaint}</p>}
                            </div>
                            <div>
                                <FieldLabel icon={Stethoscope} label="Diagnosis" required />
                                <textarea name="diagnosis" value={form.diagnosis} onChange={handleChange} placeholder="e.g. Seasonal Influenza (Flu) — ICD-10: J11.1..." rows={3}
                                    style={{ ...inputStyle, resize: 'vertical', borderColor: errors.diagnosis ? '#ef4444' : '#e2e8f0' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur} />
                                {errors.diagnosis && <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: 4 }}>{errors.diagnosis}</p>}
                            </div>
                            <div>
                                <FieldLabel icon={Pill} label="Prescription" />
                                <textarea name="prescription" value={form.prescription} onChange={handleChange} placeholder="e.g. Paracetamol 500mg 1 tab BD × 5 days&#10;Cetirizine 10mg 1 tab OD × 5 days&#10;Steam inhalation TDS" rows={4}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur} />
                            </div>
                            <div>
                                <FieldLabel icon={ClipboardList} label="Doctor's Notes" />
                                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Additional observations, follow-up instructions, referrals..." rows={3}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                    onFocus={fieldFocus} onBlur={fieldBlur} />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 32px', background: '#1e40af', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#1d4ed8'}
                            onMouseLeave={e => e.currentTarget.style.background = '#1e40af'}>
                            <Save size={18} /> Save Diagnosis
                        </button>
                        <button onClick={() => setForm(EMPTY)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 24px', background: 'white', color: '#475569', border: '1.5px solid #e2e8f0', borderRadius: 12, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                            <RotateCcw size={16} /> Reset
                        </button>
                    </div>
                </div>

                {/* Right: Preview Card */}
                <div>
                    <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #0d9488 100%)', borderRadius: 16, padding: 24, color: 'white', marginBottom: 16 }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.9rem', margin: '0 0 16px', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Record Preview</h4>
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {[
                                ['Patient', form.patientName || '—'],
                                ['Patient ID', form.patientId || '—'],
                                ['Visit Date', form.visitDate || '—'],
                                ['Visit Type', form.visitType],
                                ['Complaint', form.chiefComplaint ? form.chiefComplaint.substring(0, 40) + (form.chiefComplaint.length > 40 ? '...' : '') : '—'],
                                ['Diagnosis', form.diagnosis ? form.diagnosis.substring(0, 40) + (form.diagnosis.length > 40 ? '...' : '') : '—'],
                            ].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                                    <span style={{ opacity: 0.7, flexShrink: 0 }}>{k}</span>
                                    <span style={{ fontWeight: 600, textAlign: 'right' }}>{v}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 16, padding: 20 }}>
                        <h4 style={{ fontWeight: 700, fontSize: '0.85rem', color: '#64748b', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Tips</h4>
                        {[
                            'Use ICD-10 codes in the Diagnosis field for standardization',
                            'Prescriptions should include dose, frequency & duration',
                            'Patient ID auto-fills name from your patient registry',
                        ].map((tip, i) => (
                            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: '0.8rem', color: '#64748b' }}>
                                <span style={{ color: '#0d9488', fontWeight: 700, flexShrink: 0 }}>✦</span>
                                <span>{tip}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddDiagnosis;
