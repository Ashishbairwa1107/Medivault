import React from 'react';

const Skeleton = ({ width, height, borderRadius = '8px', marginBottom = '12px' }) => {
  return (
    <div 
      className="skeleton-pulse"
      style={{
        width: width || '100%',
        height: height || '20px',
        borderRadius,
        marginBottom,
        background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-loading 1.5s infinite linear'
      }}
    />
  );
};

// Add the keyframe animation to the document if not present
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `;
  document.head.appendChild(style);
}

export default Skeleton;
