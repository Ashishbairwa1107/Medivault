import React, { useState } from 'react';
import { Shield, Search, Eye, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const AUDIT_LOGS = [
    { id: 'AUD-001', entity: 'Dr. R. Sharma',      entityType: 'Doctor',   patient: 'Priya Sharma',  patientId: 'MV-P001', action: 'Viewed Medical Record #REC-1042', date: '2025-04-12', time: '10:32 AM', ip: '192.168.1.42', status: 'Authorized' },
    { id: 'AUD-002', entity: 'Apollo Hospital',     entityType: 'Hospital', patient: 'Mohan Das',     patientId: 'MV-P002', action: 'Accessed Lab Report #LAB-0891',   date: '2025-04-12', time: '11:15 AM', ip: '10.0.2.15',   status: 'Authorized' },
    { id: 'AUD-003', entity: 'MediVault System',    entityType: 'System',   patient: 'Rajan Kapoor',  patientId: 'MV-P003', action: 'Auto-backup of ICU records',       date: '2025-04-12', time: '12:00 AM', ip: '127.0.0.1',   status: 'System'     },
    { id: 'AUD-004', entity: 'Dr. S. Patel',        entityType: 'Doctor',   patient: 'Ananya Gupta',  patientId: 'MV-P004', action: 'Viewed Prescription RX-2025-003', date: '2025-04-11', time: '03:48 PM', ip: '10.0.1.8',    status: 'Authorized' },
    { id: 'AUD-005', entity: 'Safdarjung Hospital', entityType: 'Hospital', patient: 'Priya Sharma',  patientId: 'MV-P001', action: 'Attempted to access full records',  date: '2025-04-10', time: '09:20 AM', ip: '172.16.0.5',  status: 'Revoked'    },
    { id: 'AUD-006', entity: 'MediVault System',    entityType: 'System',   patient: 'Suresh Nair',   patientId: 'MV-P005', action: 'Prescription auto-renewal alert',  date: '2025-04-10', time: '12:00 AM', ip: '127.0.0.1',   status: 'System'     },
    { id: 'AUD-007', entity: 'Dr. K. Singh',        entityType: 'Doctor',   patient: 'Kavita Mehta',  patientId: 'MV-P006', action: 'Downloaded report PDF',            date: '2025-04-09', time: '02:10 PM', ip: '192.168.1.18', status: 'Authorized' },
    { id: 'AUD-008', entity: 'Max Hospital',        entityType: 'Hospital', patient: 'Amit Verma',    patientId: 'MV-P008', action: 'Accessed Dialysis Report',          date: '2025-04-08', time: '10:05 AM', ip: '10.0.3.22',   status: 'Authorized' },
    { id: 'AUD-009', entity: 'Unknown Entity',      entityType: 'Unknown',  patient: 'Meena Rao',     patientId: 'MV-P007', action: 'Unauthorized access attempt',       date: '2025-04-07', time: '11:55 PM', ip: '45.33.32.156', status: 'Revoked'    },
    { id: 'AUD-010', entity: 'MediVault System',    entityType: 'System',   patient: 'ALL Patients',  patientId: 'ALL',     action: 'Nightly audit log generation',     date: '2025-04-07', time: '12:00 AM', ip: '127.0.0.1',   status: 'System'     },
];

const statusConfig = {
    Authorized: { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0', icon: CheckCircle },
    System:     { bg: '#eff6ff', color: '#1e40af', border: '#bfdbfe', icon: Shield      },
    Revoked:    { bg: '#fef2f2', color: '#ef4444', border: '#fecaca', icon: XCircle     },
};

const entityTypeColor = {
    Doctor:   { bg: '#eff6ff', color: '#1e40af' },
    Hospital: { bg: '#f0fdf4', color: '#059669' },
    System:   { bg: '#f5f3ff', color: '#7c3aed' },
    Unknown:  { bg: '#fef2f2', color: '#ef4444' },
};

const DoctorAuditLog = () => {
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filtered = AUDIT_LOGS.filter(log => {
        const matchSearch = log.entity.toLowerCase().includes(search.toLowerCase()) ||
                            log.patient.toLowerCase().includes(search.toLowerCase()) ||
                            log.action.toLowerCase().includes(search.toLowerCase());
        const matchStatus = filterStatus === 'All' || log.status === filterStatus;
        return matchSearch && matchStatus;
    });

    const counts = { Authorized: 0, System: 0, Revoked: 0 };
    AUDIT_LOGS.forEach(l => counts[l.status]++);

    return (
        <div className="fade-in">
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>Access Audit Log</h3>
                <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Who accessed your patient records — full transparency trail</p>
            </div>

            {/* Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
                {[
                    { label: 'Authorized', count: counts.Authorized, ...statusConfig.Authorized },
                    { label: 'System',     count: counts.System,     ...statusConfig.System     },
                    { label: 'Revoked',    count: counts.Revoked,    ...statusConfig.Revoked    },
                ].map(s => {
                    const Icon = s.icon;
                    return (
                        <div key={s.label} style={{ background: s.bg, border: `1.5px solid ${s.border}`, borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={22} color={s.color} />
                            </div>
                            <div>
                                <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.count}</p>
                                <p style={{ fontSize: '0.78rem', fontWeight: 600, color: s.color, margin: 0, opacity: 0.8 }}>{s.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by entity, patient, or action..." style={{ width: '100%', paddingLeft: 40, paddingRight: 16, paddingTop: 10, paddingBottom: 10, borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.875rem', background: 'white', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                {['All', 'Authorized', 'System', 'Revoked'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '10px 16px', borderRadius: 10, border: '1px solid #e2e8f0', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', background: filterStatus === s ? '#1e40af' : 'white', color: filterStatus === s ? 'white' : '#64748b' }}>{s}</button>
                ))}
            </div>

            {/* Table */}
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            {['Audit ID', 'Accessed By', 'Type', 'Patient', 'Action', 'Date & Time', 'IP Address', 'Status'].map(h => (
                                <th key={h} style={{ padding: '13px 18px', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map((log, i) => {
                            const sc = statusConfig[log.status];
                            const Icon = sc.icon;
                            const etc = entityTypeColor[log.entityType] || entityTypeColor.Unknown;
                            return (
                                <tr key={log.id}
                                    style={{ borderBottom: i < filtered.length - 1 ? '1px solid #f1f5f9' : 'none', transition: 'background 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <td style={{ padding: '14px 18px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#1e40af', fontWeight: 600 }}>{log.id}</td>
                                    <td style={{ padding: '14px 18px', fontWeight: 600, fontSize: '0.875rem', color: '#0f172a', whiteSpace: 'nowrap' }}>{log.entity}</td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <span style={{ ...etc, padding: '3px 10px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700 }}>{log.entityType}</span>
                                    </td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0f172a' }}>{log.patient}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{log.patientId}</div>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: '#475569', maxWidth: 220 }}>
                                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.action}</div>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: '#64748b', whiteSpace: 'nowrap' }}>
                                        {log.date}<br /><span style={{ color: '#94a3b8' }}>{log.time}</span>
                                    </td>
                                    <td style={{ padding: '14px 18px', fontSize: '0.75rem', fontFamily: 'monospace', color: '#94a3b8' }}>{log.ip}</td>
                                    <td style={{ padding: '14px 18px' }}>
                                        <span style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                            <Icon size={11} /> {log.status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {filtered.length === 0 && (
                    <div style={{ padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
                        <Shield size={40} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                        <p style={{ fontWeight: 600 }}>No audit logs match your filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DoctorAuditLog;
