import React from 'react';
import { TrendingUp, Minus } from 'lucide-react';

/**
 * AdminStatCard — uses inline styles for all colors so it works
 * regardless of Tailwind custom color overrides in tailwind.config.js.
 */

const SCHEMES = {
  blue: {
    cardBg:     'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)',
    iconBg:     'linear-gradient(135deg, #2563eb 0%, #4f46e5 100%)',
    blobColor:  'rgba(59,130,246,0.12)',
    border:     '#dbeafe',
  },
  teal: {
    cardBg:     'linear-gradient(135deg, #f0fdfa 0%, #ffffff 100%)',
    iconBg:     'linear-gradient(135deg, #0d9488 0%, #059669 100%)',
    blobColor:  'rgba(13,148,136,0.12)',
    border:     '#ccfbf1',
  },
  indigo: {
    cardBg:     'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
    iconBg:     'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
    blobColor:  'rgba(99,102,241,0.12)',
    border:     '#e0e7ff',
  },
  purple: {
    cardBg:     'linear-gradient(135deg, #faf5ff 0%, #ffffff 100%)',
    iconBg:     'linear-gradient(135deg, #9333ea 0%, #db2777 100%)',
    blobColor:  'rgba(147,51,234,0.12)',
    border:     '#f3e8ff',
  },
};

const AdminStatCard = ({ title, value, growth, icon: Icon, variant = 'blue' }) => {
  const s = SCHEMES[variant] || SCHEMES.blue;
  const isPositive = growth?.includes('+');

  return (
    <div
      style={{
        background: s.cardBg,
        border: `1px solid ${s.border}`,
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.25s, transform 0.25s',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 12px 32px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Decorative blob */}
      <div style={{
        position: 'absolute', top: '-20px', right: '-20px',
        width: '120px', height: '120px', borderRadius: '50%',
        background: s.blobColor, filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      <div>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <p style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </p>

          {Icon && (
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: s.iconBg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              flexShrink: 0,
            }}>
              <Icon size={24} color="#ffffff" strokeWidth={2} />
            </div>
          )}
        </div>

        {/* Value */}
        <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em', marginBottom: '1rem', lineHeight: 1 }}>
          {value}
        </div>
      </div>

      {/* Growth badge */}
      <div>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          padding: '3px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
          background: isPositive ? '#dcfce7' : '#f1f5f9',
          color:      isPositive ? '#15803d' : '#64748b',
        }}>
          {isPositive
            ? <TrendingUp size={12} color="#16a34a" />
            : <Minus      size={12} color="#94a3b8" />}
          {growth}
        </span>
      </div>
    </div>
  );
};

export default AdminStatCard;
