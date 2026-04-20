import React from 'react';
import { useDashboard } from '../../store/DashboardContext';

const Consent = () => {
    const { consents, auditLogs, handleConsentToggle } = useDashboard();

    return (
        <div className="fade-in">
            <div className="section-header" style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'serif', color: 'var(--primary)' }}>Privacy & Consent</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>Manage hospital and doctor access to your medical information</p>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginBottom: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'serif', marginBottom: '20px', color: 'var(--primary)' }}>Authorized Entities</h4>
                <div className="table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Entity Name</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Access Level</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Last Updated</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Control</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(consents || []).map(c => (
                                <tr key={c._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                    <td style={{ padding: '16px', fontWeight: 600 }}>{c.entityId?.name || 'Unknown Entity'}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>Full Medical History</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', color: 'var(--text3)' }}>{new Date(c.updatedAt || Date.now()).toLocaleDateString()}</td>
                                    <td style={{ padding: '16px' }}>
                                        <span style={{ 
                                            padding: '4px 10px', 
                                            borderRadius: '6px', 
                                            fontSize: '0.75rem', 
                                            fontWeight: 600,
                                            background: c.accessGranted ? '#f0fdf4' : '#fef2f2',
                                            color: c.accessGranted ? '#166534' : '#991b1b',
                                            border: `1px solid ${c.accessGranted ? '#bbf7d0' : '#fecaca'}`
                                        }}>
                                            {c.accessGranted ? 'Granted' : 'Revoked'}
                                        </span>
                                    </td>
                                    <td style={{ padding: '16px' }}>
                                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '44px', height: '22px' }}>
                                            <input 
                                              type="checkbox" 
                                              checked={c.accessGranted || false} 
                                              onChange={(e) => handleConsentToggle(c._id, e.target.checked)}
                                              style={{ opacity: 0, width: 0, height: 0 }}
                                            />
                                            <span style={{
                                              position: 'absolute',
                                              cursor: 'pointer',
                                              top: 0, left: 0, right: 0, bottom: 0,
                                              backgroundColor: c.accessGranted ? 'var(--teal)' : '#cbd5e1',
                                              transition: '.4s',
                                              borderRadius: '34px'
                                            }}>
                                                <span style={{
                                                  position: 'absolute',
                                                  content: '',
                                                  height: '16px',
                                                  width: '16px',
                                                  left: c.accessGranted ? '24px' : '4px',
                                                  bottom: '3px',
                                                  backgroundColor: 'white',
                                                  transition: '.4s',
                                                  borderRadius: '50%'
                                                }}></span>
                                            </span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'serif', marginBottom: '20px', color: 'var(--primary)' }}>Access Audit Log</h4>
                <div className="table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Log ID</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Entity</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Action</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Date & Time</th>
                                <th style={{ padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(auditLogs || []).map(log => (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: 'var(--text3)' }}>#{log.id}</td>
                                    <td style={{ padding: '12px 16px', fontWeight: 500 }}>{log.entity}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{log.action}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem', color: 'var(--text2)' }}>{log.date}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ 
                                            fontSize: '0.75rem', 
                                            fontWeight: 600,
                                            color: log.action.includes('denied') ? '#dc2626' : '#1e40af'
                                        }}>
                                            {log.action.includes('denied') ? 'Revoked' : 'Success'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Consent;
