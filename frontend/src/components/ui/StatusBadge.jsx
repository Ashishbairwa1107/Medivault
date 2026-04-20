import React from 'react';

const STATUS_STYLES = {
  Verified: { bg: '#ecfdf5', text: '#059669', border: '#bbf7d0' },
  Pending: { bg: '#fef3c7', text: '#d97706', border: '#fde68a' },
  Active: { bg: '#ecfdf5', text: '#059669', border: '#bbf7d0' },
  Suspended: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
  Flagged: { bg: '#fef3c7', text: '#dc2626', border: '#fed7aa' },
  success: { bg: '#ecfdf5', text: '#059669', border: '#bbf7d0' },
  destructive: { bg: '#fee2e2', text: '#dc2626', border: '#fecaca' },
  secondary: { bg: '#f3f4f6', text: '#4b5563', border: '#e5e7eb' }
};

const StatusBadge = ({ status, variant, className = '', children }) => {
  const styles = STATUS_STYLES[status] || STATUS_STYLES[variant] || { bg: '#f1f5f9', text: '#64748b', border: '#e2e8f0' };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4px 10px',
      borderRadius: 20,
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.025em',
      background: styles.bg,
      color: styles.text,
      border: `1px solid ${styles.border}`,
      ...styles
    }} className={className}>
      {children ?? status}
    </span>
  );
};

export { StatusBadge };
export default StatusBadge;

