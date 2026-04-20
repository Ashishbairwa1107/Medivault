import React, { useState } from 'react';
import AdminStatCard from '../components/ui/AdminStatCard';
import { BarChart3, Users, ShieldCheck, FileText, Activity, Search, ChevronLeft, ChevronRight, UploadCloud, FileUp, Settings, Navigation, Bell, Shield, Lock, Download, ClipboardList, X, Building2, UserCheck } from 'lucide-react';
import { useDashboard } from '../store/DashboardContext';
import { mockDoctors, mockPatients, mockConsents, mockUploads, mockPerformanceData, mockStaff, mockAuditLogs, mockReports } from '../data/adminMockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

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
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          {Icon && <Icon className="w-8 h-8 text-blue-500" />} {title}
        </h2>
        <div className="relative mt-4 md:mt-0">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-200">
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
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <span className="text-sm text-gray-500">
          Showing {filteredData.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} entries
        </span>
        <div className="flex items-center gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button 
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Doctors View
const DoctorsView = () => (
  <SearchAndPaginationTable 
    title="Doctor Registry"
    icon={Users}
    data={mockDoctors}
    columns={['Name', 'Specialization', 'Hospital', 'Status']}
    renderRow={(doctor, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900">{doctor.name}</td>
        <td className="p-4 text-gray-600">{doctor.specialization}</td>
        <td className="p-4 text-gray-600">{doctor.hospital}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${doctor.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {doctor.status}
          </span>
        </td>
      </tr>
    )}
  />
);

// Patients View
const PatientsView = () => (
  <SearchAndPaginationTable 
    title="Patient Directory"
    icon={Users}
    data={mockPatients}
    columns={['Name', 'Age', 'Gender', 'Last Visit']}
    renderRow={(patient, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900">{patient.name}</td>
        <td className="p-4 text-gray-600">{patient.age}</td>
        <td className="p-4 text-gray-600">{patient.gender}</td>
        <td className="p-4 text-gray-600">{patient.lastVisit}</td>
      </tr>
    )}
  />
);

// Consents View
const ConsentsView = () => (
  <SearchAndPaginationTable 
    title="Consent Requests"
    icon={ShieldCheck}
    data={mockConsents}
    columns={['Patient Name', 'Requested By', 'Status', 'Actions']}
    renderRow={(consent, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900">{consent.patientName}</td>
        <td className="p-4 text-gray-600">{consent.requestedBy}</td>
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
             <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-300 transition-colors">View</button>
          )}
        </td>
      </tr>
    )}
  />
);

// Medical History View
const HistoryView = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <Activity className="w-8 h-8 text-blue-500" /> Medical History Timeline
    </h2>
    <div className="mb-6 flex gap-4 items-center">
      <span className="text-gray-700 font-medium">Select Patient: </span>
      <select className="border border-gray-300 rounded-xl p-2 w-64 focus:ring-2 focus:ring-blue-500 outline-none">
        {mockPatients.slice(0, 5).map(p => <option key={p.id}>{p.name}</option>)}
      </select>
    </div>
    <div className="relative border-l-2 border-indigo-200 ml-4 py-4 space-y-8">
      {/* Timeline Item 1 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Nov 02, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900">Cardiology Consultation</h3>
        <p className="text-gray-600 mt-2">Routine checkup with Dr. Anoop Sharma. ECG normal.</p>
      </div>
      {/* Timeline Item 2 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Oct 15, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900">Blood Test Results</h3>
        <p className="text-gray-600 mt-2">Comprehensive blood panel uploaded by Apollo Diagnostics.</p>
      </div>
      {/* Timeline Item 3 */}
      <div className="relative pl-8">
        <div className="absolute w-4 h-4 rounded-full bg-indigo-500 -left-[9px] top-1 border-4 border-white shadow"></div>
        <div className="text-sm text-gray-500 mb-1">Sep 20, 2023</div>
        <h3 className="text-lg font-semibold text-gray-900">Vaccination</h3>
        <p className="text-gray-600 mt-2">Flu shot administered.</p>
      </div>
    </div>
  </div>
);

