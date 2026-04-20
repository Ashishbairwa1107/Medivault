import React from 'react';
import { useContext } from 'react';
import { DoctorContext } from './DoctorDashboardPage';
import { Users, Calendar, Pill, Stethoscope, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const visitsData = [
    { day: 'Mon', visits: 8 },
    { day: 'Tue', visits: 12 },
    { day: 'Wed', visits: 10 },
    { day: 'Thu', visits: 15 },
    { day: 'Fri', visits: 9 },
    { day: 'Sat', visits: 6 },
    { day: 'Sun', visits: 4 },
];

const diagnosisData = [
    { name: 'Influenza', value: 45 },
    { name: 'Hypertension', value: 25 },
    { name: 'Diabetes', value: 20 },
    { name: 'Routine', value: 10 },
];

const COLORS = ['#1e40af', '#0d9488', '#f59e0b', '#6b7280'];

const recentPatients = [
    { id: 'MV-P003', name: 'Rajan Kapoor', condition: 'Critical', time: '10:30 AM' },
    { id: 'MV-P007', name: 'Meena Rao',   condition: 'Stable',   time: '11:00 AM' },
    { id: 'MV-P001', name: 'Priya Sharma', condition: 'Stable',   time: '11:45 AM' },
];

const StatCard = ({ icon: Icon, label, value, sub, bg, accent, border }) => (
    <div style={{
        background: bg || 'white',
        border: `1.5px solid ${border || '#e2e8f0'}`,
        borderRadius: 16,
        padding: '24px 28px',
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'box-shadow 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.10)'}
    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)'}
    >
        <div style={{ width: 52, height: 52, borderRadius: 14, background: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={24} color={border === '#fecaca' ? '#991b1b' : '#1e40af'} />
        </div>
        <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 800, color: bg === '#fef2f2' ? '#991b1b' : '#0f172a', margin: '2px 0 0', lineHeight: 1.1 }}>{value}</p>
            {sub && <p style={{ fontSize: '0.78rem', color: bg === '#fef2f2' ? '#ef4444' : '#16a34a', fontWeight: 600, margin: '4px 0 0' }}>{sub}</p>}
        </div>
    </div>
);

const conditionStyle = (c) => {
    const map = {
        Critical:   { background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca' },
        Stable:     { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
        Monitoring: { background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a' },
    };
    return map[c] || { background: '#f1f5f9', color: '#64748b', border: '1px solid #e2e8f0' };
};

const DoctorOverview = () => (
    <div className="fade-in">
        <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'serif', color: '#1e40af', margin: 0 }}>Doctor Overview</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748b', marginTop: 4 }}>Your clinical snapshot for today</p>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            <StatCard icon={Users}      label="Active Patients"    value="48"  sub="+5 new today"         accent="#dbeafe" border="#bfdbfe" />
            <StatCard icon={Calendar}   label="Today's Appointments" value="12" sub="3 remaining"        accent="#ccfbf1" border="#99f6e4" />
            <StatCard icon={Pill}       label="Prescriptions"      value="89"  sub="This month"           accent="#e0e7ff" border="#c7d2fe" />
            <StatCard icon={Stethoscope} label="Critical Cases"    value="3"   sub="Immediate attention"  accent="#fecaca" border="#fecaca" bg="#fef2f2" />
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'serif', color: '#1e40af', marginBottom: 20 }}>Patient Visits — Last 7 Days</h4>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={visitsData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                        <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0' }} />
                        <Bar dataKey="visits" fill="#1e40af" radius={[4, 4, 0, 0]} barSize={32} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'serif', color: '#1e40af', marginBottom: 20 }}>Diagnoses Breakdown</h4>
                <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                        <Pie data={diagnosisData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                            {diagnosisData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend iconType="circle" iconSize={10} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Activity */}
        <div style={{ background: 'white', borderRadius: 16, border: '1px solid #e2e8f0', padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'serif', color: '#1e40af', marginBottom: 20 }}>Recent Patient Interactions</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recentPatients.map((p, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderRadius: 12, background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #0d9488)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.875rem' }}>
                                {p.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#0f172a' }}>{p.name}</div>
                                <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{p.id}</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}>
                                <Clock size={13} /> {p.time}
                            </span>
                            <span style={{ ...conditionStyle(p.condition), padding: '3px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700 }}>
                                {p.condition}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

export default DoctorOverview;
