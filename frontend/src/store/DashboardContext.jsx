import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export const DashboardContext = createContext();

export const useDashboard = () => {
    const context = useContext(DashboardContext);
    if (!context) {
        throw new Error('useDashboard must be used within DashboardProvider');
    }
    return context;
};

export const DashboardProvider = ({ children }) => {
    const { user } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [records, setRecords] = useState([]);
    const [consents, setConsents] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [monthlyVisits, setMonthlyVisits] = useState([]);
    const [auditLogs, setAuditLogs] = useState([]);
    
  // Hospital Admin Dashboard state
  const [adminActiveView, setAdminActiveView] = useState('overview');
  const [adminStats, setAdminStats] = useState({
    patients: { value: '1,284', growth: '+48 this week', change: 3.8 },
    doctors: { value: '87', growth: '+3 new', change: 3.6 },
    consents: { value: '512', growth: 'Live access', change: 0 },
    reports: { value: '2,840', growth: '+124 this month', change: 4.6 }
  });
  const [patientTrends, setPatientTrends] = useState([
    { month: 'Jan', admissions: 220 },
    { month: 'Feb', admissions: 245 },
    { month: 'Mar', admissions: 280 },
    { month: 'Apr', admissions: 310 },
    { month: 'May', admissions: 345 }
  ]);
  const [deptDist, setDeptDist] = useState([
    { name: 'Cardiology', value: 35, color: '#1e40af' },
    { name: 'Orthopedics', value: 25, color: '#3b82f6' },
    { name: 'General', value: 20, color: '#60a5fa' },
    { name: 'Neurology', value: 15, color: '#93c5fd' },
    { name: 'Pediatrics', value: 5, color: '#bfdbfe' }
  ]);
  const [hospitals, setHospitals] = useState([
    { id: '#H-001', name: 'AIIMS Delhi', state: 'Delhi', type: 'Government', beds: 2500, status: 'Verified' },
    { id: '#H-002', name: 'Apollo Hospital', state: 'Maharashtra', type: 'Private', beds: 1200, status: 'Verified' },
    { id: '#H-003', name: 'Max Healthcare', state: 'Delhi', type: 'Private', beds: 850, status: 'Verified' },
    { id: '#H-004', name: 'Safdarjung Hospital', state: 'Delhi', type: 'Government', beds: 1800, status: 'Pending' },
    { id: '#H-005', name: 'Fortis Hospital', state: 'Karnataka', type: 'Private', beds: 950, status: 'Verified' },
  ]);
  const [users, setUsers] = useState([
    { id: 'U-001', name: 'Priya Sharma', role: 'Patient', status: 'Active' },
    { id: 'U-002', name: 'Dr. Rajesh Gupta', role: 'Doctor', status: 'Active' },
    { id: 'U-003', name: 'AIIMS Delhi Admin', role: 'Hospital', status: 'Active' },
    { id: 'U-004', name: 'Dr. Anita Singh', role: 'Doctor', status: 'Suspended' },
    { id: 'U-005', name: 'Ravi Kumar', role: 'Patient', status: 'Flagged' },
    { id: 'U-006', name: 'CMC Vellore', role: 'Hospital', status: 'Active' },
  ]);
  const [adminAuditLogs, setAdminAuditLogs] = useState([
    { timestamp: '2025-04-12 14:32', user: 'Dr. R. Sharma', role: 'Doctor', event: 'Revoked Consent', ip: '192.168.1.105', result: 'Revoke' },
    { timestamp: '2025-04-12 13:45', user: 'AIIMS Delhi', role: 'Hospital', event: 'Viewed Records', ip: '10.0.2.15', result: 'Success' },
    { timestamp: '2025-04-12 12:20', user: 'Priya Sharma', role: 'Patient', event: 'Login', ip: '172.16.0.50', result: 'Success' },
    { timestamp: '2025-04-12 11:08', user: 'Dr. S. Patel', role: 'Doctor', event: 'Access Denied', ip: '192.168.1.22', result: 'Blocked' },
    { timestamp: '2025-04-12 10:55', user: 'Max Hospital', role: 'Hospital', event: 'Upload Record', ip: '10.0.3.44', result: 'Success' },
    { timestamp: '2025-04-11 16:30', user: 'Admin User', role: 'Admin', event: 'User Suspended', ip: '192.168.1.100', result: 'System' },
    { timestamp: '2025-04-11 15:12', user: 'Dr. K. Nair', role: 'Doctor', event: 'Viewed Prescriptions', ip: '172.16.1.20', result: 'Success' },
    { timestamp: '2025-04-11 14:05', user: 'Fortis Admin', role: 'Hospital', event: 'Consent Revoked', ip: '10.0.4.12', result: 'Revoke' },
    { timestamp: '2025-04-10 09:47', user: 'Ravi Kumar', role: 'Patient', event: 'Flagged Account', ip: '192.168.2.33', result: 'System' },
    { timestamp: '2025-04-10 08:22', user: 'Apollo Staff', role: 'Hospital', event: 'Login Failed', ip: '10.0.1.88', result: 'Blocked' },
  ]);
  const [systemAlerts, setSystemAlerts] = useState([
    { id: 1, type: 'error', title: 'High System Load', time: '2 min ago', desc: 'Server CPU at 92%' },
    { id: 2, type: 'warning', title: 'Consent Expiry', time: '5 min ago', desc: '45 consents expire today' },
    { id: 3, type: 'info', title: 'New Hospital Verified', time: '1 hr ago', desc: 'Fortis Hospital (#H-005) onboarded' },
    { id: 4, type: 'success', title: 'Backup Complete', time: '3 hrs ago', desc: '48.2M records backed up successfully' },
    { id: 5, type: 'error', title: 'API Rate Limit', time: '6 hrs ago', desc: 'External service throttled' },
  ]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const toggleViewModal = useCallback(() => {
      setShowViewModal(prev => !prev);
      if (!prev) setSelectedRecord(null);
    }, []);

    const setViewRecord = useCallback((record) => {
      setSelectedRecord(record);
      setShowViewModal(true);
    }, []);

    const toggleUploadModal = useCallback(() => {
      setShowUploadModal(prev => !prev);
    }, []);

    const handleConsentToggle = useCallback((consentId, granted) => {
      setConsents(prev => prev.map(c => 
        c._id === consentId ? { ...c, accessGranted: granted, updatedAt: new Date().toISOString() } : c
      ));
    }, []);

    const handleUploadRecord = useCallback(async (newRecord) => {
      const recordWithFile = {
        ...newRecord,
        fileName: newRecord.fileName,
        fileUrl: `http://localhost:5000/uploads/${newRecord.fileName}`
      };
      setRecords(prev => [recordWithFile, ...prev]);
      toggleUploadModal();
    }, [toggleUploadModal]);

    const fetchRecords = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        setError(null);
        try {
            // Expanded mock data matching screenshots
            const mockRecords = [
                {
                    recordId: '#REC-AIG-20825',
                    date: '2025-04-18',
                    type: 'Lab Test',
                    doctor: 'Dr. ARABIND PANDA',
                    hospital: 'AIG Hospitals, Gachibowli',
                    diagnosis: 'Haematology - CBP (Complete Blood Picture)',
                    chiefComplaint: 'Routine Laboratory Investigation',
                    results: 'Lymphocytes: 13.3 % (Low), Eosinophils: 0.3 % (Low)',
                    reportText: 'LABORATORY REPORT: Patient shows low lymphocyte (13.3%) and eosinophil (0.3%) counts. All other CBC parameters are within normal range. Physician review recommended.',
                    status: 'Active',
                    createdAt: '2025-04-18',
                    reportUrl: '/aig_report.png',
                    fileName: 'AIG_CBP_Report.png',
                    _id: 'rec_aig_001'
                },
                {
                    recordId: '#REC-2025-CBC1',
                    date: '2025-04-12',
                    type: 'Lab',
                    doctor: 'Dr. Bhavesh Chauhan',
                    hospital: 'Shree Hospital IPD',
                    diagnosis: 'Complete Blood Count (Anemic)',
                    chiefComplaint: 'Weakness and Fatigue',
                    results: 'Hb: 9.10 gm/dl (Low), RBC: 3.19 mill/cmm (Low)',
                    reportText: 'CLINICAL SUMMARY: Blood count shows low Hemoglobin (9.1) and RBC (3.19). Diagnosis confirms Anemia. Iron supplements advised.',
                    status: 'Completed',
                    createdAt: '2025-04-12',
                    reportUrl: '/aig_report.png',
                    fileName: 'CBC_Anemic.jpg',
                    _id: 'rec_cbc_001'
                },
                {
                    recordId: '#REC-2025-CBC2',
                    date: '2025-04-13',
                    type: 'Lab',
                    doctor: 'Dr. Ramesh Mhatre',
                    hospital: 'Shree Diagnostic Clinical Lab',
                    diagnosis: 'CBC & WBC Analysis',
                    chiefComplaint: 'Post-viral recovery check',
                    results: 'Hb: 12.1 gm/dl, WBC: 13600 cells/cumm (High)',
                    status: 'Treated',
                    createdAt: '2025-04-13',
                    fileName: 'CBC_Report_Mhatre.pdf',
                    _id: 'rec_cbc_002'
                },
                {
                    recordId: '#REC-2025-CBC3',
                    date: '2025-04-14',
                    type: 'Lab Test',
                    doctor: 'Dr. Ramesh Mhatre',
                    hospital: 'K.P. Patil Building Lab',
                    diagnosis: 'Complete Blood Count (CBC)',
                    chiefComplaint: 'Routine checkup',
                    results: 'Hb: 11.6 gm/dl, WBC: 9200 cells/cumm',
                    status: 'Completed',
                    createdAt: '2025-04-14',
                    fileName: 'CBC_Routine_Report.pdf',
                    _id: 'rec_cbc_003'
                },
                {
                    recordId: '#REC-2025-PLT',
                    date: '2025-04-10',
                    type: 'Lab',
                    doctor: 'Dr. Bhavesh Chauhan',
                    hospital: 'Shree Diagnostic Center',
                    diagnosis: 'Hematology - Platelet Indices',
                    chiefComplaint: 'Bruising investigation',
                    results: 'Platelet Count: 125,000 /cumm, Hemoglobin: 11.0 gm%',
                    reportText: 'CLINICAL SUMMARY: Platelet count is lower than normal range. Observation for further bruising recommended. Re-test in 7 days.',
                    status: 'Active',
                    createdAt: '2025-04-10',
                    reportUrl: '/aig_report.png',
                    fileName: 'Platelet_Indices.jpg',
                    _id: 'rec_plt_001'
                },
                {
                    recordId: '#REC-1042',
                    date: '2025-03-28',
                    type: 'OPD',
                    doctor: 'Dr. R. Sharma',
                    hospital: 'AIIMS Delhi',
                    diagnosis: 'Seasonal Flu',
                    chiefComplaint: 'Fever, cough',
                    reportText: 'CLINICAL SUMMARY: Patient presenting with typical flu symptoms. Paracetamol and rest prescribed.',
                    status: 'Treated',
                    createdAt: '2025-03-28',
                    _id: '1'
                },
                {
                    recordId: '#REC-1038',
                    date: '2025-02-15',
                    type: 'Lab Test',
                    doctor: 'Dr. S. Patel',
                    hospital: 'Apollo Hospital',
                    diagnosis: 'Hypertension Checkup',
                    chiefComplaint: 'Routine BP check',
                    status: 'Active',
                    createdAt: '2025-02-15',
                    _id: '2'
                },
                {
                    recordId: '#REC-1025',
                    date: '2025-01-10',
                    type: 'Lab',
                    doctor: 'Dr. K. Singh',
                    hospital: 'Max Hospital',
                    diagnosis: 'Blood Test',
                    chiefComplaint: 'Annual health check',
                    status: 'Completed',
                    createdAt: '2025-01-10',
                    _id: '3'
                },
                {
                    recordId: '#REC-1019',
                    date: '2024-12-05',
                    type: 'OPD',
                    doctor: 'Dr. A. Gupta',
                    hospital: 'Safdarjung Hospital',
                    diagnosis: 'Appendicitis',
                    chiefComplaint: 'Abdominal pain',
                    status: 'Treated',
                    createdAt: '2024-12-05',
                    _id: '4'
                },
                {
                    recordId: '#REC-1005',
                    date: '2024-08-20',
                    type: 'Emergency',
                    doctor: 'Dr. V. Rao',
                    hospital: 'AIIMS Delhi',
                    diagnosis: 'Viral Fever',
                    chiefComplaint: 'High fever',
                    status: 'Completed',
                    createdAt: '2024-08-20',
                    _id: '5'
                }
            ];
            setRecords(mockRecords);
            // Uncomment for real API:
            // const { data } = await api.get('/records');
            // setRecords(data);
        } catch (err) {
            console.error('Fetch records error:', err);
            setError('Failed to load records');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const fetchConsents = useCallback(async () => {
        setLoading(true);
        try {
            const mockConsents = [
                { _id: 'c1', entityId: {name: 'AIIMS Delhi'}, accessGranted: true, updatedAt: '2025-03-28' },
                { _id: 'c2', entityId: {name: 'Apollo Hospital'}, accessGranted: false, updatedAt: '2025-02-15' },
                { _id: 'c3', entityId: {name: 'Max Hospital'}, accessGranted: true, updatedAt: '2025-01-10' },
                { _id: 'c4', entityId: {name: 'Dr. R. Sharma'}, accessGranted: true, updatedAt: '2024-12-05' },
                { _id: 'c5', entityId: {name: 'Safdarjung Hospital'}, accessGranted: false, updatedAt: '2024-08-20' }
            ];
            setConsents(mockConsents);
            const mockAuditLogs = [
                { id: 1, entity: 'Dr. R. Sharma', action: 'Viewed records', date: '2025-03-28 10:30', ip: '192.168.1.1' },
                { id: 2, entity: 'Apollo Hospital', action: 'Access denied', date: '2025-02-15 14:20', ip: '10.0.0.5' }
            ];
            setAuditLogs(mockAuditLogs);
            // Admin mocks (loaded for admin role)
            if (user?.role === 'admin') {
              // Already defined above as initial state
            }
        } catch (err) {
            setConsents(mockConsents);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const mockAppointments = [
                { _id: 'a1', date: '2024-08-15', doctor: 'Dr. V. Rao', reason: 'Appendicitis Surgery', hospital: 'Safdarjung Hospital', status: 'Completed' },
                { _id: 'a2', date: '2025-01-10', doctor: 'Dr. K. Singh', reason: 'Annual Checkup', hospital: 'Max Hospital', status: 'Completed' },
                { _id: 'a3', date: '2025-03-20', doctor: 'Dr. R. Sharma', reason: 'Flu Consultation', hospital: 'AIIMS Delhi', status: 'Completed' },
                { _id: 'a4', date: '2025-04-15', doctor: 'Dr. S. Patel', reason: 'Hypertension Follow-up', hospital: 'Apollo Hospital', status: 'Pending' }
            ];
            setAppointments(mockAppointments);
            const mockMonthlyVisits = [
                { month: 'Jan', visits: 2 },
                { month: 'Feb', visits: 1 },
                { month: 'Mar', visits: 3 },
                { month: 'Apr', visits: 1 },
                { month: 'Aug', visits: 2 }
            ];
            setMonthlyVisits(mockMonthlyVisits);
            const mockPrescriptions = [
                { rxId: 'RX-001', date: '2025-03-28', doctor: 'Dr. R. Sharma', medicines: 'Paracetamol 500mg, Cetirizine 10mg', duration: '5 days', status: 'Active' },
                { rxId: 'RX-002', date: '2025-02-15', doctor: 'Dr. S. Patel', medicines: 'Amlodipine 5mg', duration: 'Ongoing', status: 'Active' },
                { rxId: 'RX-003', date: '2025-01-10', doctor: 'Dr. K. Singh', medicines: 'Vitamin D3', duration: '30 days', status: 'Completed' }
            ];
            setPrescriptions(mockPrescriptions);
        } catch (err) {
            setAppointments(mockAppointments);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchRecords();
            fetchConsents();
            fetchAppointments();
        }
    }, [user, fetchRecords, fetchConsents, fetchAppointments]);

    const updateRecord = useCallback(async (recordId, updates) => {
      try {
        const { data } = await api.put(`/records/${recordId}`, updates);
        setRecords(prev => prev.map(r => r._id === recordId ? data.record : r));
        return data.record;
      } catch (error) {
        console.error('Update failed:', error);
        throw error;
      }
    }, []);

    return (
        <DashboardContext.Provider value={{
            activeSection, setActiveSection,
            adminActiveView, setAdminActiveView,
            adminStats, hospitals, users, adminAuditLogs, systemAlerts,
            patientTrends, deptDist,
            records, consents, appointments, prescriptions, monthlyVisits, auditLogs,
            loading, error,
            fetchRecords, fetchConsents, fetchAppointments, handleConsentToggle,
            showUploadModal, toggleUploadModal, handleUploadRecord,
            showViewModal, selectedRecord, toggleViewModal, setViewRecord,
            updateRecord
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

