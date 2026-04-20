import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../store/DashboardContext';
import { ShieldCheck, ShieldAlert, Users, FileSearch, Search, Filter, Calendar, UserCheck } from 'lucide-react';
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import DataTable from '../../components/hospital/DataTable';
import StatusBadge from '../../components/ui/StatusBadge';

// Mock consent data
const mockConsentsData = [
  { patientId: '#P-1042', patientName: 'Arjun Kumar', entity: 'Dr. R. Sharma', accessLevel: 'Full Record', duration: 'Permanent', status: 'Active', dept: 'Cardiology' },
  { patientId: '#P-1089', patientName: 'Priya Verma', entity: 'Dr. M. Patel', accessLevel: 'Lab Results Only', duration: '24 Hours', status: 'Active', dept: 'Neurology' },
  { patientId: '#P-1123', patientName: 'Rohit Singh', entity: 'Cardiology Dept', accessLevel: 'Prescription Only', duration: '7 Days', status: 'Expired', dept: 'Cardiology' },
  { patientId: '#P-1197', patientName: 'Meena Rao', entity: 'Apollo Hospital', accessLevel: 'Full Record', duration: 'Permanent', status: 'Revoked', dept: 'General' },
  { patientId: '#P-1256', patientName: 'Vikram Desai', entity: 'Dr. S. Mehta', accessLevel: 'Full Record', duration: 'One-time', status: 'Active', dept: 'Dermatology' },
  { patientId: '#P-1301', patientName: 'Anita Joshi', entity: 'Ortho Dept', accessLevel: 'Lab Results Only', duration: '24 Hours', status: 'Active', dept: 'Orthopaedics' },
  { patientId: '#P-1378', patientName: 'Rajesh Nair', entity: 'Dr. K. Nair', accessLevel: 'Prescription Only', duration: 'Permanent', status: 'Revoked', dept: 'General Surgery' },
  { patientId: '#P-1420', patientName: 'Sita Reddy', entity: 'Max Hospital', accessLevel: 'Full Record', duration: 'One-time', status: 'Active', dept: 'Cardiology' },
];

// Donut chart data
const consentDistData = [
  { name: 'Cardiology', value: 42, color: '#1e40af' },
  { name: 'General', value: 28, color: '#0d9488' },
  { name: 'OPD', value: 18, color: '#10b981' },
  { name: 'Neurology', value: 12, color: '#7c3aed' },
];

const COLORS = consentDistData.map(d => d.color);

const CustomTooltipConsent = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 16px', fontSize: '0.82rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
      }}>
        <p style={{ fontWeight: 700, color: 'var(--text)', marginBottom: 6 }}>{payload[0].payload.name}</p>
        <p style={{ color: payload[0].color }}>{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

// Audit History Modal Component
const AuditHistoryModal = ({ consent, onClose }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
    zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)',
  }} onClick={onClose}>
    <div onClick={e => e.stopPropagation()} style={{
      background: 'var(--surface)', borderRadius: 20, padding: 32, width: '90%', maxWidth: 600,
      boxShadow: '0 24px 60px rgba(0,0,0,0.25)', border: '1px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', background: '#1e40af', color: 'white',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700
        }}>
          📋
        </div>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Audit History - {consent.patientId}</h3>
          <p style={{ color: 'var(--text2)', margin: 4 }}>Access logs for {consent.patientName}</p>
        </div>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', fontSize: '1.6rem', cursor: 'pointer' }}>×</button>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {[
          { time: '2025-04-12 14:22', action: 'Record viewed', user: 'Dr. R. Sharma', ip: '192.168.1.105' },
          { time: '2025-04-12 11:45', action: 'Prescription accessed', user: 'Cardiology Dept', ip: '10.0.2.15' },
          { time: '2025-04-11 16:30', action: 'Consent granted', user: 'Patient', ip: '172.16.0.50' },
        ].map((log, i) => (
          <div key={i} style={{
            display: 'flex', gap: 12, padding: 16, background: 'var(--surface2)', borderRadius: 12, border: '1px solid var(--border)'
          }}>
            <div style={{ color: '#1e40af', fontSize: '0.9rem', fontWeight: 600, minWidth: 80 }}>{log.time}</div>
            <div style={{ fontWeight: 500 }}>{log.action}</div>
            <div style={{ marginLeft: 'auto', color: 'var(--text2)' }}>by {log.user}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ConsentOverview = () => {
  const { consents, adminAuditLogs } = useDashboard(); // Reuse context data
  const [data, setData] = useState(mockConsentsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedConsent, setSelectedConsent] = useState(null);

  useEffect(() => {
    let filtered = mockConsentsData;
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.patientId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.patientName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (statusFilter !== 'All') {
      filtered = filtered.filter(item => item.status === statusFilter);
    }
    setData(filtered);
  }, [searchQuery, statusFilter]);

  const statusColors = {
    Active: 'bg-green-100 text-green-800 border-green-200',
    Revoked: 'bg-red-100 text-red-800 border-red-200',
    Expired: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const statusBadge = (status) => (
    status === 'Active' ? (
      <StatusBadge variant="success">● Active</StatusBadge>
    ) : status === 'Revoked' ? (
      <StatusBadge variant="destructive">✗ Revoked</StatusBadge>
    ) : (
      <StatusBadge variant="secondary">○ Expired</StatusBadge>
    )
  );

  const columns = [
    { key: 'patientId', label: 'Patient ID / Name' },
    { key: 'entity', label: 'Authorized Entity' },
    { key: 'accessLevel', label: 'Access Level' },
    { key: 'duration', label: 'Duration' },
    { key: 'status', label: 'Status', render: statusBadge },
  ];

  return (
    <div className="fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: 0, fontFamily: 'Fraunces, serif' }}>
          Consent Management & Privacy
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text2)', marginTop: 6 }}>
          Data access permissions granted by patients · 8,420 active consents
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 32 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ShieldCheck size={24} style={{ color: '#10b981' }} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>8,420</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Total Consents</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <FileSearch size={24} style={{ color: '#f59e0b' }} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>124</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Pending Requests</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <ShieldAlert size={24} style={{ color: '#ef4444' }} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>56</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Revoked Access</div>
            </div>
          </div>
        </div>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Users size={24} style={{ color: '#1e40af' }} />
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text)' }}>23</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text2)' }}>Active Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Consent Distribution Chart */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 28, marginBottom: 32 }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 20 }}>Consent Distribution by Department</h4>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={consentDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
              {consentDistData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltipConsent />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--surface2)', borderRadius: 12, padding: '12px 20px', border: '1px solid var(--border)' }}>
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by Patient ID or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'var(--surface2)', borderRadius: 12, padding: '12px 20px', border: '1px solid var(--border)' }}>
          <Filter size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.9rem' }}
          >
            <option>All</option>
            <option>Active</option>
            <option>Revoked</option>
            <option>Expired</option>
          </select>
        </div>
      </div>

      {/* Consent Audit Table */}
      <DataTable
        title={`Consent Audit Log (${data.length} found)`}
        columns={columns}
        data={data}
        searchKey="name" // Handled externally
        renderActions={(row) => (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setSelectedConsent(row)}
            style={{ fontSize: '0.8rem' }}
          >
            📜 View Audit History
          </button>
        )}
        emptyMsg="No consents match the current filters."
      />

      {selectedConsent && (
        <AuditHistoryModal consent={selectedConsent} onClose={() => setSelectedConsent(null)} />
      )}
    </div>
  );
};

export default ConsentOverview;

