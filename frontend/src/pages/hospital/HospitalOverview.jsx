import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/hospital/StatCard';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';

const admissionsData = [
    { week: 'Apr 1',  admissions: 42, discharges: 38 },
    { week: 'Apr 7',  admissions: 58, discharges: 52 },
    { week: 'Apr 14', admissions: 51, discharges: 49 },
    { week: 'Apr 21', admissions: 68, discharges: 61 },
    { week: 'Apr 28', admissions: 55, discharges: 48 },
];

const deptData = [
    { name: 'General',    value: 30, color: '#1e40af' },
    { name: 'Cardiology', value: 22, color: '#dc2626' },
    { name: 'Orthopaedics', value: 18, color: '#d97706' },
    { name: 'Neurology',  value: 15, color: '#7c3aed' },
    { name: 'Paediatrics', value: 15, color: '#0d9488' },
];

const recentActivity = [
    { time: '09:14 AM', action: 'Report uploaded for Arjun Kumar (MV-P001)', type: 'upload' },
    { time: '09:32 AM', action: 'Dr. R. Sharma added diagnosis for Priya Verma', type: 'diagnosis' },
    { time: '10:05 AM', action: 'Consent granted by Rohit Singh to Dr. M. Patel', type: 'consent' },
    { time: '10:48 AM', action: 'Bed assigned — Ward 3-B (Meena Rao)', type: 'bed' },
    { time: '11:22 AM', action: 'Lab report reviewed — ICU Patient #P-009', type: 'lab' },
];

const activityIcon = (type) => ({
    upload: '📤', diagnosis: '🩺', consent: '🔐', bed: '🛏️', lab: '🧪',
}[type] || '📋');

const activityColor = (type) => ({
    upload: '#dbeafe', diagnosis: '#d1fae5', consent: '#ede9fe', bed: '#fef3c7', lab: '#ccfbf1',
}[type] || '#f1f5f9');

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '10px 16px', fontSize: '0.82rem',
                boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
            }}>
                <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, margin: '2px 0' }}>
                        {p.name}: <strong>{p.value}</strong>
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const HospitalOverview = () => {
    const navigate = useNavigate();

    return (
        <div className="fade-in">
            {/* Page Header */}
            <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: 'var(--primary)', margin: 0 }}>
                    Apollo Hospital Dashboard 🏥
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 6 }}>
                    Hospital ID: #H-1024 · Reg: DL-MED-2019-4821 · Real-time overview
                </p>
            </div>

            {/* Stat Cards - Already in parent, skip or enhance */}

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 28 }}>
                {/* Admissions Chart */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: 28,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--primary)', marginBottom: 20 }}>
                        Patient Admissions — This Month
                    </h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart data={admissionsData}>
                            <defs>
                                <linearGradient id="admGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1e40af" stopOpacity={0.18} />
                                    <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="disGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'var(--text3)', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--text3)', fontSize: 12 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#1e40af" fill="url(#admGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#1e40af' }} />
                            <Area type="monotone" dataKey="discharges" name="Discharges" stroke="#0d9488" fill="url(#disGrad)" strokeWidth={2.5} dot={{ r: 4, fill: '#0d9488' }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Department Distribution */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 16,
                    padding: 28,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--primary)', marginBottom: 20 }}>
                        Department Distribution
                    </h4>
                    <ResponsiveContainer width="100%" height={260}>
                        <PieChart>
                            <Pie
                                data={deptData}
                                cx="50%"
                                cy="45%"
                                innerRadius={58}
                                outerRadius={85}
                                paddingAngle={3}
                                dataKey="value"
                            >
                                {deptData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Pie>
                            <Tooltip formatter={(val) => [`${val}%`, '']} />
                            <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: '0.75rem' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 28,
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--primary)', marginBottom: 20 }}>
                    Recent Activity
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {recentActivity.map((item, i) => (
                        <div key={i} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 16,
                            padding: '12px 18px',
                            borderRadius: 12,
                            background: 'var(--surface2)',
                            border: '1px solid var(--border)',
                            transition: 'box-shadow 0.2s'
                        }} onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'} onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                            <div style={{
                                width: 38,
                                height: 38,
                                borderRadius: 10,
                                background: activityColor(item.type),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.1rem',
                                flexShrink: 0,
                            }}>
                                {activityIcon(item.type)}
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text)' }}>{item.action}</div>
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'var(--text3)', whiteSpace: 'nowrap' }}>{item.time}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HospitalOverview;

