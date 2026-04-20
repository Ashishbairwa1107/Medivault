import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useGoogleLogin } from '@react-oauth/google';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const GoogleLogo = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
        <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957273V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
        <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957273C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
        <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01636 0.957273 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
    </svg>
);

const Auth = () => {
    const [tab, setTab] = useState('login');
    const [email, setEmail] = useState('patient@demo.com');
const [password, setPassword] = useState('password123');
    const [role, setRole] = useState('patient');
    const [isLoading, setIsLoading] = useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [name, setName] = useState('');
    const { login, register, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log('Google login success:', tokenResponse);
            const success = await googleLogin(tokenResponse.access_token, role);
            if (success) {
                navigate(`/${role === 'patient' ? 'patient' : role}`);
            }
        },
        onError: (error) => console.log('Google login failed:', error)
    });

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsRegisterLoading(true);
        try {
            // Log payload from frontend as requested
            console.log("Frontend Register Payload:", { fullName: name, email, password, role });
            
            const success = await register(name, email, password, role);
            if (success) {
                toast.success('Registration successful! Please login.');
                setTab('login');
                setPassword(''); // Clear password for security
            } else {
                toast.error('Registration failed. Email may already be in use.');
            }
        } catch (error) {
            toast.error('Server error during registration.');
        } finally {
            setIsRegisterLoading(false);
        }
    };

    const [error, setError] = useState('');
    
    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        
        const payload = { email, password, role };
        console.log("🔐 Sending Login Payload:", payload);
        
        const result = await login(email, password, role);
        
        if (result.success) {
            navigate(`/${role === 'patient' ? 'patient' : role.toLowerCase()}`);
        } else {
            setError(result.message);
        }
        
        setIsLoading(false);
    };

    return (
        <div id="auth" className="min-h-screen flex items-center justify-center p-6 bg-slate-50 w-full relative">
            <Toaster position="top-right" />
            
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover="hover"
                transition={{ duration: 0.5 }}
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-white/50 hover:shadow-sm transition-all border border-transparent hover:border-slate-200"
            >
                <motion.div
                    variants={{
                        hover: { x: -2 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="flex items-center justify-center"
                >
                    <ArrowLeft size={18} />
                </motion.div>
                <span>Back to Home</span>
            </motion.button>

            <div className="auth-container fade-in" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '460px', boxShadow: 'var(--shadow-lg)' }}>
                <div className="flex items-center gap-2 mb-4">
                    <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>⚕️</div>
                    <div className="auth-logo" style={{ fontFamily: 'Fraunces', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>Medi<span style={{ color: 'var(--teal)' }}>Vault</span></div>
                </div>
                <p className="text-sm text-text2 mb-4">Digital Healthcare Platform — Secure, Trusted, Connected</p>

    <div style={{ 
                        position: 'relative', 
                        display: 'flex', 
                        backgroundColor: '#f3f4f6', 
                        borderRadius: '12px', 
                        padding: '3px', 
                        marginBottom: '28px', 
                        height: '42px',
                        fontSize: '0.9rem'
                      }} className="toggle-container">
                    <button 
                      onClick={() => setTab('login')}
                      style={{ 
                        position: 'relative', 
                        flex: 1, 
                        padding: '10px 4px', 
                        borderRadius: '8px', 
                        background: 'transparent', 
                        border: 'none', 
                        textAlign: 'center',
                        fontSize: '0.9rem', 
                        fontWeight: 600, 
                        color: tab === 'login' ? '#1e40af' : '#6b7280',
                        zIndex: 10,
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => setTab('register')}
                      style={{ 
                        position: 'relative', 
                        flex: 1, 
                        padding: '10px 4px', 
                        borderRadius: '8px', 
                        background: 'transparent', 
                        border: 'none', 
                        textAlign: 'center',
                        fontSize: '0.9rem', 
                        fontWeight: 600, 
                        color: tab === 'register' ? '#1e40af' : '#6b7280',
                        zIndex: 10,
                        cursor: 'pointer',
                        transition: 'color 0.2s'
                      }}
                    >
                      Register
                    </button>
                    <div 
                      style={{
                        position: 'absolute',
                        inset: '3px',
                        left: tab === 'login' ? '3px' : '50%',
                        width: '50%',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        zIndex: 5
                      }}
                    />
                </div>

                {tab === 'login' ? (
                    <form onSubmit={handleLogin}>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Email Address</label>
                            <input 
                                type="email" 
                                className="form-input" 
                                value={email} 
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError('');
                                }} 
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Password</label>
                            <input 
                                type="password" 
                                className="form-input" 
                                value={password} 
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setError('');
                                }} 
                                required 
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Login As</label>
                            <select className="form-select" value={role} onChange={(e) => {
                                setRole(e.target.value);
                                setError('');
                            }}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="hospital">Hospital Admin</option>
                                <option value="admin">System Admin</option>
                            </select>
                        </div>
                        {error && (
                            <div className="error-message mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                                {error}
                            </div>
                        )}
                        <button 
                          type="submit" 
                          disabled={isLoading}
                          className="auth-submit flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: 'var(--primary)', color: '#fff', marginTop: '8px' }}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Signing In...
                            </>
                          ) : (
                            'Sign In →'
                          )}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleRegister}>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Full Name</label>
                            <input type="text" className="form-input" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Email Address</label>
                            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Password</label>
                            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div className="form-group" style={{ marginBottom: 18 }}>
                            <label className="form-label">Register As</label>
                            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
                                <option value="patient">Patient</option>
                                <option value="doctor">Doctor</option>
                                <option value="hospital">Hospital Admin</option>
                            </select>
                        </div>
                        <button 
                          type="submit" 
                          disabled={isRegisterLoading}
                          className="auth-submit flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          style={{ width: '100%', padding: '13px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 700, background: 'var(--teal)', color: '#fff', marginTop: '8px' }}
                        >
                          {isRegisterLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Creating Account...
                            </>
                          ) : (
                            'Create Account →'
                          )}
                        </button>
                    </form>
                )}

<div className="auth-divider" style={{ textAlign: 'center', color: 'var(--text3)', fontSize: '0.85rem', margin: '24px 0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    or continue with
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>
                <button 
                    onClick={() => handleGoogleLogin()} 
                    className="flex items-center justify-center gap-3 w-full" 
                    style={{ 
                        padding: '12px', 
                        borderRadius: '8px', 
                        border: '1px solid #D1D5DB', 
                        background: '#FFFFFF', 
                        color: '#374151', 
                        fontSize: '0.95rem', 
                        fontWeight: 600,
                        transition: 'background-color 0.2s',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#F9FAFB'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                >
                    <GoogleLogo />
                    Continue with Google
                </button>
            </div>
        </div>
    );
};

export default Auth;
