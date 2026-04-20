import React from 'react';
import { useDashboard } from '../../store/DashboardContext';
import RecordBadge from '../../components/ui/RecordBadge';
import ViewButton from '../../components/ui/ViewButton';

import Skeleton from '../../components/ui/Skeleton';

const Records = () => {
    const { records, loading, toggleUploadModal, setViewRecord } = useDashboard();

    return (
        <div className="fade-in">
            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'serif', color: 'var(--primary)' }}>My Medical Records</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>Access and manage all your historical health documents</p>
                </div>
                <button 
                  className="btn btn-primary"
                  style={{ 
                    backgroundColor: 'var(--primary)', 
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                  onClick={toggleUploadModal}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Upload New Record
                </button>
            </div>

            <div className="table-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div className="table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc', borderBottom: '2px solid var(--border)' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Record ID</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Doctor</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Hospital</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Diagnosis</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                                        <td style={{ padding: '16px' }}><Skeleton width="80px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="100px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="60px" borderRadius="12px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="120px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="120px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="150px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="70px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="40px" marginBottom="0" /></td>
                                    </tr>
                                ))
                            ) : (records || []).length > 0 ? (records || []).map(r => (
                                <tr key={r._id || Math.random()} style={{ borderTop: '1px solid var(--border)', transition: 'background 0.2s' }} className="hover:bg-slate-50">
                                    <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary)' }}>{r.recordId || 'N/A'}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{new Date(r.date || r.createdAt || Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '16px' }}><RecordBadge status={r.status} type={r.type} /></td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{r.doctor || r.doctorId?.name || 'N/A'}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{r.hospital || r.hospitalId?.name || 'N/A'}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{r.diagnosis || 'N/A'}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            display: 'inline-block', 
                                            width: '8px', 
                                            height: '8px', 
                                            borderRadius: '50%', 
                                            backgroundColor: r.status === 'Treated' ? 'var(--green)' : 'var(--primary)',
                                            marginRight: '8px'
                                        }}></span>
                                        <span style={{ fontSize: '0.875rem' }}>{r.status || 'Verified'}</span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <ViewButton onClick={() => setViewRecord(r)} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                                        No medical records found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Records;
