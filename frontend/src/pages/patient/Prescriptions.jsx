import React from 'react';
import { useDashboard } from '../../store/DashboardContext';

const RecordBadgeSimple = ({ status }) => {
  const getColors = (s) => {
    switch(s?.toLowerCase()) {
      case 'active': return { bg: '#dcfce7', text: '#166534', dot: '#22c55e' };
      case 'refill soon': return { bg: '#ffedd5', text: '#9a3412', dot: '#f97316' };
      case 'completed': return { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' };
      default: return { bg: '#f3f4f6', text: '#374151', dot: '#9ca3af' };
    }
  };
  const colors = getColors(status);
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '4px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: colors.bg,
      color: colors.text
    }}>
      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: colors.dot }}></span>
      {status}
    </span>
  );
};

const Prescriptions = () => {
    const { prescriptions, loading } = useDashboard();

    return (
        <div className="fade-in">
            <div className="section-header" style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'serif', color: 'var(--primary)' }}>My Prescriptions</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>Current and past medication history</p>
            </div>

            <div className="table-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div className="table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>RX ID</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Doctor</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Medicines</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Duration</th>
                                <th style={{ textAlign: 'left', padding: '16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} style={{ borderTop: i > 0 ? '1px solid var(--border)' : 'none' }}>
                                        <td style={{ padding: '16px' }}><Skeleton width="60px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="100px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="120px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="200px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="80px" marginBottom="0" /></td>
                                        <td style={{ padding: '16px' }}><Skeleton width="90px" borderRadius="20px" marginBottom="0" /></td>
                                    </tr>
                                ))
                            ) : (prescriptions || []).length > 0 ? prescriptions.map(p => (
                                <tr key={p.rxId} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '16px', fontSize: '0.875rem', fontWeight: 600 }}>{p.rxId}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{p.doctor}</td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>
                                        <div style={{ maxWidth: '300px', lineHeight: '1.4' }}>{p.medicines}</div>
                                    </td>
                                    <td style={{ padding: '16px', fontSize: '0.875rem' }}>{p.duration}</td>
                                    <td style={{ padding: '16px' }}>
                                        <RecordBadgeSimple status={p.status} />
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                                        No prescriptions available
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

export default Prescriptions;
