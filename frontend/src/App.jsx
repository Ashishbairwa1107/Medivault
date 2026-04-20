
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './store/AuthContext';
import { AuthProvider } from './store/AuthContext';
import { DashboardProvider } from './store/DashboardContext';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import ImageUploadSystem from './components/ImageUploadSystem';
import PatientDashboardPage from './pages/patient/PatientDashboardPage';
import DashboardHome from './pages/patient/DashboardHome';
import Records from './pages/patient/Records';
import Prescriptions from './pages/patient/Prescriptions';
import Timeline from './pages/patient/Timeline';
import Consent from './pages/patient/Consent';
import Profile from './pages/patient/Profile';
import UpdateProfile from './pages/patient/UpdateProfile';
import Appointments from './pages/patient/Appointments';
import DoctorDashboardPage from './pages/doctor/DoctorDashboardPage';
import DoctorOverview from './pages/doctor/DoctorOverview';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import AddDiagnosis from './pages/doctor/AddDiagnosis';
import DoctorAuditLog from './pages/doctor/DoctorAuditLog';
import ConsentAccess from './pages/doctor/ConsentAccess';
import AppShell from './layouts/AppShell';
import HospitalDashboard from './pages/HospitalDashboard';
import HospitalAdminDashboard from './pages/hospital/HospitalAdminDashboard';
import HospitalOverview from './pages/hospital/HospitalOverview';
import HospitalDoctors from './pages/hospital/HospitalDoctors';
import HospitalPatients from './pages/hospital/HospitalPatients';
import HospitalUpload from './pages/hospital/HospitalUpload';
import ConsentOverview from './pages/hospital/ConsentOverview';
import AdminDashboard from './pages/AdminDashboard';
import SystemAdminDashboard from './pages/SystemAdminDashboard';


// Simple Loading Spinner Component
const LoadingSpinner = ({ message = "Loading..." }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    <p className="ml-4 text-lg">{message}</p>
  </div>
);

// Base protected route for all dashboards
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading: authLoading } = useAuth();
  if (authLoading) return <LoadingSpinner message="Loading dashboard..." />;
  if (!user) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

import Chatbot from './components/Chatbot';

function AppContent() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/test-upload" element={<div className="p-20 bg-slate-50 min-h-screen"><ImageUploadSystem /></div>} />
          
          {/* Patient Dashboard SPA - Nested Routing */}
          <Route 
            path="/patient" 
            element={
              <ProtectedRoute>
                <DashboardProvider>
                  <PatientDashboardPage />
                </DashboardProvider>
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="records" element={<Records />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="consent" element={<Consent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/update" element={<UpdateProfile />} />
            <Route path="appointments" element={<Appointments />} />
          </Route>
          
          {/* Doctor Dashboard SPA - Nested Routing */}
            <Route 
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DashboardProvider>
                    <DoctorDashboardPage />
                  </DashboardProvider>
                </ProtectedRoute>
              }
            >
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview"      element={<DoctorOverview />} />
            <Route path="patients"      element={<DoctorPatients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="appointments"  element={<DoctorAppointments />} />
            <Route path="add-diagnosis" element={<AddDiagnosis />} />
            <Route path="consent-access" element={<ConsentAccess />} />
            <Route path="audit"         element={<DoctorAuditLog />} />
          </Route>
          
          <Route 
            path="/hospital" 
            element={
              <ProtectedRoute allowedRoles={['hospital']}>
                <DashboardProvider>
                <HospitalDashboard />
              </DashboardProvider>
            </ProtectedRoute>
          } 
        >
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<HospitalOverview />} />
          <Route path="doctors" element={<HospitalDoctors />} />
          <Route path="patients" element={<HospitalPatients />} />
          <Route path="upload" element={<HospitalUpload />} />
          <Route path="consents" element={<ConsentOverview />} />
        </Route>

          {/* Admin */}
          <Route 
            path="/admin/*" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardProvider>
                  <AppShell>
                    <AdminDashboard />
                  </AppShell>
                </DashboardProvider>
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Chatbot />
      </ErrorBoundary>
    </Router>
  );
}

import { ThemeProvider } from './store/ThemeContext';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

