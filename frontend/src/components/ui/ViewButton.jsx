import React from 'react';

const ViewButton = ({ onClick, label = 'View' }) => {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: '8px',
        border: '1px solid var(--border, #e5e7eb)',
        background: 'white',
        fontSize: '0.8rem',
        fontWeight: 500,
        color: 'var(--primary, #1e40af)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.background = 'var(--primary-light, #eff6ff)';
        e.currentTarget.style.borderColor = 'var(--primary, #1e40af)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.background = 'white';
        e.currentTarget.style.borderColor = 'var(--border, #e5e7eb)';
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
      {label}
    </button>
  );
};

export default ViewButton;
