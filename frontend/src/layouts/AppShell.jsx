import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/AuthContext';
import { useDashboard } from '../store/DashboardContext';
import { useNavigate, NavLink, useLocation, Link } from 'react-router-dom';
import { BarChart3, Building2, Users, FileText, Bell, AlertCircle, AlertTriangle, Info, CheckCircle, Users2, FileUp, ShieldCheck, Home, Activity, Settings, LogOut, Database } from 'lucide-react';
import Chatbot from '../components/Chatbot';
import SignOutButton from '../components/ui/SignOutButton';

import { useTheme } from '../store/ThemeContext';

const AppShell = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [profileOpen, setProfileOpen] = useState(false);
    const [showAlerts, setShowAlerts] = useState(false);
    const profileRef = useRef(null);
    const { user, logout, loading: authLoading } = useAuth();
    const { adminActiveView, setAdminActiveView } = useDashboard();
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Mapping path to title
    const getTitle = () => {
        const path = location.pathname;
        if (path.includes('/admin')) {
          switch (adminActiveView) {
            case 'analytics': return 'Analytics Dashboard';
            case 'hospitals': return 'Hospital Management';
            case 'users': return 'User Management';
            case 'audit': return 'Audit Logs';
            default: return 'System Admin';
          }
        }
        if (path.includes('/doctor/overview'))      return 'Doctor Overview';
        if (path.includes('/doctor/patients'))      return 'My Patients';
        if (path.includes('/doctor/prescriptions')) return 'Prescriptions';
        if (path.includes('/doctor/appointments'))  return 'Appointments';
        if (path.includes('/doctor/add-diagnosis')) return 'Add Diagnosis';
        if (path.includes('/doctor/consent-access')) return 'Patient Consent Access';
        if (path.includes('/doctor/audit'))         return 'Access Audit Log';
        if (path.includes('/hospital/overview') || path === '/hospital') return 'Hospital Dashboard';
        if (path.includes('/hospital/doctors'))     return 'Doctors Management';
        if (path.includes('/hospital/patients'))    return 'Patient Registry';
        if (path.includes('/hospital/upload'))      return 'Upload Reports';
        if (path.includes('/hospital/consents'))    return 'Consent Management';
        if (path.includes('dashboard'))             return 'Dashboard';
        if (path.includes('records'))               return 'Medical Records';
        if (path.includes('prescriptions'))         return 'Prescriptions';
        if (path.includes('timeline'))              return 'Health Timeline';
        if (path.includes('appointments'))          return 'Appointments';
        if (path.includes('consent'))               return 'Privacy & Consent';
        if (path.includes('profile'))               return 'My Profile';
        return 'MediVault';
    };


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const activeTitle = getTitle();

    if (authLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'var(--surface, #ffffff)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                        width: 48, 
                        height: 48, 
                        border: '4px solid #f3f3f3', 
                        borderTop: '4px solid var(--primary, #3b82f6)', 
                        borderRadius: '50%', 
                        animation: 'spin 1s linear infinite', 
                        margin: '0 auto 20px' 
                    }} />
                    <p style={{ color: 'var(--text2, #6b7280)' }}>Loading shell...</p>
                </div>
            </div>
        );
    }

    const renderNavItems = () => {
        if (user?.role === 'patient') {
            return (
                <>
                    <div className="nav-section-label">Overview</div>
                    <NavLink to="/patient/dashboard" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🏠</span><span className="nav-label">Dashboard</span>
                    </NavLink>
                    <div className="nav-section-label">My Health</div>
                    <NavLink to="/patient/records" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📋</span><span className="nav-label">Records</span><span className="nav-badge">3</span>
                    </NavLink>
                    <NavLink to="/patient/prescriptions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">💊</span><span className="nav-label">Prescriptions</span>
                    </NavLink>
                    <NavLink to="/patient/timeline" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📅</span><span className="nav-label">Timeline</span>
                    </NavLink>
                    <NavLink to="/patient/appointments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📋</span><span className="nav-label">Appointments</span>
                    </NavLink>
                    <div className="nav-section-label">Privacy</div>
                    <NavLink to="/patient/consent" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🔐</span><span className="nav-label">Consent</span>
                    </NavLink>
                    <NavLink to="/patient/profile" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">👤</span><span className="nav-label">Profile</span>
                    </NavLink>
                </>
            );
        }
        if (user?.role === 'doctor') {
            return (
                <>
                    <div className="nav-section-label">Overview</div>
                    <NavLink to="/doctor/overview" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🏠</span><span className="nav-label">Overview</span>
                    </NavLink>
                    <div className="nav-section-label">Practice</div>
                    <NavLink to="/doctor/patients" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">👥</span><span className="nav-label">Patients</span><span className="nav-badge">48</span>
                    </NavLink>
                    <NavLink to="/doctor/prescriptions" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">💊</span><span className="nav-label">Prescriptions</span>
                    </NavLink>
                    <NavLink to="/doctor/appointments" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">📅</span><span className="nav-label">Appointments</span><span className="nav-badge">3</span>
                    </NavLink>
                    <div className="nav-section-label">Diagnostics</div>
                    <NavLink to="/doctor/add-diagnosis" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">➕</span><span className="nav-label">Add Diagnosis</span>
                    </NavLink>
                    <NavLink to="/doctor/audit" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🔏</span><span className="nav-label">Audit Log</span>
                    </NavLink>
                    <div className="nav-section-label">Permissions</div>
                    <NavLink to="/doctor/consent-access" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <span className="nav-icon">🔐</span><span className="nav-label">Consent Access</span>
                    </NavLink>
                </>
            );
        }
        // Hospital Admin role navigation
        if (user?.role === 'admin') {
          return (
            <>
              <div className="nav-section-label">Overview</div>
              <NavLink 
                to="/admin" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'overview' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('overview')}
              >
                <Home className="w-4 h-4" />
                <span className="nav-label">Dashboard</span>
              </NavLink>
              <div className="nav-section-label">Management</div>
              <NavLink 
                to="/admin/doctors" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'doctors' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('doctors')}
              >
                <Users className="w-4 h-4" />
                <span className="nav-label">Doctors</span>
              </NavLink>
              <NavLink 
                to="/admin/patients" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'patients' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('patients')}
              >
                <Users2 className="w-4 h-4" />
                <span className="nav-label">Patients</span>
              </NavLink>
              <NavLink 
                to="/admin/staff" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'staff' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('staff')}
              >
                <Building2 className="w-4 h-4" />
                <span className="nav-label">Staff</span>
              </NavLink>
              <div className="nav-section-label">Records</div>
              <NavLink 
                to="/admin/upload" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'upload' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('upload')}
              >
                <Database className="w-4 h-4" />
                <span className="nav-label">Total Medical Records</span>
              </NavLink>
              <NavLink 
                to="/admin/consents" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'consents' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('consents')}
              >
                <ShieldCheck className="w-4 h-4" />
                <span className="nav-label">Consent Requests</span>
              </NavLink>
              <NavLink 
                to="/admin/history" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'history' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('history')}
              >
                <FileText className="w-4 h-4" />
                <span className="nav-label">Medical History</span>
              </NavLink>
              <div className="nav-section-label">Analytics</div>
              <NavLink 
                to="/admin/reports" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'reports' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('reports')}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="nav-label">Reports</span>
              </NavLink>
              <NavLink 
                to="/admin/performance" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'performance' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('performance')}
              >
                <Activity className="w-4 h-4" />
                <span className="nav-label">Performance</span>
              </NavLink>
              <div className="nav-section-label">Compliance</div>
              <NavLink 
                to="/admin/audit" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'audit' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('audit')}
              >
                <FileText className="w-4 h-4" />
                <span className="nav-label">Audit Log</span>
              </NavLink>
              <NavLink 
                to="/admin/settings" 
                className={({isActive}) => `nav-item ${isActive || adminActiveView === 'settings' ? 'active' : ''}`}
                onClick={() => setAdminActiveView('settings')}
              >
                <Settings className="w-4 h-4" />
                <span className="nav-label">Settings</span>
              </NavLink>
              <div className="nav-section-label">Account</div>
              <div className="nav-item" onClick={handleLogout} style={{cursor: 'pointer'}}>
                <LogOut className="w-4 h-4" />
                <span className="nav-label">Force Logout</span>
              </div>
            </>
          );
        }
        // Hospital role navigation
        if (user?.role === 'hospital') {
            return (
                <>
                    <div className="nav-section-label">Dashboard</div>
                    <NavLink to="/hospital/overview" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Home className="w-4 h-4" />
                        <span className="nav-label">Overview</span>
                    </NavLink>
                    <NavLink to="/hospital/doctors" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users2 className="w-4 h-4" />
                        <span className="nav-label">Doctors</span>
                    </NavLink>
                    <NavLink to="/hospital/patients" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Users className="w-4 h-4" />
                        <span className="nav-label">Patients</span>
                    </NavLink>
                    <NavLink to="/hospital/upload" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Database className="w-4 h-4" />
                        <span className="nav-label">Total Medical Records</span>
                    </NavLink>
                    <div className="nav-section-label">Privacy</div>
                    <NavLink to="/hospital/consents" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                        <ShieldCheck className="w-4 h-4" />
                        <span className="nav-label">Consents</span>
                    </NavLink>
                </>
            );
        }
        // Default
        return (
            <>
                <div className="nav-section-label">Overview</div>
                <NavLink to="/overview" className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}>
                    <span className="nav-icon">🏠</span><span className="nav-label">Overview</span>
                </NavLink>
            </>
        );
    };

    return (
        <div className="app-shell">
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-logo">
                    <div className="logo-icon">⚕️</div>
                    <span className="logo-text">MediVault</span>
                </div>
                
                <nav className="sidebar-nav">
                    {renderNavItems()}
                </nav>

                <div className="sidebar-bottom">
                    <div className="sidebar-user" style={{ marginBottom: '12px' }}>
                        <div className="user-avatar" style={{ background: 'var(--primary)' }}>
                            {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                        </div>
                        <div className="user-info">
                            <div className="user-name">{user?.name || 'User'}</div>
                            <div className="user-role">{user?.role || 'User'}</div>
                        </div>
                    </div>
                    <SignOutButton />
                </div>
            </aside>

            <div className="main-content">
                <div className="topbar">
                    <div className="topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button className="collapse-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
                        <SignOutButton variant="topbar" label="" className="text-slate-400 hover:text-red-500 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 shadow-sm" />
                        <span className="topbar-title" style={{ marginLeft: '4px' }}>{activeTitle}</span>
                    </div>
                    <div className="topbar-right">
                        <div className="search-box">
                            <span>🔍</span><input type="text" placeholder="Search..." />
                        </div>
                        <button className="theme-toggle" onClick={toggleDarkMode}>
                            {isDarkMode ? '☀️' : '🌙'}
                        </button>
                        <div className="relative">
                            <button 
                                className="icon-btn" 
                                onClick={() => setShowAlerts(!showAlerts)}
                                style={{ position: 'relative' }}
                            >
                                🔔<span className="notif-dot"></span>
                            </button>
                            {showAlerts && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    right: 0,
                                    width: 320,
                                    maxHeight: 400,
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 12,
                                    boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                                    zIndex: 1000,
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        padding: '16px 20px',
                                        borderBottom: '1px solid var(--border)',
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        color: '#1e40af'
                                    }}>
                                        System Alerts (5)
                                    </div>
                                    <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                                        {[
                                            { type: 'error', icon: AlertCircle, title: 'High System Load', time: '2 min ago', desc: 'Server CPU at 92%' },
                                            { type: 'warning', icon: AlertTriangle, title: 'Consent Expiry', time: '5 min ago', desc: '45 consents expire today' },
                                            { type: 'info', icon: Info, title: 'New Hospital Verified', time: '1 hr ago', desc: 'Fortis Hospital (#H-005) onboarded' },
                                            { type: 'success', icon: CheckCircle, title: 'Backup Complete', time: '3 hrs ago', desc: '48.2M records backed up successfully' },
                                            { type: 'error', icon: AlertCircle, title: 'API Rate Limit', time: '6 hrs ago', desc: 'External service throttled' }
                                        ].map((alert, i) => (
                                            <div key={i} style={{
                                                display: 'flex',
                                                gap: 12,
                                                padding: '16px 20px',
                                                borderBottom: i < 4 ? '1px solid var(--border)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'background 0.15s'
                                            }} onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
                                               onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                                <alert.icon size={20} style={{
                                                    color: alert.type === 'error' ? '#dc2626' : 
                                                           alert.type === 'warning' ? '#d97706' : 
                                                           alert.type === 'success' ? '#059669' : '#3b82f6',
                                                    flexShrink: 0,
                                                    marginTop: 2
                                                }} />
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 2 }}>
                                                        {alert.title}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--text3)', marginBottom: 2 }}>
                                                        {alert.desc}
                                                    </div>
                                                    <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                                                        {alert.time}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="relative" ref={profileRef}>
                            <div 
                              className="topbar-avatar" 
                              style={{ background: 'var(--primary)', cursor: 'pointer' }}
                              onClick={() => setProfileOpen(!profileOpen)}
                            >
                                {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                            </div>
                            {profileOpen && (
                                <div style={{
                                    position: 'absolute',
                                    right: 0,
                                    top: '100%',
                                    marginTop: '8px',
                                    width: '200px',
                                    background: 'var(--surface)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                    padding: '8px',
                                    zIndex: 1000
                                }}>
                                    <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '4px' }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{user?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>{user?.email}</div>
                                    </div>
                                    <Link 
                                      to="/patient/profile" 
                                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text2)', transition: 'background 0.2s' }}
                                      className="hover:bg-slate-50"
                                      onClick={() => setProfileOpen(false)}
                                    >
                                        👤 My Profile
                                    </Link>
                                    <div 
                                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: '8px', fontSize: '0.875rem', color: '#dc2626', cursor: 'pointer', transition: 'background 0.2s' }}
                                      className="hover:bg-red-50"
                                      onClick={handleLogout}
                                    >
                                        🚪 Sign Out
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="dash-content relative">
                    {children}
                </div>
            </div>
            
            <Chatbot />
        </div>
    );
};

export default AppShell;

