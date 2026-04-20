import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill, Calendar, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../store/AuthContext';
import { useDashboard } from '../../store/DashboardContext';
import RecordBadge from '../../components/ui/RecordBadge';
import ViewButton from '../../components/ui/ViewButton';
import Skeleton from '../../components/ui/Skeleton';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
    const { user } = useAuth();
    const { records, prescriptions, consents, setViewRecord, loading } = useDashboard();

    const stats = [
        { 
            label: 'Medical Records', 
            value: records?.length, 
            icon: <FileText size={22} className="text-white" />, 
            bgColor: 'bg-indigo-100', 
            iconBg: 'bg-indigo-600' 
        },
        { 
            label: 'Active Prescriptions', 
            value: prescriptions?.length, 
            icon: <Pill size={22} className="text-white" />, 
            bgColor: 'bg-pink-100', 
            iconBg: 'bg-pink-600' 
        },
        { 
            label: 'Upcoming Appointments', 
            value: 0, 
            icon: <Calendar size={22} className="text-white" />, 
            bgColor: 'bg-amber-100', 
            iconBg: 'bg-orange-600' 
        },
        { 
            label: 'Active Consents', 
            value: consents?.filter(c => c.accessGranted).length, 
            icon: <ShieldCheck size={22} className="text-white" />, 
            bgColor: 'bg-teal-100', 
            iconBg: 'bg-emerald-600' 
        }
    ];

    return (
        <div className="fade-in">
            <div className="dash-header" style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: '1.6rem', marginBottom: 4, fontFamily: 'serif' }}>Welcome back, {user?.name?.split(' ')[0] || 'User'} </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text2)' }}>Here is your health summary</p>
            </div>

            <div className="cards-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i} 
                        whileHover={{ scale: 1.02, translateY: -5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`stat-card relative overflow-hidden group border border-slate-200 rounded-2xl p-5 shadow-sm transition-all bg-white`}
                    >
                        <div className={`absolute inset-0 ${stat.bgColor} opacity-60`} />
                        
                        <div className="relative z-10">
                            <div className={`stat-card-icon ${stat.iconBg} w-11 h-11 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-black/10`}>
                                {stat.icon}
                            </div>
                            {loading ? (
                                <Skeleton width="60px" height="28px" marginBottom="8px" />
                            ) : (
                                <div className="stat-card-value font-serif text-3xl font-bold leading-none text-slate-900">
                                    {stat.value || 0}
                                </div>
                            )}
                            <div className="stat-card-label text-[0.8rem] font-bold text-slate-600 mt-2 uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 600, fontFamily: 'serif' }}>Recent Medical Records</h3>
                <Link to="/patient/records" className="btn btn-sm btn-outline" style={{ textDecoration: 'none' }}>View All</Link>
            </div>
            
            <div className="table-card" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                <div className="table-wrap">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead style={{ background: '#f8fafc' }}>
                            <tr>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Record ID</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Date</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Type</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Doctor</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Hospital</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>Diagnosis</th>
                                <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text2)', textTransform: 'uppercase' }}>View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} style={{ borderTop: '1px solid var(--border)' }}>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="70px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="90px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="50px" borderRadius="10px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="100px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="100px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="120px" marginBottom="0" /></td>
                                        <td style={{ padding: '12px 16px' }}><Skeleton width="30px" marginBottom="0" /></td>
                                    </tr>
                                ))
                            ) : (records?.slice(0, 5) || []).map(record => (
                                <tr key={record._id || Math.random()} style={{ borderTop: '1px solid var(--border)' }}>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{record.recordId || 'N/A'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{new Date(record.date || record.createdAt || Date.now()).toLocaleDateString()}</td>
                                    <td style={{ padding: '12px 16px' }}><RecordBadge type={record.type} /></td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{record.doctor || record.doctorId?.name || 'N/A'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{record.hospital || record.hospitalId?.name || 'N/A'}</td>
                                    <td style={{ padding: '12px 16px', fontSize: '0.875rem' }}>{record.diagnosis || 'N/A'}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                      <ViewButton onClick={() => setViewRecord(record)} />
                                    </td>
                                </tr>
                            )) || (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text2)' }}>
                                        No recent records found
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

export default DashboardHome;
