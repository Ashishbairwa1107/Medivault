import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Clock, Search, Eye, 
  EyeOff, Lock, ChevronRight, LayoutDashboard, 
  Filter, FileText, Calendar, User, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/axios';
import toast from 'react-hot-toast';
import ViewReportModal from '../../components/ViewReportModal';

const DUMMY_CONSENTS = [
  { "id": "1", "name": "Arjun Mehta", "upid": "UPID-9921-X", "status": "active", "granted": "12 Apr 2026", "expiry": "12 Apr 2027" },
  { "id": "2", "name": "Priya Das", "upid": "UPID-4452-B", "status": "revoked", "granted": "05 Jan 2026", "expiry": "05 Jan 2027" },
  { "id": "3", "name": "Siddharth Rao", "upid": "UPID-1120-Y", "status": "expired", "granted": "10 Feb 2025", "expiry": "10 Feb 2026" },
  { "id": "4", "name": "Ananya Iyer", "upid": "UPID-8839-M", "status": "active", "granted": "18 Apr 2026", "expiry": "18 Apr 2027" }
];

const MOCK_REPORTS = [
  "/assets/reports/aig_report_sample.jpg"
];

const ConsentAccess = () => {
    const [consents, setConsents] = useState(DUMMY_CONSENTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(false);
    
    // Detailed Report Modal
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFetchingReport, setIsFetchingReport] = useState(false);

    // Filter Logic
    const filteredConsents = consents.filter(c => {
        const matchesSearch = 
            c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            c.upid.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'all' || c.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        active: consents.filter(c => c.status === 'active').length,
        revoked: consents.filter(c => c.status === 'revoked').length,
        expired: consents.filter(c => c.status === 'expired').length
    };

    const handleViewReport = async (item) => {
        if (item.status.toLowerCase() !== 'active') {
            toast.error(`Access Denied: Permission for ${item.name} is ${item.status.toUpperCase()}`);
            return;
        }
        
        try {
            setIsFetchingReport(true);
            
            // Using the specific AIG report sample
            const reportUrl = "/assets/reports/aig_report_sample.jpg";

            setSelectedRecord({
                title: `LABORATORY INVESTIGATION REPORT | ${item.name}`,
                patientName: item.name,
                patientUpid: item.upid,
                diagnosis: "CBP (COMPLETE BLOOD PICTURE)",
                date: "18 Apr 2025",
                reportUrl: reportUrl,
                fileName: "aig_report_sample.jpg",
                reportText: `
LABORATORY INVESTIGATION REPORT
---------------------------------
Hospital: AIG Hospitals, Gachibowli
Ref. Doctor: Dr. ARABIND PANDA
Department: Haematology
Test: CBP (COMPLETE BLOOD PICTURE)

RESULTS DATA:
- HEMOGLOBIN: 13.7 g/dl (Ref: 13.0 - 17.0) [NORMAL]
- RBC: 4.51 cells/cumm (Ref: 4.5 - 5.5) [NORMAL]
- PCV: 42.6 % (Ref: 40.0 - 50.0) [NORMAL]
- MCV: 94.4 fl (Ref: 83.0 - 101.0) [NORMAL]
- MCH: 30.4 pg (Ref: 27.0 - 32.0) [NORMAL]
- MCHC: 32.2 g/dl (Ref: 31.5 - 34.5) [NORMAL]
- RDW: 12.8 % (Ref: 11.6 - 14) [NORMAL]
- TOTAL WBC: 8120 cells/cumm (Ref: 4000 - 10000) [NORMAL]

DIFFERENTIAL COUNT:
- NEUTROPHILS: 76.8 % (Ref: 40 - 80) [NORMAL]
- LYMPHOCYTES: 13.3 % (Ref: 20 - 40) [LOW 🔽]
- EOSINOPHILS: 0.3 % (Ref: 1.0 - 6.0) [LOW 🔽]
- MONOCYTES: 9.5 % (Ref: 2.0 - 10.0) [NORMAL]
- BASOPHILS: 0.1 % (Ref: 0 - 2.0) [NORMAL]

RECOMMENDATIONS:
Isolated Lymphopenia and Eosinopenia noted. Patient shows strong total WBC but skewed differential count. Clinical correlation advised for potential early stage viral infections or corticosteroid response.

---------------------------------
Verified by: AIG Hospitals Lab Services
Generated via MediVault Security Portal
                `,
                hospital: "AIG Hospitals, Gachibowli",
                hospitalId: { name: "AIG Hospitals" },
                doctorId: { name: "Dr. ARABIND PANDA" },
                status: "Completed"
            });
            setIsModalOpen(true);
        } catch (error) {
            console.error('Report fetch error:', error);
            toast.error("An unexpected error occurred while fetching the report.");
        } finally {
            setIsFetchingReport(false);
        }
    };

    return (
        <div className="p-1 min-h-screen animate-in fade-in duration-500">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                    <ShieldCheck className="w-10 h-10 text-blue-600" />
                    Patient Consent Access
                </h1>
                <p className="text-slate-500 font-semibold mt-1">Manage and view patient records based on digital consent.</p>
            </header>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
                >
                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Active Access</p>
                        <p className="text-3xl font-black text-slate-900">{stats.active}</p>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
                >
                    <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Revoked Access</p>
                        <p className="text-3xl font-black text-slate-900">{stats.revoked}</p>
                    </div>
                </motion.div>

                <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
                >
                    <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                        <Clock className="w-8 h-8 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest">Expired Access</p>
                        <p className="text-3xl font-black text-slate-900">{stats.expired}</p>
                    </div>
                </motion.div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by Patient Name or UPID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-xl focus:outline-none transition-all font-semibold shadow-inner"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <Filter className="w-5 h-5 text-slate-400" />
                    <select 
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-6 py-3 bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 border-2 rounded-xl focus:outline-none font-bold text-slate-600 transition-all cursor-pointer"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="revoked">Revoked</option>
                        <option value="expired">Expired</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Patient Info</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">UPID</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Granted Date</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Expiry Date</th>
                                <th className="px-6 py-4 text-center text-xs font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence mode="popLayout">
                                {filteredConsents.map((item, index) => (
                                    <motion.tr 
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-slate-50/80 transition-colors group"
                                    >
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 font-black text-sm group-hover:scale-110 transition-transform">
                                                    {item.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-slate-900">{item.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className="font-mono text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                                {item.upid}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5">
                                            {item.status.toLowerCase() === 'active' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Active
                                                </span>
                                            )}
                                            {item.status.toLowerCase() === 'revoked' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> Revoked
                                                </span>
                                            )}
                                            {item.status.toLowerCase() === 'expired' && (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full"></span> Expired
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-slate-500 font-bold text-sm tracking-tight">{item.granted}</td>
                                        <td className="px-6 py-5 text-slate-500 font-bold text-sm tracking-tight">{item.expiry}</td>
                                        <td className="px-6 py-5 text-center">
                                            {item.status.toLowerCase() === 'active' ? (
                                                <button 
                                                    onClick={() => handleViewReport(item)}
                                                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center gap-2 mx-auto"
                                                >
                                                    <Eye size={14} /> View Report
                                                </button>
                                            ) : (
                                                <button 
                                                    disabled 
                                                    className="px-5 py-2.5 bg-slate-100 text-slate-400 font-black text-xs rounded-xl cursor-not-allowed border border-slate-200 flex items-center gap-2 mx-auto"
                                                >
                                                    {item.status === 'revoked' ? <Lock size={14} /> : <Clock size={14} />}
                                                    Access {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </button>
                                            )}
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Records Modal */}
            <ViewReportModal 
                isOpen={isModalOpen} 
                record={selectedRecord} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};

export default ConsentAccess;
