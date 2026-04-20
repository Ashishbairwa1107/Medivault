import React from 'react';
import { useDashboard } from '../../store/DashboardContext';
import Skeleton from '../../components/ui/Skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TimelineItem = ({ date, title, doctor, hospital, status, isLast, isLoading }) => (
  <div style={{ display: 'flex', gap: '20px', position: 'relative' }}>
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      minWidth: '60px'
    }}>
      {isLoading ? (
        <Skeleton width="40px" height="40px" borderRadius="50%" marginBottom="0" />
      ) : (
        <div style={{ 
          width: '40px', 
          height: '40px', 
          borderRadius: '50%', 
          background: 'var(--primary)', 
          color: 'white', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: '0.75rem',
          fontWeight: 700,
          zIndex: 1
        }}>
          {new Date(date).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}
        </div>
      )}
      {!isLast && (
        <div style={{ 
          width: '2px', 
          flexGrow: 1, 
          background: 'var(--border)', 
          margin: '4px 0' 
        }}></div>
      )}
    </div>
    <div style={{ paddingBottom: '32px', flex: 1 }}>
      <div style={{ 
        background: 'white', 
        padding: '16px', 
        borderRadius: '12px', 
        border: '1px solid var(--border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        {isLoading ? (
          <>
            <Skeleton width="150px" height="18px" />
            <Skeleton width="220px" height="14px" />
            <Skeleton width="80px" height="20px" borderRadius="4px" marginBottom="0" />
          </>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--primary)', margin: 0 }}>{title}</h4>
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--text3)',
                fontWeight: 500
              }}>{new Date(date).getFullYear()}</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text2)', margin: '4px 0' }}>{doctor} • {hospital}</p>
            <span style={{ 
              display: 'inline-block',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '0.7rem',
              fontWeight: 600,
              background: status === 'Completed' ? '#f0fdf4' : '#eff6ff',
              color: status === 'Completed' ? '#166534' : '#1e40af',
              marginTop: '8px'
            }}>{status}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const Timeline = () => {
    const { appointments, monthlyVisits, loading } = useDashboard();

    return (
        <div className="fade-in">
            <div className="section-header" style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'serif', color: 'var(--primary)' }}>Health Timeline</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>Analytics and chronological history of medical events</p>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '24px', 
              borderRadius: '16px', 
              border: '1px solid var(--border)',
              marginBottom: '32px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'serif', marginBottom: '20px', color: 'var(--primary)' }}>Monthly Visits Analytics</h4>
                <div style={{ width: '100%', height: 300 }}>
                    {loading ? (
                        <Skeleton height="100%" marginBottom="0" />
                    ) : (
                        <ResponsiveContainer>
                        <BarChart data={monthlyVisits}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis 
                              dataKey="month" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: '#64748b', fontSize: 12 }}
                            />
                            <Tooltip 
                              cursor={{ fill: '#f8fafc' }}
                              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Bar 
                              dataKey="visits" 
                              fill="var(--primary, #1e40af)" 
                              radius={[4, 4, 0, 0]} 
                              barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                    )}
                </div>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, fontFamily: 'serif', marginBottom: '24px', color: 'var(--primary)' }}>Chronological Events</h4>
                <div className="vertical-timeline">
                    {loading ? (
                        Array(3).fill(0).map((_, i) => (
                            <TimelineItem 
                                key={i}
                                isLoading={true}
                                isLast={i === 2}
                            />
                        ))
                    ) : (appointments || []).sort((a,b) => new Date(b.date) - new Date(a.date)).map((a, i) => (
                        <TimelineItem 
                            key={a._id}
                            date={a.date}
                            title={a.reason}
                            doctor={a.doctor}
                            hospital={a.hospital}
                            status={a.status}
                            isLast={i === (appointments.length - 1)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
