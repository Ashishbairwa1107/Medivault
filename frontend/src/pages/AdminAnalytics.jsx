import React from 'react';
import { useDashboard } from '../store/DashboardContext';
import AdminStatCard from '../components/ui/AdminStatCard';
import { 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';
import { Activity, Users, Stethoscope, Building2, FileText } from 'lucide-react';

// Mock chart data
const growthData = [
  { month: 'Jan', platform: 1200, patients: 800 },
  { month: 'Feb', platform: 1800, patients: 1200 },
  { month: 'Mar', platform: 2500, patients: 1800 },
  { month: 'Apr', platform: 3200, patients: 2400 },
  { month: 'May', platform: 3800, patients: 2900 }
];

const userDistData = [{ name: 'Patients', value: 62 }, { name: 'Doctors', value: 28 }, { name: 'Hospitals', value: 8 }, { name: 'Admin', value: 2 }];
const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd'];

const AdminAnalytics = () => {
  const { adminStats } = useDashboard();

  return (
    <div style={{ padding: 28 }}>
      <header style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
          <Activity size={32} style={{ color: '#1e40af' }} />
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Fraunces, serif', color: '#1e40af', margin: 0 }}>
            Analytics Dashboard
          </h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: 600 }}>
          System-wide metrics and growth trends for MediVault platform. Updated live.
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'white', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', minHeight: 200 }}>
          <AdminStatCard title="Registered Patients" value={adminStats.patients.value} growth={adminStats.patients.growth} change={adminStats.patients.change} />
        </div>
        <div style={{ background: 'white', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', minHeight: 200 }}>
          <AdminStatCard title="Verified Doctors" value={adminStats.doctors.value} growth={adminStats.doctors.growth} change={adminStats.doctors.change} />
        </div>
        <div style={{ background: 'white', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', minHeight: 200 }}>
          <AdminStatCard title="Partner Hospitals" value={adminStats.hospitals.value} growth={adminStats.hospitals.growth} change={adminStats.hospitals.change} />
        </div>
        <div style={{ background: 'white', padding: 24, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9', minHeight: 200 }}>
          <AdminStatCard title="Medical Records" value={adminStats.records.value} growth={adminStats.records.growth} change={adminStats.records.change} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, height: 400 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Fraunces, serif', color: '#1e40af', marginBottom: 20 }}>
            Platform Growth (2024–2025)
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tickMargin={12} />
              <YAxis axisLine={false} tickLine={false} tickMargin={12} />
              <Tooltip />
              <Line type="monotone" dataKey="platform" stroke="#1e40af" strokeWidth={3} dot={false} name="Platform Users" />
              <Line type="monotone" dataKey="patients" stroke="#3b82f6" strokeWidth={3} dot={false} name="Patients" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Fraunces, serif', color: '#1e40af', marginBottom: 20 }}>
            User Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={userDistData} cx="50%" cy="50%" outerRadius={90} dataKey="value">
                {userDistData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;

