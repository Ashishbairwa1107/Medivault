import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../store/AuthContext';
import { useDashboard } from '../store/DashboardContext';
import AdminStatCard from '../components/ui/AdminStatCard';
import { 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Activity, Users, UserPlus, FileUp, ShieldCheck, FileText, 
  BarChart3, Settings, LogOut, Home, Stethoscope, Search, Plus, 
  UploadCloud, Calendar, Edit, Trash2, Eye, X, CheckCircle2, AlertTriangle,
  File as FileIcon, ClipboardCheck, FilePlus, Loader2,
  User, BadgeCheck, ChevronDown, Bell, ChevronLeft as ChevronLeftIcon, ArrowLeft
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import SignOutButton from '../components/ui/SignOutButton';
import api from '../services/axios';

const initialMockDoctors = [
  { id: 'DOC-001', name: 'Dr. Anoop Sharma', specialization: 'Cardiology', patients: 145, status: 'Active' },
  { id: 'DOC-002', name: 'Dr. Meera Patel', specialization: 'Neurology', patients: 98, status: 'Active' },
  { id: 'DOC-003', name: 'Dr. Ramesh Kumar', specialization: 'Orthopedics', patients: 210, status: 'On Leave' },
  { id: 'DOC-004', name: 'Dr. Priya Singh', specialization: 'Pediatrics', patients: 320, status: 'Active' },
  { id: 'DOC-005', name: 'Dr. Vikram Desai', specialization: 'Oncology', patients: 65, status: 'Active' },
  { id: 'DOC-006', name: 'Dr. Sneha Reddy', specialization: 'Dermatology', patients: 112, status: 'On Leave' },
];

const initialMockPatients = [
  { id: 'PT-1001', name: 'Arjun Das', bloodGroup: 'O+', ward: 'ICU-A', doctor: 'Dr. Anoop Sharma', status: 'ICU' },
  { id: 'PT-1002', name: 'Lakshmi Nair', bloodGroup: 'A+', ward: 'Nil', doctor: 'Dr. Meera Patel', status: 'OPD' },
  { id: 'PT-1003', name: 'Sanjay Gupta', bloodGroup: 'B+', ward: 'Gen-12', doctor: 'Dr. Ramesh Kumar', status: 'Admitted' },
  { id: 'PT-1004', name: 'Anjali Menon', bloodGroup: 'AB-', ward: 'ICU-B', doctor: 'Dr. Priya Singh', status: 'ICU' },
  { id: 'PT-1005', name: 'Ravi Kumar', bloodGroup: 'O-', ward: 'Gen-05', doctor: 'Dr. Vikram Desai', status: 'Admitted' },
];

// Reusable Shadcn-inspired Modal
const Modal = ({ isOpen, onClose, title, children, width = "max-w-md" }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${width} border border-slate-100 transform transition-all duration-300 scale-100`}>
        <div className="flex justify-between items-center p-6 border-b border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// AlertDialog for Sign Out
const AlertDialog = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 p-6 transform transition-all scale-100">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
            <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
          </div>
        </div>
        <div className="mt-8 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Profile Update Modal ───────────────────────────────────────────────────
const ProfileModal = ({ isOpen, onClose, user, onSave }) => {
  const [form, setForm] = React.useState({
    name:      user?.name      || 'Apollo Hospital',
    hospitalId:user?.hospitalId|| '#H-001',
    contact:   user?.contact   || '',
    email:     user?.email     || '',
  });
  const [saving, setSaving] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Persist to localStorage immediately
      const stored = JSON.parse(localStorage.getItem('medivault_user') || '{}');
      const updated = { ...stored, ...form };
      localStorage.setItem('medivault_user', JSON.stringify(updated));
      // Try backend update (non-blocking)
      try { await api.put('/users/update-profile', form); } catch (_) {}
      onSave(updated);
      toast.success('Profile updated successfully!');
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 500,
    color: '#1e293b', outline: 'none', background: '#fff',
    boxSizing: 'border-box',
  };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '480px', boxShadow: '0 24px 64px rgba(0,0,0,0.16)', overflow: 'hidden', margin: '0 16px' }}>
        {/* Modal header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#f8faff,#fff)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#2563eb,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>My Profile</h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Update your administrator details</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={labelStyle}>Hospital / Admin Name</label>
            <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Apollo Hospital" />
          </div>
          <div>
            <label style={labelStyle}>Email Address</label>
            <input style={inputStyle} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="admin@apollo.com" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Hospital ID</label>
              <input style={{ ...inputStyle, background: '#f8fafc', color: '#94a3b8' }} value={form.hospitalId} readOnly />
            </div>
            <div>
              <label style={labelStyle}>Contact</label>
              <input style={inputStyle} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
          </div>
          <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#2563eb,#6366f1)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={15} />}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Hospital Settings Modal ─────────────────────────────────────────────────
const HospitalSettingsModal = ({ isOpen, onClose }) => {
  const [form, setForm] = React.useState({
    address:    'Apollo Circle, Jubilee Hills, Hyderabad – 500033',
    regNumber:  'MH-REG-2024-001',
    departments:'Cardiology, Neurology, Orthopedics, Pediatrics, Oncology, Dermatology',
    beds:       '520',
    phone:      '+91 40 2360 7777',
  });
  const [saving, setSaving] = React.useState(false);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    toast.success('Hospital settings saved!');
    onClose();
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 500, color: '#1e293b', outline: 'none', background: '#fff', boxSizing: 'border-box' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ background: '#fff', borderRadius: '20px', width: '100%', maxWidth: '520px', boxShadow: '0 24px 64px rgba(0,0,0,0.16)', overflow: 'hidden', margin: '0 16px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg,#f0fdf4,#fff)', position: 'sticky', top: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg,#0d9488,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontWeight: 800, fontSize: '1rem', color: '#1e293b' }}>Hospital Settings</h3>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#94a3b8' }}>Manage hospital configuration</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: '#f1f5f9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <X size={16} color="#64748b" />
          </button>
        </div>
        <form onSubmit={handleSave} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Section: Identity */}
          <p style={{ margin: '0 0 4px', fontSize: '0.7rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🏥 Hospital Identity</p>
          <div>
            <label style={labelStyle}>Registration Number</label>
            <input style={{ ...inputStyle, background: '#f8fafc', color: '#64748b' }} value={form.regNumber} readOnly />
          </div>
          <div>
            <label style={labelStyle}>Hospital Address</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Total Beds</label>
              <input style={inputStyle} value={form.beds} onChange={e => setForm(f => ({ ...f, beds: e.target.value }))} placeholder="e.g. 520" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 ..." />
            </div>
          </div>
          {/* Section: Departments */}
          <p style={{ margin: '4px 0 4px', fontSize: '0.7rem', fontWeight: 800, color: '#0d9488', textTransform: 'uppercase', letterSpacing: '0.08em' }}>🏷 Department Management</p>
          <div>
            <label style={labelStyle}>Active Departments (comma-separated)</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '72px' }} value={form.departments} onChange={e => setForm(f => ({ ...f, departments: e.target.value }))} />
          </div>
          <div style={{ paddingTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#fff', fontWeight: 700, fontSize: '0.85rem', color: '#64748b', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={saving} style={{ padding: '10px 24px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#0d9488,#059669)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              {saving ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={15} />}
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-8 py-3 transition-all duration-200 border-l-4 ${
      isActive 
        ? 'bg-white/10 text-white border-teal-400 font-bold' 
        : 'text-white/80 border-transparent hover:bg-white/10 hover:text-white font-medium'
    }`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-white/80'}`} />
    <span className="text-md font-semibold tracking-wide">{label}</span>
  </button>
);

const HospitalDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [profileOpen,    setProfileOpen]    = useState(false);
  const [profileModalOpen,  setProfileModalOpen]  = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const profileRef = useRef(null);
  const contextData = useDashboard() || {};
  const { user, logout, updateUser } = useAuth();

  // Derive display info from auth user or fallback
  const [localUser, setLocalUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('medivault_user') || '{}'); } catch { return {}; }
  });
  const merged = { ...localUser, ...user };
  const hospitalName  = merged?.hospitalName || merged?.name || 'Apollo Hospital';
  const adminInitials = hospitalName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'AH';
  const hospitalId    = merged?.hospitalId   || '#H-001';
  const regNumber     = merged?.regNumber    || 'MH-REG-2024-001';

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    setProfileOpen(false);
    // Clear all session tokens
    localStorage.removeItem('medivault_user');
    localStorage.removeItem('token');
    sessionStorage.clear();
    logout();
    setTimeout(() => { window.location.href = '/login'; }, 200);
  };

  const handleProfileSave = (updated) => {
    setLocalUser(updated);
    if (updateUser) updateUser(updated);
  };
  const [doctors, setDoctors] = useState(initialMockDoctors);
  const [patients, setPatients] = useState(initialMockPatients);

  // States for Modals and Actions
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: 'Cardiology', contact: '', room: '' });

  // States for File Upload
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reportData, setReportData] = useState({
    patientId: '',
    reportType: 'Blood Test',
    reportDate: new Date().toISOString().split('T')[0],
    orderingDoctor: '',
    notes: ''
  });
  const [recentUploads, setRecentUploads] = useState([]); // New state for recent uploads

  const adminStats = contextData.adminStats || { 
    patients: {value: '1,284', growth: '+48 this week'}, 
    doctors: {value: '87', growth: '+3 new'}, 
    consents: {value: '512', growth: '23 pending'}, 
    reports: {value: '2,840', growth: '+124 this month'}
  };
  
  // Default fallback data for charts if context doesn't have it
  const patientTrends = contextData.patientTrends || [
    { month: 'Jan', admissions: 120 }, { month: 'Feb', admissions: 140 },
    { month: 'Mar', admissions: 135 }, { month: 'Apr', admissions: 180 },
    { month: 'May', admissions: 220 }, { month: 'Jun', admissions: 270 },
  ];
  const deptDist = contextData.deptDist || [
    { name: 'General', value: 30, color: '#1d4ed8' },
    { name: 'Cardiology', value: 22, color: '#dc2626' },
    { name: 'Orthopedics', value: 18, color: '#d97706' },
    { name: 'Neurology', value: 15, color: '#7c3aed' },
  ];

  // Handlers
  const handleSignOut = () => {
    console.log("Signing out user...");
    toast.success("Successfully logged out!");
    setIsSignOutOpen(false);
    setTimeout(() => { window.location.href = '/login'; }, 1000);
  };

  const handleAddDoctorSubmit = async (e) => {
    e.preventDefault();
    if(!newDoctor.name || !newDoctor.email || !newDoctor.contact) {
      toast.error("Please fill all required fields!");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await api.post('/auth/add-doctor', newDoctor);
      const doc = response.data.doctor;
      
      setDoctors([{
        id: doc.upid || doc._id,
        name: doc.name,
        specialization: newDoctor.specialization,
        patients: 0,
        status: 'Active'
      }, ...doctors]);
      
      toast.success(`Doctor added! Temp Pass: ${response.data.tempPassword}`, { duration: 6000 });
      setIsAddDoctorOpen(false);
      setNewDoctor({ name: '', email: '', specialization: 'Cardiology', contact: '', room: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add doctor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file type. Only PDF/JPG/PNG allowed.");
      return;
    }
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    setSelectedFile({ name: file.name, size: `${sizeMB} MB`, raw: file });
  };

  const handleDocumentSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first."); 
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile.raw);
    formData.append('patientId', reportData.patientId.trim() || 'test-upload');
    formData.append('reportType', reportData.reportType);
    formData.append('reportDate', reportData.reportDate);
    formData.append('orderingDoctor', reportData.orderingDoctor);
    formData.append('notes', reportData.notes || '');

    setIsUploading(true);
    setProgress(0);

    try {
      const response = await api.post('/records/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProgress(percentCompleted);
          }
        }
      });
      
      toast.success("Report Submitted Successfully! 🎉", { duration: 4000 });
      
      // Add to recent uploads (local optimistic update)
      const newReport = {
        _id: response.data.record?._id || Date.now(),
        fileName: selectedFile.name,
        reportType: reportData.reportType,
        reportDate: new Date().toLocaleDateString(),
        reportUrl: response.data.reportUrl
      };
      setRecentUploads(prev => [newReport, ...prev.slice(0,4)]); // Keep top 5
      
      // Reset form
      setSelectedFile(null);
      setReportData({
        patientId: '',
        reportType: 'Blood Test',
        reportDate: new Date().toISOString().split('T')[0],
        orderingDoctor: '',
        notes: ''
      });
      fileInputRef.current.value = '';
    } catch (error) {
      const errMsg = error.response?.data?.message || "Upload failed";
      toast.error(errMsg);
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  // Sub-Views rendered internally to access states
  const DoctorsView = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 animate-fade-in hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center gap-3">
          <Stethoscope className="w-8 h-8 text-blue-600" /> Doctors Directory
        </h2>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search doctors..." 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
            />
          </div>
          <button onClick={() => setIsAddDoctorOpen(true)} className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all outline-none">
            <Plus className="w-5 h-5" /> Add Doctor
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b-2 border-slate-200">
              <th className="p-4 font-bold">Doctor ID</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Specialization</th>
              <th className="p-4 font-bold">Patients</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{doctor.id}</td>
                <td className="p-4 font-bold text-blue-900">{doctor.name}</td>
                <td className="p-4 text-slate-600">{doctor.specialization}</td>
                <td className="p-4 text-slate-600 font-medium">{doctor.patients}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    doctor.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {doctor.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button onClick={() => console.log(`Viewing doctor: ${doctor.id}`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => console.log(`Editing doctor: ${doctor.id}`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => console.log(`Deleting doctor: ${doctor.id}`)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const PatientsView = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 animate-fade-in hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" /> Patient Records
        </h2>
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search patient ID, name..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm uppercase tracking-wider border-b-2 border-slate-200">
              <th className="p-4 font-bold">Patient ID</th>
              <th className="p-4 font-bold">Name</th>
              <th className="p-4 font-bold">Blood Group</th>
              <th className="p-4 font-bold">Ward</th>
              <th className="p-4 font-bold">Assigned Doctor</th>
              <th className="p-4 font-bold">Status</th>
              <th className="p-4 font-bold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient, idx) => (
              <tr key={idx} className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{patient.id}</td>
                <td className="p-4 font-bold text-blue-900">{patient.name}</td>
                <td className="p-4">
                  <span className="bg-rose-50 text-rose-600 px-2 py-1 rounded font-bold text-xs border border-rose-100">
                    {patient.bloodGroup}
                  </span>
                </td>
                <td className="p-4 text-slate-600">{patient.ward}</td>
                <td className="p-4 text-slate-600 font-medium">{patient.doctor}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    patient.status === 'OPD' ? 'bg-indigo-100 text-indigo-700' : 
                    patient.status === 'Admitted' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {patient.status}
                  </span>
                </td>
                <td className="p-4 flex gap-2 justify-center">
                  <button onClick={() => console.log(`Viewing patient: ${patient.id}`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => console.log(`Editing patient: ${patient.id}`)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                  <button onClick={() => console.log(`Deleting patient: ${patient.id}`)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const UploadReportsView = () => (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-8 max-w-5xl mx-auto animate-fade-in hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
      <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 mb-8 flex items-center gap-3">
        <FileUp className="w-8 h-8 text-blue-600" /> Upload Medical Reports
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Patient ID *</label>
            <input 
              type="text" 
              placeholder="e.g. PT-1001" 
              value={reportData.patientId}
              onChange={(e) => setReportData({ ...reportData, patientId: e.target.value })}
              className="w-full py-3 px-4 text-base border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 placeholder-slate-400" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Report Type *</label>
            <select 
              value={reportData.reportType}
              onChange={(e) => setReportData({ ...reportData, reportType: e.target.value })}
              className="w-full py-3 px-4 text-base border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800"
            >
              <option>Blood Test</option>
              <option>CT Scan</option>
              <option>MRI</option>
              <option>X-Ray</option>
              <option>Discharge Summary</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Report Date</label>
              <div className="relative">
                <Calendar className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="date" 
                  value={reportData.reportDate}
                  onChange={(e) => setReportData({ ...reportData, reportDate: e.target.value })}
                  className="w-full pl-10 pr-3 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Ordering Doctor</label>
              <input 
                type="text" 
                placeholder="Dr. Name" 
                value={reportData.orderingDoctor}
                onChange={(e) => setReportData({ ...reportData, orderingDoctor: e.target.value })}
                className="w-full py-3 px-4 text-base border border-slate-200 bg-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium text-slate-800 placeholder-slate-400" 
              />
            </div>
          </div>
        </div>
        
        {/* Drag & Drop Area */}
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">File Upload *</label>
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 border-2 border-dashed border-blue-200 bg-blue-50/30 rounded-2xl hover:bg-blue-50/80 transition-all flex flex-col items-center justify-center p-10 cursor-pointer group mb-6 relative overflow-hidden"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.png" />
            
            {selectedFile ? (
              <div className="text-center z-10 flex flex-col items-center animate-fade-in">
                <FileIcon className="w-12 h-12 text-blue-600 mb-3" />
                <p className="font-bold text-blue-900 border-b border-blue-200 pb-1 mb-2">{selectedFile.name}</p>
                <p className="text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded-full shadow-sm">{selectedFile.size}</p>
              </div>
            ) : (
              <div className="text-center z-10 flex flex-col items-center">
                <div className="w-20 h-20 bg-white shadow-sm rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:shadow-md transition-all">
                  <UploadCloud className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-blue-900 mb-2 tracking-tight">Drag & Drop Documents</h3>
                <p className="text-slate-500 text-center mb-6 font-medium">or click to browse your local files</p>
                <button className="bg-white border border-slate-200 text-slate-700 font-bold px-6 py-2 rounded-xl shadow-sm hover:shadow-md transition-all pointer-events-none">Browse Files</button>
                <p className="text-xs text-slate-400 mt-6 font-medium absolute bottom-4">Supports: PDF, JPG, PNG (Max size: 10MB)</p>
              </div>
            )}
            
            {/* Upload Progress Overlay */}
            {isUploading && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                 <p className="text-sm font-bold text-blue-800 mb-4 animate-pulse">Uploading securely...</p>
                 <div className="w-3/4 max-w-xs bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
                 </div>
                 <p className="text-xs font-bold text-slate-500 mt-2">{progress}%</p>
              </div>
            )}
          </div>
          
          <button 
            disabled={isUploading || !selectedFile}
            onClick={handleDocumentSubmit}
            className={`w-full flex items-center justify-center gap-2 text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${
              isUploading || !selectedFile
                ? 'bg-slate-400 cursor-not-allowed opacity-80' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]'
            }`}>
            {isUploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Uploading Securely... {progress}%</span>
              </>
            ) : !selectedFile ? (
              <>
                <ShieldCheck size={20} />
                <span>Select file first</span>
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                <span>Submit Report Securely</span>
              </>
            )}
          </button>
        </div>

        {/* Recent Uploads Section */}
        <div className="col-span-full mt-12">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50 p-6">
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 mb-6 flex items-center gap-3">
              Recent Uploads
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">Live</span>
            </h3>
            {recentUploads.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-semibold mb-2">No uploads yet</p>
                <p className="text-sm">Upload your first report above to see it here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b-2 border-slate-200">
                      <th className="p-4 font-bold">File Name</th>
                      <th className="p-4 font-bold">Type</th>
                      <th className="p-4 font-bold">Date</th>
                      <th className="p-4 font-bold text-center w-24">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUploads.slice(0,5).map((report, idx) => (
                      <tr key={report._id || idx} className="border-b border-slate-100 hover:bg-blue-50/50 transition-colors">
                        <td className="p-4 font-medium text-slate-800 max-w-md truncate">{report.fileName}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                            {report.reportType}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{report.reportDate}</td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => window.open(report.reportUrl, '_blank')}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
                            title="View Report"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Doctors': return <DoctorsView />;
      case 'Patients': return <PatientsView />;
      case 'Upload Reports': return <UploadReportsView />;
      case 'Dashboard':
      default:
        return (
          <div className="animate-fade-in">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <AdminStatCard title="Total Patients"      value={adminStats.patients.value}  growth={adminStats.patients.growth}  icon={Users}        variant="blue"   />
              <AdminStatCard title="Registered Doctors"  value={adminStats.doctors.value}   growth={adminStats.doctors.growth}   icon={Stethoscope}  variant="teal"   />
              <AdminStatCard title="Active Consents"     value={adminStats.consents.value}  growth={adminStats.consents.growth}  icon={ShieldCheck}  variant="indigo" />
              <AdminStatCard title="Reports Uploaded"    value={adminStats.reports.value}   growth={adminStats.reports.growth}   icon={FilePlus}     variant="purple" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-[60%_40%] gap-8 mb-12">
              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-white/50 p-8">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 mb-8 flex items-center gap-3">
                  Patient Admission Trends
                  <span className="text-xs text-green-600 font-bold bg-green-50/80 px-3 py-1 rounded-full border border-green-200 flex items-center gap-1.5 shadow-sm uppercase tracking-wider animate-pulse">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live
                  </span>
                </h3>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={patientTrends}>
                    <defs>
                      <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12, fontWeight: 500}} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.1)', color: '#0f172a', fontWeight: 'bold' }} />
                    <Area type="monotone" dataKey="admissions" stroke="#3b82f6" strokeWidth={4} fill="url(#trendGradient)" activeDot={{ r: 8, strokeWidth: 0, fill: '#3b82f6', style: { filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' } }} dot={{ r: 0 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-white/50 p-8">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-indigo-800 mb-8">Department Distribution</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={deptDist} cx="50%" cy="50%" outerRadius={110} innerRadius={60} dataKey="value" nameKey="name" cornerRadius={8} paddingAngle={2}>
                      {deptDist.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color || '#1e3a8a'} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.1)', color: '#0f172a', fontWeight: 'bold' }} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontWeight: 600, color: '#475569' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Toaster position="top-right" />
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }

        @keyframes fadeDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
      
      {/* Modals */}
      <Modal isOpen={isAddDoctorOpen} onClose={() => setIsAddDoctorOpen(false)} title="Add New Doctor">
        <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
            <input type="text" placeholder="e.g. John Doe" value={newDoctor.name} onChange={e => setNewDoctor({...newDoctor, name: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
            <input type="email" placeholder="doctor@example.com" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Specialization</label>
            <select value={newDoctor.specialization} onChange={e => setNewDoctor({...newDoctor, specialization: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium">
              <option>Cardiology</option>
              <option>Neurology</option>
              <option>General</option>
              <option>Orthopedics</option>
              <option>Pediatrics</option>
              <option>Oncology</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contact Number</label>
            <input type="tel" placeholder="+91 9876543210" value={newDoctor.contact} onChange={e => setNewDoctor({...newDoctor, contact: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Hospital Cabin/Room No.</label>
            <input type="text" placeholder="e.g. A-42" value={newDoctor.room} onChange={e => setNewDoctor({...newDoctor, room: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => setIsAddDoctorOpen(false)} className="px-5 py-2.5 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
             <button type="submit" className="px-5 py-2.5 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm">Save Doctor</button>
          </div>
        </form>
      </Modal>

      {/* Profile & Settings Modals */}
      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={merged}
        onSave={handleProfileSave}
      />
      <HospitalSettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      />

      <AlertDialog 
        isOpen={isSignOutOpen} 
        onClose={() => setIsSignOutOpen(false)} 
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out? You will need to re-authenticate to access the dashboard."
      />

      {/* Sidebar */}
      <div className="w-64 bg-[#0a2540] border-none flex flex-col shadow-sm fixed h-full z-10 transition-all">
        {/* Back Button */}
        <button 
          onClick={() => window.location.href = '/login'}
          className="w-full flex items-center gap-4 px-8 py-3 text-white/80 hover:bg-white/10 hover:text-white border-l-4 border-transparent font-medium transition-all duration-200"
        >
          <ChevronLeftIcon className="w-6 h-6" />
          <span className="text-md font-semibold tracking-wide">Back</span>
        </button>
        
        {/* Logo */}
        <div className="p-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-white" />
            <h1 className="text-2xl font-black text-white tracking-tight">Apollo</h1>
          </div>
          <p className="text-xs font-bold text-white/50 uppercase tracking-widest pl-11">Hospital Admin</p>
        </div>
        
        {/* Nav */}
        <div className="flex-1 py-6 overflow-y-auto">
          <SidebarItem icon={Home} label="Dashboard" isActive={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={Stethoscope} label="Doctors" isActive={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
          <SidebarItem icon={Users} label="Patients" isActive={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
          <SidebarItem icon={FileUp} label="Upload Reports" isActive={activeTab === 'Upload Reports'} onClick={() => setActiveTab('Upload Reports')} />
        </div>

        {/* Sidebar Identity Card */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '14px', padding: '14px', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Avatar + name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '0.85rem', color: '#fff', letterSpacing: '0.02em',
              }}>
                {adminInitials}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#fff', fontWeight: 700, fontSize: '0.82rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '110px' }}>
                    Admin · Apollo
                  </span>
                  <BadgeCheck size={14} color="#34d399" style={{ flexShrink: 0 }} />
                </div>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 600 }}>
                  Hospital Administrator
                </span>
              </div>
            </div>
            {/* ID badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>ID</span>
              <span style={{ fontSize: '0.7rem', color: '#60a5fa', fontWeight: 700, background: 'rgba(96,165,250,0.12)', padding: '2px 8px', borderRadius: '6px' }}>
                {hospitalId}
              </span>
            </div>
          </div>
          {/* Logout shortcut */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px', padding: '8px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
              borderRadius: '10px', color: '#fca5a5', fontWeight: 700, fontSize: '0.78rem',
              cursor: 'pointer', transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Topbar */}
        <header style={{
          background: '#fff', borderBottom: '1px solid #e9ecef', height: '72px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', position: 'sticky', top: 0, zIndex: 5,
        }}>
          {/* Left: Page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '4px', height: '28px', borderRadius: '3px', background: 'linear-gradient(180deg,#2563eb,#6366f1)' }} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
              {activeTab === 'Upload Reports' ? 'Report Management' : activeTab}
            </h2>
          </div>

          {/* Right: Bell + profile only — no duplicate text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

            {/* Bell */}
            <button style={{
              width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e2e8f0',
              background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', position: 'relative',
            }}>
              <Bell size={18} color="#64748b" />
              <span style={{
                position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px',
                background: '#ef4444', borderRadius: '50%', border: '1.5px solid #fff',
              }} />
            </button>

            {/* Profile Dropdown Trigger */}
            <div ref={profileRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setProfileOpen(o => !o)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '6px 12px 6px 6px', borderRadius: '12px',
                  border: '1px solid #e2e8f0', background: '#f8fafc',
                  cursor: 'pointer', transition: 'box-shadow 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                {/* Avatar */}
                <div style={{
                  width: '36px', height: '36px', borderRadius: '9px',
                  background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.85rem', color: '#fff', flexShrink: 0,
                }}>
                  {adminInitials}
                </div>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>Admin · Apollo</p>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: '#64748b', fontWeight: 600 }}>Hospital ID {hospitalId}</p>
                </div>
                <ChevronDown size={15} color="#94a3b8" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>

              {/* Dropdown Panel */}
              {profileOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                  background: '#fff', borderRadius: '16px', minWidth: '230px',
                  boxShadow: '0 16px 48px rgba(0,0,0,0.14)', border: '1px solid #e2e8f0',
                  overflow: 'hidden', zIndex: 100,
                  animation: 'fadeDown 0.18s ease-out',
                }}>
                  {/* Header */}
                  <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '44px', height: '44px', borderRadius: '12px',
                        background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '1rem', color: '#fff',
                      }}>
                        {adminInitials}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>Admin · Apollo</span>
                          <BadgeCheck size={15} color="#10b981" />
                        </div>
                        <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Hospital Administrator</p>
                      </div>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '8px' }}>
                    <button
                      onClick={() => { setProfileOpen(false); setProfileModalOpen(true); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#334155', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2563eb18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#2563eb" />
                      </span>
                      My Profile
                    </button>
                    <button
                      onClick={() => { setProfileOpen(false); setSettingsModalOpen(true); }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', border: 'none', background: 'transparent', cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem', fontWeight: 600, color: '#334155', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#64748b18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Settings size={16} color="#64748b" />
                      </span>
                      Hospital Settings
                    </button>

                    {/* Divider */}
                    <div style={{ height: '1px', background: '#f1f5f9', margin: '6px 0' }} />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 12px', borderRadius: '10px', border: 'none',
                        background: 'transparent', cursor: 'pointer', textAlign: 'left',
                        fontSize: '0.85rem', fontWeight: 700, color: '#ef4444',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <span style={{
                        width: '32px', height: '32px', borderRadius: '8px',
                        background: '#ef444418', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <LogOut size={16} color="#ef4444" />
                      </span>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8 overflow-y-auto w-full h-[calc(100vh-80px)] bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
             {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalDashboard;
