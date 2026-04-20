import React, { useState, useEffect } from 'react';
import { useAuth } from '../store/AuthContext';
import api from '../services/axios';
import { Users, ClipboardList, Pill, PlusCircle, Shield, LogOut, Home, FileText, Calendar, User, Stethoscope } from 'lucide-react';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [diagPatientId, setDiagPatientId] = useState('');
  const [diagVisitType, setDiagVisitType] = useState('OPD');
  const [diagNotes, setDiagNotes] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      // Mock data with safety
      const mockPatients = [
        { id: 'MV-P001', name: 'Priya Sharma', ageGender: '34/F', bloodGroup: 'O+', lastVisit: '2025-04-10', condition: 'Stable' },
        { id: 'MV-P002', name: 'Mohan Das', ageGender: '58/M', bloodGroup: 'B+', lastVisit: '2025-04-11', condition: 'Monitoring' },
        { id: 'MV-P003', name: 'Rajan Kapoor', ageGender: '65/M', bloodGroup: 'A-', lastVisit: '2025-04-12', condition: 'Critical' },
      ];
      const mockPrescriptions = [
        { rxId: 'RX001', patient: 'Priya Sharma', date: '2025-04-10', medicines: 'Paracetamol 500mg', duration: '5 days', status: 'Active' },
        { rxId: 'RX002', patient: 'Mohan Das', date: '2025-04-11', medicines: 'Amlodipine 5mg', duration: 'Ongoing', status: 'Active' },
      ];
      setPatients(mockPatients);
      setPrescriptions(mockPrescriptions);
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'Monitoring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Stable': return 'bg-green-100 text-green-800 border-green-200';
      case 'Recovered': return 'bg-teal-100 text-teal-800 border-teal-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleSaveDiagnosis = async () => {
    if (!diagPatientId || !diagNotes) return alert('Please fill all fields');
    setLoading(true);
    try {
      await api.post('/records', {
        patientId: diagPatientId,
        diagnosis: diagNotes,
        status: diagVisitType,
        chiefComplaint: 'Dashboard entry',
        prescriptions: []
      });
      alert('Diagnosis saved!');
      setDiagPatientId('');
      setDiagNotes('');
    } catch (error) {
      alert('Save failed. Check patient ID.');
    } finally {
      setLoading(false);
    }
  };

  const visitsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [{ label: 'Patients', data: [8, 12, 10, 15, 9], backgroundColor: '#1e3a8a' }],
  };

  const options = { responsive: true, plugins: { legend: { position: 'bottom' } } };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading Dashboard...</p>
      </div>
    </div>
  );

  return (
    <div className="dash-content relative min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
            <p className="text-gray-600">Manage patients, prescriptions and clinical records</p>
          </div>

          {activeTab === 'overview' && (

            <div>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Users className="w-6 h-6 text-blue-900" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Patients</p>
                      <p className="text-3xl font-bold text-gray-900">48</p>
                      <p className="text-sm text-green-600 font-semibold">+5 new</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-teal-100 rounded-xl">
                      <Calendar className="w-6 h-6 text-teal-900" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                      <p className="text-3xl font-bold text-gray-900">12</p>
                      <p className="text-sm text-gray-600">3 remaining</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center">
                    <div className="p-3 bg-indigo-100 rounded-xl">
                      <Pill className="w-6 h-6 text-indigo-900" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Prescriptions This Month</p>
                      <p className="text-3xl font-bold text-gray-900">89</p>
                    </div>
                  </div>
                </div>
                <div className="bg-rose-50 rounded-xl border-2 border-rose-200 p-8 shadow-sm">
                  <div className="flex items-center">
                    <div className="p-3 bg-rose-100 rounded-xl">
                      <Stethoscope className="w-6 h-6 text-rose-900" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-rose-800">Critical Cases</p>
                      <p className="text-3xl font-bold text-rose-900">3</p>
                      <p className="text-sm text-rose-700 font-semibold mt-1">Immediate attention</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Patient Visits — Last 5 Days</h3>
                  <Bar data={visitsData} options={options} />
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-8">
                  <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Diagnosis Breakdown</h3>
                  <div className="flex justify-center">
                    <div className="w-64 h-64">
                  <Pie data={{
                    labels: ['Flu', 'Hypertension', 'Diabetes', 'Routine'],
                    datasets: [{
                      data: [45, 25, 20, 10],
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#6b7280']
                    }]
                  }} options={options} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-serif font-bold text-gray-900">My Patients ({patients?.length || 0})</h3>
                <button className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-medium">+ Add Patient</button>
              </div>
              {(!patients || patients.length === 0) ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                  <p className="text-gray-500">Get started by adding your first patient.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Patient ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Name</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Age/Gender</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Blood Group</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Last Visit</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Condition</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients?.map((patient) => (
                        <tr key={patient.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{patient.id}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{patient.name}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{patient.ageGender}</td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{patient.bloodGroup}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{patient.lastVisit}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(patient.condition)}`}>
                              {patient.condition}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <button 
                              onClick={() => {
                                setSelectedRecord(patient);
                                setShowModal(true);
                              }}
                              className="px-4 py-1.5 bg-blue-900 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
                            >
                              Records
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Other tabs similarly with safety checks */}
          {activeTab === 'prescriptions' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Prescription Management ({prescriptions?.length || 0})</h3>
              {(!prescriptions || prescriptions.length === 0) ? (
                <div className="text-center py-12">
                  <Pill className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No prescriptions</h3>
                  <p className="text-gray-500">Prescriptions will appear here when created.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">RX ID</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Patient</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Date</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Medicines</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Duration</th>
                        <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {prescriptions?.map((rx) => (
                        <tr key={rx.rxId} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{rx.rxId}</td>
                          <td className="py-4 px-6 text-sm text-gray-900">{rx.patient}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{rx.date}</td>
                          <td className="py-4 px-6 text-sm text-gray-700">{rx.medicines}</td>
                          <td className="py-4 px-6 text-sm font-medium text-gray-900">{rx.duration}</td>
                          <td className="py-4 px-6">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800`}>
                              {rx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'diagnosis' && (
            <div className="bg-white rounded-xl border border-gray-200 p-8">
              <h3 className="text-lg font-serif font-bold text-gray-900 mb-6">Add New Diagnosis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Patient ID</label>
                  <input 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter patient ID"
                    value={diagPatientId}
                    onChange={(e) => setDiagPatientId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Visit Type</label>
                  <select 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={diagVisitType}
                    onChange={(e) => setDiagVisitType(e.target.value)}
                  >
                    <option>OPD</option>
                    <option>Follow-up</option>
                    <option>Emergency</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chief Complaint & Diagnosis</label>
                  <textarea 
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-[120px]"
                    placeholder="Enter detailed diagnosis notes..."
                    value={diagNotes}
                    onChange={(e) => setDiagNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4 mt-8">
                <button 
                  onClick={handleSaveDiagnosis}
                  disabled={!diagPatientId || !diagNotes || loading}
                  className="px-8 py-3 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  <PlusCircle className="w-5 h-5" />
                  Save Diagnosis
                </button>
                <button 
                  onClick={() => {
                    setDiagPatientId('');
                    setDiagNotes('');
                  }}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        {/* Medical Record Modal */}
          {showModal && selectedRecord && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-8 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-serif font-bold text-gray-900">Medical Record — #{selectedRecord.id}</h2>
                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                      <div className="space-y-4 text-sm">
                        <div><span className="font-medium text-gray-700">Patient:</span> <span>{selectedRecord.name}</span></div>
                        <div><span className="font-medium text-gray-700">Age/Gender:</span> <span>{selectedRecord.ageGender}</span></div>
                        <div><span className="font-medium text-gray-700">Blood Group:</span> <span>{selectedRecord.bloodGroup}</span></div>
                        <div><span className="font-medium text-gray-700">Last Visit:</span> <span>{selectedRecord.lastVisit}</span></div>
                        <div><span className="font-medium text-gray-700">Condition:</span> 
                          <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getConditionColor(selectedRecord.condition)}`}>
                            {selectedRecord.condition}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Details</h3>
                      <div className="space-y-4 text-sm">
                        <div><span className="font-medium text-gray-700">Doctor:</span> <span>Dr. R. Sharma</span></div>
                        <div><span className="font-medium text-gray-700">Hospital:</span> <span>AIIMS Delhi</span></div>
                        <div><span className="font-medium text-gray-700">Status:</span> <span className="px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs font-semibold">Active</span></div>
                        <div><span className="font-medium text-gray-700">Prescriptions:</span> <span className="text-gray-600">Paracetamol 500mg, 1 BD x 5 days</span></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <button className="flex-1 bg-blue-900 text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-800 transition-all">
                      Download PDF
                    </button>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
    </div>
  );

};

export default DoctorDashboard;
