import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../../store/DashboardContext';
import AdminStatCard from '../../components/ui/AdminStatCard';
import { 
  ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { 
  Activity, Users, UserPlus, FileUp, ShieldCheck, FileText, 
  BarChart3, Settings, LogOut, Home, Stethoscope, Search, Plus, 
  UploadCloud, Calendar, Edit, Trash2, Eye, X, CheckCircle2, AlertTriangle, File as FileIcon
} from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import api from '../../services/axios';

const initialMockDoctors = [
  { id: 'DOC-001', name: 'Dr. Anoop Sharma', specialization: 'Cardiology', patients: 145, status: 'Active' },
  { id: 'DOC-002', name: 'Dr. Meera Patel', specialization: 'Neurology', patients: 98, status: 'Active' },
  { id: 'DOC-003', name: 'Dr. Ramesh Kumar', specialization: 'Orthopedics', patients: 210, status: 'On Leave' },
  { id: 'DOC-004', name: 'Dr. Priya Singh', specialization: 'Pediatrics', patients: 320, status: 'Active' },
];

const initialMockPatients = [
  { id: 'PT-1001', name: 'Arjun Das', bloodGroup: 'O+', ward: 'ICU-A', doctor: 'Dr. Anoop Sharma', status: 'ICU' },
  { id: 'PT-1002', name: 'Lakshmi Nair', bloodGroup: 'A+', ward: 'Nil', doctor: 'Dr. Meera Patel', status: 'OPD' },
  { id: 'PT-1003', name: 'Sanjay Gupta', bloodGroup: 'B+', ward: 'Gen-12', doctor: 'Dr. Ramesh Kumar', status: 'Admitted' },
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

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 hover:scale-105 border-l-4 ${
      isActive 
        ? 'bg-blue-50/80 text-blue-700 border-blue-600 font-bold shadow-sm' 
        : 'text-slate-500 border-transparent hover:bg-slate-50/50 hover:text-blue-600 font-medium'
    }`}
  >
    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
    <span className="text-md font-semibold tracking-wide">{label}</span>
  </button>
);

const HospitalAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const contextData = useDashboard() || {};
  const [doctors, setDoctors] = useState(initialMockDoctors);
  const [patients, setPatients] = useState(initialMockPatients);

  // States for Modals and Actions
  const [isSignOutOpen, setIsSignOutOpen] = useState(false);
  const [newDoctor, setNewDoctor] = useState({ name: '', specialization: 'Cardiology', email: '', contact: '', room: '', department: 'General' });
  const [reportForm, setReportForm] = useState({ patientId: '', reportType: 'Blood Test', reportDate: new Date().toISOString().split('T')[0], orderingDoctor: '', diagnosis: '' });

  // States for File Upload
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const adminStats = contextData.adminStats || { 
    patients: {value: '1,284', growth: '+48 this week'}, 
    doctors: {value: '87', growth: '+3 new'}, 
    consents: {value: '512', growth: '23 pending'}, 
    reports: {value: '2,840', growth: '+124 this month'}
  };
  const patientTrends = contextData.patientTrends || [];
  const deptDist = contextData.deptDist || [];

  // Handlers
  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data } = await api.get('/doctors');
      if (data && Array.isArray(data)) {
        setDoctors(data.length > 0 ? data : initialMockDoctors);
      }
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    }
  };

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

    try {
      const { data } = await api.post('/doctors', {
        name: newDoctor.name,
        email: newDoctor.email,
        specialization: newDoctor.specialization,
        department: newDoctor.department,
        phone: newDoctor.contact,
        address: newDoctor.room // mapping room to address for now
      });

      if (data.success) {
        toast.success(data.message || "Doctor added successfully!");
        setIsAddDoctorOpen(false);
        setNewDoctor({ name: '', specialization: 'Cardiology', email: '', contact: '', room: '', department: 'General' });
        fetchDoctors(); // Refresh list
      }
    } catch (err) {
      console.error('Add doctor error:', err);
      toast.error(err.response?.data?.message || "Failed to add doctor");
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
    setSelectedFile({ name: file.name, size: `${sizeMB} MB`, rawFile: file });
  };

  const handleDocumentSubmit = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload."); return;
    }
    if (!reportForm.patientId || !reportForm.reportType) {
      toast.error("Please fill all required report details."); return;
    }

    setIsUploading(true);
    setProgress(10); // Start progress

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('patientId', reportForm.patientId);
      formDataToSend.append('reportType', reportForm.reportType);
      formDataToSend.append('reportDate', reportForm.reportDate);
      formDataToSend.append('orderingDoctor', reportForm.orderingDoctor);
      formDataToSend.append('diagnosis', reportForm.diagnosis);
      formDataToSend.append('report', selectedFile.rawFile); // Using the actual File object

      const { data } = await api.post('/records/upload', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        },
      });

      if (data.success) {
        toast.success("Medical report uploaded and secured!", { duration: 4000 });
        setSelectedFile(null);
        setReportForm({ patientId: '', reportType: 'Blood Test', reportDate: new Date().toISOString().split('T')[0], orderingDoctor: '', diagnosis: '' });
      }
    } catch (err) {
      console.error('Upload Error:', err);
      toast.error(err.response?.data?.message || "Secure upload failed. Please verify Patient ID.");
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
                placeholder="e.g. MV-2024-XXXXX or PT-1001" 
                value={reportForm.patientId}
                onChange={e => setReportForm({...reportForm, patientId: e.target.value})}
                className="w-full p-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Report Type *</label>
            <select 
                value={reportForm.reportType}
                onChange={e => setReportForm({...reportForm, reportType: e.target.value})}
                className="w-full p-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
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
                    value={reportForm.reportDate}
                    onChange={e => setReportForm({...reportForm, reportDate: e.target.value})}
                    className="w-full pl-10 pr-3 py-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Ordering Doctor</label>
              <input 
                type="text" 
                placeholder="Dr. Name" 
                value={reportForm.orderingDoctor}
                onChange={e => setReportForm({...reportForm, orderingDoctor: e.target.value})}
                className="w-full p-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 tracking-wide">Diagnosis Keywords</label>
            <input 
              type="text" 
              placeholder="e.g. Hypertension, Viral Fever" 
              value={reportForm.diagnosis}
              onChange={e => setReportForm({...reportForm, diagnosis: e.target.value})}
              className="w-full p-3 border border-slate-200 bg-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
            />
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
            disabled={isUploading}
            onClick={handleDocumentSubmit}
            className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all ${isUploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:-translate-y-1 hover:shadow-xl'}`}>
            {isUploading ? 'Encrypting & Uploading...' : 'Submit Report Securely'}
          </button>
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
              <AdminStatCard title="Total Patients" value={adminStats.patients.value} growth={adminStats.patients.growth} icon={Users} gradientFrom="from-blue-500" gradientTo="to-indigo-500" />
              <AdminStatCard title="Registered Doctors" value={adminStats.doctors.value} growth={adminStats.doctors.growth} icon={Stethoscope} gradientFrom="from-teal-400" gradientTo="to-emerald-500" />
              <AdminStatCard title="Active Consents" value={adminStats.consents.value} growth={adminStats.consents.growth} icon={Search} gradientFrom="from-amber-400" gradientTo="to-orange-500" />
              <AdminStatCard title="Reports Uploaded" value={adminStats.reports.value} growth={adminStats.reports.growth} icon={FileUp} gradientFrom="from-purple-500" gradientTo="to-pink-500" />
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
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out; }
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
            <input type="email" placeholder="doctor@medivault.com" value={newDoctor.email} onChange={e => setNewDoctor({...newDoctor, email: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
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
            <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
            <input type="text" placeholder="e.g. OPD, Surgery" value={newDoctor.department} onChange={e => setNewDoctor({...newDoctor, department: e.target.value})} className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium" />
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

      <AlertDialog 
        isOpen={isSignOutOpen} 
        onClose={() => setIsSignOutOpen(false)} 
        onConfirm={handleSignOut}
        title="Confirm Sign Out"
        description="Are you sure you want to sign out? You will need to re-authenticate to access the dashboard."
      />

      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm fixed h-full z-10 transition-all">
        <div className="p-8 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-blue-700" />
            <h1 className="text-2xl font-black text-blue-900 tracking-tight">Apollo</h1>
          </div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-11">Hospital Admin</p>
        </div>
        
        <div className="flex-1 py-6 overflow-y-auto space-y-1">
          <SidebarItem icon={Home} label="Dashboard" isActive={activeTab === 'Dashboard'} onClick={() => setActiveTab('Dashboard')} />
          <SidebarItem icon={Stethoscope} label="Doctors" isActive={activeTab === 'Doctors'} onClick={() => setActiveTab('Doctors')} />
          <SidebarItem icon={Users} label="Patients" isActive={activeTab === 'Patients'} onClick={() => setActiveTab('Patients')} />
          <SidebarItem icon={FileUp} label="Upload Reports" isActive={activeTab === 'Upload Reports'} onClick={() => setActiveTab('Upload Reports')} />
        </div>

        <div className="p-6 border-t border-gray-100">
          <button onClick={() => setIsSignOutOpen(true)} className="flex items-center gap-3 text-slate-500 hover:text-red-600 font-bold transition-colors w-full px-4 outline-none">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800">
              {activeTab === 'Upload Reports' ? 'Report Management' : activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-slate-800">Hospital ID: #H-001</p>
              <p className="text-xs text-slate-500">MH-REG-2024-001</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
              AH
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="p-8 overflow-y-auto bg-slate-50/50 w-full h-[calc(100vh-80px)]">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HospitalAdminDashboard;