// Performance View
const PerformanceView = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <BarChart3 className="w-8 h-8 text-blue-500" /> Hospital Performance Analytics
    </h2>
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={mockPerformanceData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
          <Legend wrapperStyle={{paddingTop: '20px'}} />
          <Bar dataKey="consultations" name="Consultations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="admissions" name="Admissions" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="surgeries" name="Surgeries" fill="#10b981" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// Uploads View
const UploadsView = () => (
  <div className="space-y-8">
    <SearchAndPaginationTable 
      title="Recent Uploads"
      icon={FileUp}
      data={mockUploads}
      columns={['Record Name', 'Type', 'Upload Date']}
      renderRow={(file, idx) => (
        <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
          <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
             <FileText className="w-5 h-5 text-gray-400"/> {file.recordName}
          </td>
          <td className="p-4 text-gray-600">{file.type}</td>
          <td className="p-4 text-gray-600">{file.uploadDate}</td>
        </tr>
      )}
    />
  </div>
);

// Existing Overview Component
const OverviewView = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  const stats = [
    { title: 'Registered Hospitals', value: '47', change: '+2.4%', trend: 'up', icon: BarChart3, color: 'from-blue-500 to-indigo-600' },
    { title: 'Active Doctors', value: '184', change: '+1.8%', trend: 'up', icon: Users, color: 'from-emerald-500 to-teal-600' },
    { title: 'Total Patients', value: '2,847', change: '+5.2%', trend: 'up', icon: ShieldCheck, color: 'from-purple-500 to-pink-600' },
    { title: 'Medical Records', value: '12,394', change: '+3.9%', trend: 'up', icon: FileText, color: 'from-orange-500 to-red-600' }
  ];

  const dummyUsers = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Physician' },
    { id: 2, name: 'Priya Verma', email: 'priya@example.com', role: 'Surgeon' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', role: 'Radiologist' },
  ];

  const dummyHospitals = [
    { id: 1, name: 'City General Hospital', status: 'Approved' },
    { id: 2, name: 'Green Valley Clinic', status: 'Pending' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-xl text-gray-600 mt-2">Welcome back! Here's what's happening with MediVault.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <AdminStatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            Platform Activity <Activity className="w-8 h-8 text-blue-500" />
          </h2>
          <div className="h-[300px] w-full mt-4">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockPerformanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <RechartsTooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="consultations" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
              </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">System Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="font-semibold text-emerald-800">Database</span>
                    <span className="text-sm font-semibold text-emerald-700">✅ Online</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <span className="font-semibold text-blue-800">API Services</span>
                    <span className="text-sm font-semibold text-blue-700">🟢 99.8% uptime</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button 
                    onClick={() => setSelectedAction('users')}
                    className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" /> Manage Users
                  </button>
                  <button 
                    onClick={() => setSelectedAction('hospitals')}
                    className="w-full p-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-700 shadow transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" /> Hospital Verification
                  </button>
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Quick Action Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-50">
              <h3 className="text-xl font-bold text-blue-900 flex items-center gap-2">
                {selectedAction === 'users' ? <><Users className="text-blue-600" /> User Management</> : <><Building2 className="text-emerald-600" /> Hospital Verification</>}
              </h3>
              <button 
                onClick={() => setSelectedAction(null)}
                className="p-2 hover:bg-white/50 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              {selectedAction === 'users' ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase text-gray-400 font-bold border-b border-gray-100">
                        <th className="pb-3">Name</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {dummyUsers.map(u => (
                        <tr key={u.id}>
                          <td className="py-3">
                            <div className="font-semibold text-gray-900">{u.name}</div>
                            <div className="text-xs text-gray-500">{u.email}</div>
                          </td>
                          <td className="py-3 text-sm text-gray-600">{u.role}</td>
                          <td className="py-3 text-right">
                            <button className="text-blue-600 hover:underline text-xs font-bold">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="space-y-4">
                  {dummyHospitals.map(h => (
                    <div key={h.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <div>
                        <div className="font-bold text-gray-900">{h.name}</div>
                        <div className="text-xs text-gray-500">Registration ID: H-00{h.id}</div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${h.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {h.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 bg-gray-50 flex justify-end gap-3">
              <button 
                onClick={() => setSelectedAction(null)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
              <button className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-md">
                {selectedAction === 'users' ? 'Add User' : 'Verify New'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Settings View
const SettingsView = () => (
  <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-4xl mx-auto">
    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
      <Settings className="w-8 h-8 text-blue-500" /> Administrative Settings
    </h2>
    <div className="space-y-6">
      <div className="p-6 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Lock className="w-5 h-5 text-gray-500"/> Security Core</h3>
          <p className="text-gray-500 text-sm">Manage multi-factor authentication and passwords.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">Configure</button>
      </div>
      <div className="p-6 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Shield className="w-5 h-5 text-gray-500"/> Access Control</h3>
          <p className="text-gray-500 text-sm">Define roles and permissions for system operators.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">Manage Roles</button>
      </div>
      <div className="p-6 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 flex items-center gap-2"><Bell className="w-5 h-5 text-gray-500"/> Notification Protocols</h3>
          <p className="text-gray-500 text-sm">Setup global alerts for system critical events.</p>
        </div>
        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors">Edit Alerts</button>
      </div>
    </div>
  </div>
);

// Staff View
const StaffView = () => (
  <SearchAndPaginationTable 
    title="Staff Management"
    icon={Users}
    data={mockStaff}
    columns={['Name', 'Role', 'Department', 'Status']}
    renderRow={(staff, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900">{staff.name}</td>
        <td className="p-4 text-gray-600">{staff.role}</td>
        <td className="p-4 text-gray-600">{staff.department}</td>
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

// Audit View
const AuditView = () => (
  <SearchAndPaginationTable 
    title="System Audit Logs"
    icon={ClipboardList}
    data={mockAuditLogs}
    columns={['Timestamp', 'User', 'Action', 'IP Address']}
    renderRow={(log, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 text-gray-600 font-mono text-sm">{log.date}</td>
        <td className="p-4 font-medium text-gray-900">{log.user}</td>
        <td className="p-4 text-gray-600">{log.action}</td>
        <td className="p-4 text-gray-500 font-mono text-sm">{log.ip}</td>
      </tr>
    )}
  />
);

// Reports View
const ReportsView = () => (
  <SearchAndPaginationTable 
    title="Generated Reports"
    icon={BarChart3}
    data={mockReports}
    columns={['Report Name', 'Generated By', 'Date', 'Action']}
    renderRow={(report, idx) => (
      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <td className="p-4 font-medium text-gray-900 flex items-center gap-3">
           <FileText className="w-5 h-5 text-gray-400"/> {report.reportName}
        </td>
        <td className="p-4 text-gray-600">{report.generatedBy}</td>
        <td className="p-4 text-gray-500 text-sm">{report.date}</td>
        <td className="p-4">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-200 transition-colors border border-gray-200">
            <Download className="w-4 h-4" /> Download
          </button>
        </td>
      </tr>
    )}
  />
);

// Main Dashboard Controller
const AdminDashboard = () => {
  const { adminActiveView } = useDashboard();

  return (
    <div className="p-4 md:p-8 pb-20 min-h-screen">
      {adminActiveView === 'overview' && <OverviewView />}
      {adminActiveView === 'doctors' && <DoctorsView />}
      {adminActiveView === 'patients' && <PatientsView />}
      {adminActiveView === 'upload' && <UploadsView />}
      {adminActiveView === 'consents' && <ConsentsView />}
      {adminActiveView === 'history' && <HistoryView />}
      {adminActiveView === 'performance' && <PerformanceView />}
      {adminActiveView === 'settings' && <SettingsView />}
      {adminActiveView === 'staff' && <StaffView />}
      {adminActiveView === 'audit' && <AuditView />}
      {adminActiveView === 'reports' && <ReportsView />}
      
      {/* Fallback for completely unknown views */}
      {!['overview', 'doctors', 'patients', 'upload', 'consents', 'history', 'performance', 'settings', 'staff', 'audit', 'reports'].includes(adminActiveView) && (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">View Under Construction</h2>
          <p className="text-gray-500">The <b>{adminActiveView}</b> feature will be available shortly.</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
