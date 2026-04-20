import React from 'react';
import { Plus } from 'lucide-react';

const ActionButton = ({ children, variant = 'primary', size = 'md', onClick, style = {} }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: size === 'sm' ? '6px 12px' : '8px 16px',
    borderRadius: 8,
    fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.15s',
    border: 'none',
    textDecoration: 'none',
    userSelect: 'none',
    ...style
  };

  if (variant === 'primary') {
    baseStyles.background = '#1e40af';
    baseStyles.color = 'white';
    baseStyles[':hover'] = { background: '#1d4ed8' };
  } else {
    baseStyles.background = 'transparent';
    baseStyles.color = '#1e40af';
    baseStyles.border = '1px solid #1e40af';
    baseStyles[':hover'] = { background: '#eff6ff' };
  }

  return (
    <button 
      onClick={onClick}
      style={baseStyles}
    >
      {variant === 'primary' && size !== 'sm' && <Plus size={16} />}
      {children}
    </button>
  );
};

export default ActionButton;

