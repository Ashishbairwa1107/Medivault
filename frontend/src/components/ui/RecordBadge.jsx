import React from 'react';

const RecordBadge = ({ status, type }) => {
  const getBadgeClass = () => {
    const s = status?.toLowerCase() || '';
    if (s.includes('treated') || s.includes('completed') || s === 'active') return 'badge-green';
    if (s.includes('monitoring') || s.includes('refill')) return 'badge-orange';
    if (s.includes('reviewed')) return 'badge-purple';
    if (s.includes('pending')) return 'badge-blue';
    return 'badge-blue';
  };

  const colors = {
    'badge-green': { bg: '#d1fae5', text: '#065f46', border: '#10b981' },
    'badge-orange': { bg: '#ffedd5', text: '#9a3412', border: '#f97316' },
    'badge-purple': { bg: '#f3e8ff', text: '#581c87', border: '#a855f7' },
    'badge-blue': { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
    'badge-teal': { bg: '#ccfbf1', text: '#0f766e', border: '#14b8a6' },
  };

  const styleClass = getBadgeClass();
  const style = colors[styleClass] || colors['badge-blue'];

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 10px',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: 600,
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
      textTransform: 'capitalize'
    }}>
      {status || type || 'N/A'}
    </span>
  );
};

export default RecordBadge;
