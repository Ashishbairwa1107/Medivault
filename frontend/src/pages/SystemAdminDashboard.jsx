import React, { useState, useEffect } from 'react';
import { 
  BarChart2, LayoutDashboard, Hospital, Users, ShieldCheck, ClipboardCheck, FileText, TrendingUp, 
  MessageSquare, Bell, LogOut, Stethoscope, ClipboardList, Search, Moon, Sun,
  Activity, ChevronLeft, ChevronRight, UploadCloud, FileUp, Settings, Navigation, Shield, Lock, Download, BarChart3
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { mockDoctors, mockPatients, mockConsents, mockUploads, mockPerformanceData, mockStaff, mockAuditLogs, mockReports } from '../data/adminMockData';

// Subcomponents for reusable pagination and search
const SearchAndPaginationTable = ({ title, data, columns, renderRow, icon: Icon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 dark:border-white/10 p-8 mb-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-blue-500" />} {title}
        </h2>
        <div className="relative mt-4 md:mt-0">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-900 text-gray-600 dark:text-gray-300 text-sm uppercase tracking-wider border-b border-gray-200 dark:border-slate-700">
              {columns.map((col, idx) => <th key={idx} className="p-4">{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, idx) => renderRow(item, idx))}
          </tbody>
        </table>
        {currentData.length === 0 && <p className="text-center text-gray-500 py-6">No records found.</p>}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100 dark:border-slate-700">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 border border-gray-200 dark:border-slate-700 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Sub-Views ported from AdminDashboard
const DoctorsView = () => (
  <SearchAndPaginationTable 
    title="Doctor Registry" icon={Stethoscope} data={mockDoctors}
    columns={['Name', 'Specialization', 'Hospital', 'Status']}
    renderRow={(doctor, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-medium text-gray-900 dark:text-white">{doctor.name}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{doctor.specialization}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{doctor.hospital}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {doctor.status}
          </span>
        </td>
      </tr>
    )}
  />
);

const PatientsView = () => (
  <SearchAndPaginationTable 
    title="Patient Directory" icon={Users} data={mockPatients}
    columns={['Name', 'Age', 'Gender', 'Last Visit']}
    renderRow={(patient, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-medium text-gray-900 dark:text-white">{patient.name}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{patient.age}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{patient.gender}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{patient.lastVisit}</td>
      </tr>
    )}
  />
);

const ConsentsView = () => (
  <SearchAndPaginationTable 
    title="Consent Requests" icon={ShieldCheck} data={mockConsents}
    columns={['Patient Name', 'Requested By', 'Status', 'Actions']}
    renderRow={(consent, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-medium text-gray-900 dark:text-white">{consent.patientName}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{consent.requestedBy}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            consent.status === 'Approved' ? 'bg-green-100 text-green-700' : 
            consent.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-red-100 text-red-700'
          }`}>
            {consent.status}
          </span>
        </td>
        <td className="p-4 flex gap-2">
          {consent.status === 'Pending' && (
            <>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors">Approve</button>
              <button className="px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition-colors">Reject</button>
            </>
          )}
          {consent.status !== 'Pending' && (
             <button className="px-3 py-1 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-white rounded-lg text-xs font-medium transition-colors">View</button>
          )}
        </td>
      </tr>
    )}
  />
);

const SettingsView = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
      <Settings className="w-8 h-8 text-blue-500" /> Administrative Settings
    </h2>
    <div className="space-y-6">
      <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-gray-500"/> Security Core</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Manage multi-factor authentication and passwords.</p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Configure</button>
      </div>
      <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-gray-500"/> Access Control</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Define roles and permissions for system operators.</p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Manage Roles</button>
      </div>
      <div className="p-6 border border-gray-100 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-900 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2"><Bell className="w-5 h-5 text-gray-500"/> Notification Protocols</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Setup global alerts for system critical events.</p>
        </div>
        <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-white rounded-lg font-medium hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">Edit Alerts</button>
      </div>
    </div>
  </div>
);

const StaffView = () => (
  <SearchAndPaginationTable 
    title="Staff Management" icon={Hospital} data={mockStaff}
    columns={['Name', 'Role', 'Department', 'Status']}
    renderRow={(staff, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-medium text-gray-900 dark:text-white">{staff.name}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{staff.role}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{staff.department}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            staff.status === 'Active' ? 'bg-green-100 text-green-700' : 
            staff.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
            'bg-gray-200 text-gray-700'
          }`}>
            {staff.status}
          </span>
        </td>
      </tr>
    )}
  />
);

const AuditView = () => (
  <SearchAndPaginationTable 
    title="System Audit Logs" icon={ClipboardCheck} data={mockAuditLogs}
    columns={['Timestamp', 'User', 'Action', 'IP Address']}
    renderRow={(log, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 text-gray-600 dark:text-gray-400 font-mono text-sm">{log.date}</td>
        <td className="p-4 font-medium text-gray-900 dark:text-white">{log.user}</td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{log.action}</td>
        <td className="p-4 text-gray-500 dark:text-gray-500 font-mono text-sm">{log.ip}</td>
      </tr>
    )}
  />
);

const ReportsView = () => (
  <SearchAndPaginationTable 
    title="Generated Reports" icon={FileText} data={mockReports}
    columns={['Report Name', 'Generated By', 'Date', 'Action']}
    renderRow={(report, idx) => (
      <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
        <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
           <FileText className="w-5 h-5 text-gray-400"/> {report.reportName}
        </td>
        <td className="p-4 text-gray-600 dark:text-gray-400">{report.generatedBy}</td>
        <td className="p-4 text-gray-500 dark:text-gray-500 text-sm">{report.date}</td>
        <td className="p-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-200 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors border border-gray-200 dark:border-slate-600">
            <Download className="w-4 h-4" /> Download
          </button>
        </td>
      </tr>
    )}
  />
);

const HospitalPerformanceView = () => (
  <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 dark:border-white/10 p-8 mb-8 transition-all duration-300 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6 flex items-center gap-3">
      <TrendingUp className="w-8 h-8 text-blue-500" /> Hospital Performance Analytics
    </h2>
    <div className="h-[400px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockPerformanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.15} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-10} />
          <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.1)', color: '#0f172a', fontWeight: 'bold' }} />
          <Legend wrapperStyle={{paddingTop: '20px', fontWeight: 600, color: '#475569'}} />
          <Bar dataKey="consultations" name="Consultations" fill="#3b82f6" radius={[6, 6, 0, 0]} activeBar={{ fill: '#2563eb' }} />
          <Bar dataKey="admissions" name="Admissions" fill="#8b5cf6" radius={[6, 6, 0, 0]} activeBar={{ fill: '#7c3aed' }} />
          <Bar dataKey="surgeries" name="Surgeries" fill="#10b981" radius={[6, 6, 0, 0]} activeBar={{ fill: '#059669' }} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const UploadsView = () => (
  <div className="space-y-8">
    <SearchAndPaginationTable 
      title="Recent Uploads" icon={FileUp} data={mockUploads}
      columns={['Record Name', 'Type', 'Upload Date']}
      renderRow={(file, idx) => (
        <tr key={idx} className="border-b border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
          <td className="p-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
             <FileText className="w-5 h-5 text-gray-400"/> {file.recordName}
          </td>
          <td className="p-4 text-gray-600 dark:text-gray-400">{file.type}</td>
          <td className="p-4 text-gray-600 dark:text-gray-400">{file.uploadDate}</td>
        </tr>
      )}
    />
  </div>
);

const HistoryView = () => (
  <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
      <Activity className="w-8 h-8 text-blue-500" /> Medical History Timeline
    </h2>
    <div className="mb-6 flex gap-4 items-center">
      <span className="text-gray-700 dark:text-gray-300 font-medium">Select Patient: </span>
      <select className="border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-xl p-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none">
        {mockPatients.slice(0, 5).map(p => <option key={p.id}>{p.name}</option>)}
      </select>
    </div>
    <div className="relative border-l-2 border-indigo-200 ml-4 py-4 space-y-8">
      {/* Timeline Item 1 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white dark:border-slate-800 shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Nov 02, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Cardiology Consultation</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Routine checkup with Dr. Anoop Sharma. ECG normal.</p>
      </div>
      {/* Timeline Item 2 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white dark:border-slate-800 shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Oct 15, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Blood Test Results</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Comprehensive blood panel uploaded by Apollo Diagnostics.</p>
      </div>
      {/* Timeline Item 3 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white dark:border-slate-800 shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Sep 20, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Vaccination</h3>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Flu shot administered.</p>
      </div>
    </div>
  </div>
);

const SystemAdminDashboard = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');
  const [currentFeedback, setCurrentFeedback] = useState(0);
  
  const feedbackData = [
    {
      avatar: 'DS',
      name: 'Dr. Sharma',
      location: 'Delhi',
      role: 'Doctor',
      rating: 5,
      text: 'Excellent platform for secure record sharing. Very intuitive!'
    },
    {
      avatar: 'PK',
      name: 'Priya Kumar',
      location: 'Mumbai',
      role: 'Patient',
      rating: 4,
      text: 'Good privacy controls. Would like mobile app support.'
    },
    {
      avatar: 'AK',
      name: 'Dr. Anita Khan',
      location: 'Bangalore',
      role: 'Doctor',
      rating: 5,
      text: 'Consent workflow is perfect for compliance. Highly recommend.'
    },
    {
      avatar: 'RK',
      name: 'Ravi S.',
      location: 'Chennai',
      role: 'Patient',
      rating: 3,
      text: 'Basic functionality good. UI needs polish.'
    },
    {
      avatar: 'JM',
      name: 'Dr. James M.',
      location: 'Hyderabad',
      role: 'Doctor',
      rating: 5,
      text: 'Transforming how we manage patient data!'
    }
  ];

  const chartData = [
    { month: 'Jan', admissions: 220, consents: 180 },
    { month: 'Feb', admissions: 245, consents: 210 },
    { month: 'Mar', admissions: 280, consents: 250 },
    { month: 'Apr', admissions: 310, consents: 290 },
    { month: 'May', admissions: 345, consents: 330 },
    { month: 'Jun', admissions: 380, consents: 370 },
    { month: 'Jul', admissions: 410, consents: 400 },
    { month: 'Aug', admissions: 450, consents: 440 },
    { month: 'Sep', admissions: 490, consents: 480 },
    { month: 'Oct', admissions: 530, consents: 520 },
    { month: 'Nov', admissions: 570, consents: 560 },
    { month: 'Dec', admissions: 610, consents: 600 },
  ];

  const stats = [
    { title: 'Total Doctors', value: '87', growth: '+3 new', icon: Stethoscope, color: 'border-blue-500 bg-blue-50 text-blue-700' },
    { title: 'Total Patients', value: '1,284', growth: '+48 this week', icon: Users, color: 'border-teal-500 bg-teal-50 text-teal-700' },
    { title: 'Total Consents', value: '512', growth: '23 pending', icon: ShieldCheck, color: 'border-indigo-500 bg-indigo-50 text-indigo-700' },
    { title: 'Medical Records', value: '2,840', growth: '+124 this month', icon: ClipboardList, color: 'border-purple-500 bg-purple-50 text-purple-700' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeedback((prev) => (prev + 1) % feedbackData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2, section: 'OVERVIEW' },
    { id: 'doctors', label: 'Doctors', icon: Stethoscope, section: 'MANAGEMENT' },
    { id: 'patients', label: 'Patients', icon: Users, section: 'MANAGEMENT' },
    { id: 'consents', label: 'Consent Registry', icon: ShieldCheck, section: 'MANAGEMENT', badge: true },
    { id: 'upload', label: 'Upload Records', icon: FileUp, section: 'RECORDS' },
    { id: 'history', label: 'Medical History', icon: ClipboardList, section: 'RECORDS' },
    { id: 'performance', label: 'Performance', icon: TrendingUp, section: 'ANALYTICS' },
    { id: 'reports', label: 'Reports', icon: FileText, section: 'ANALYTICS' },
    { id: 'audit', label: 'Audit Log', icon: ClipboardCheck, section: 'COMPLIANCE' },
    { id: 'staff', label: 'Staff Management', icon: Hospital, section: 'MANAGEMENT' },
    { id: 'feedback', label: 'User Feedbacks', icon: MessageSquare, section: 'COMMUNICATION' },
    { id: 'settings', label: 'Settings', icon: Settings, section: 'ACCOUNT' },
    { id: 'signout', label: 'Sign Out', icon: LogOut, section: 'ACCOUNT' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'analytics':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white">
                System-Wide Platform Analytics 📊
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mt-4">
                Updated live — {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-xl shadow-md border-l-4 ${stat.color} animate-fade-in`}>
                  <div className="flex items-center gap-3 mb-2">
                    <stat.icon className="w-8 h-8" />
                    <h3 className="font-medium text-gray-900 dark:text-white">{stat.title}</h3>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <span className="text-sm font-semibold text-emerald-600">{stat.growth}</span>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 dark:border-white/10 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-6 flex items-center gap-3">
                  Patient Admissions & Consent Growth
                </h3>
                 <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorAdmissions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#14B8A6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorConsents" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.15} vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 13, fontWeight: 500}} dx={-10} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', boxShadow: '0 20px 40px rgb(0 0 0 / 0.1)', color: '#0f172a', fontWeight: 'bold' }} />
                    <Legend wrapperStyle={{fontWeight: 600, color: '#475569'}} />
                    <Area type="monotone" dataKey="admissions" stroke="#14B8A6" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmissions)" activeDot={{ r: 6, style: { filter: 'drop-shadow(0 0 8px rgba(20, 184, 166, 0.8))' } }} />
                    <Area type="monotone" dataKey="consents" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorConsents)" activeDot={{ r: 6, style: { filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.8))' } }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Recent User Feedbacks
                </h3>
                <div className="relative">
                  <div className="h-96 overflow-hidden rounded-xl">
                    {feedbackData.map((feedback, index) => (
                      <div 
                        key={index}
                        className={`absolute inset-0 transition-all duration-500 transform ${index === currentFeedback ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} ${index === (currentFeedback - 1 + feedbackData.length) % feedbackData.length ? '-translate-x-full' : ''}`}
                      >
                        <div className="h-full p-6 flex flex-col justify-center">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                              {feedback.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-xl text-gray-900 dark:text-white">{feedback.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-400">{feedback.location} • {feedback.role}</div>
                            </div>
                          </div>
                          <div className="flex gap-1 mb-4">
                            {[...Array(5)].map((_, i) => (
                              <div key={i} className={`w-5 h-5 rounded-full ${i < feedback.rating ? 'bg-yellow-400 shadow-lg' : 'bg-gray-200 dark:bg-gray-600'}`} />
                            ))}
                          </div>
                          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 italic">
                            "{feedback.text}"
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {feedbackData.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentFeedback ? 'w-8 bg-blue-500' : 'bg-gray-300 dark:bg-gray-500 hover:bg-gray-400'}`}
                        onClick={() => setCurrentFeedback(index)}
                      />
                    ))}
                  </div>
                  <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all">
                    <span>‹</span>
                  </button>
                  <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg hover:shadow-xl transition-all">
                    <span>›</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'doctors': return <DoctorsView />;
      case 'patients': return <PatientsView />;
      case 'upload': return <UploadsView />;
      case 'consents': return <ConsentsView />;
      case 'history': return <HistoryView />;
      case 'performance': return <HospitalPerformanceView />;
      case 'reports': return <ReportsView />;
      case 'audit': return <AuditView />;
      case 'staff': return <StaffView />;
      case 'settings': return <SettingsView />;
      case 'feedback':
        return <div>User Feedbacks</div>;
      case 'alerts':
        return <div>System Alerts</div>;
      case 'signout':
        return <div>Signing out...</div>;
      default:
        return <div>Analytics Dashboard</div>;
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-slate-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
      
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-slate-900 text-white p-6 flex flex-col">
          <div className="mb-12 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3 mb-8">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="#3B82F6">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11a9.39 9.39 0 0 0 5-1v-6.58c-.41.08-.84.14-1.28.17a3.73 3.73 0 0 0-1.72-.25 3.74 3.74 0 0 0-1.72.25 4 4 0 0 1-1.28-.17V18a9.29 9.29 0 0 0 5 1c5.16 0 9-4.45 9-11V7z"/>
              </svg>
              <div>
                <h2 className="text-xl font-bold">MediVault</h2>
                <p className="text-sm text-slate-400">System Admin</p>
              </div>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all mb-2 hover:bg-slate-800 hover:transform hover:-translate-x-1 group ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className={`w-5 h-5 group-hover:scale-110 transition-transform ${activeTab === item.id ? 'text-blue-300' : 'text-slate-400'}`} />
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    New
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-gray-50/50 dark:bg-slate-900">
          {/* Top Navigation */}
          <div className="sticky top-0 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-slate-800/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  System Admin / {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <Search className="w-5 h-5 text-gray-500" />
                  </div>
                </div>
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-slate-600 transition-all p-1"
                >
                  {darkMode ? (
                    <Sun className={`w-5 h-5 transition-transform duration-500 ${darkMode ? 'rotate-0' : 'rotate-180'}`} />
                  ) : (
                    <Moon className={`w-5 h-5 transition-transform duration-500 ${darkMode ? 'rotate-180' : 'rotate-0'}`} />
                  )}
                </button>
                <div className="relative">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white font-bold">3</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase">All Systems Operational</span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                  SA
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white hidden md:block">
                  System Admin
                </span>
              </div>
            </div>
          </div>

          <main className="p-8 max-w-7xl mx-auto">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SystemAdminDashboard;

