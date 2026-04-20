import { DashboardProvider } from './DashboardContext';

const PatientProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user || user.role !== 'patient') return <Navigate to="/" />;
  return <DashboardProvider><AppShell>{children}</AppShell></DashboardProvider>;
};
