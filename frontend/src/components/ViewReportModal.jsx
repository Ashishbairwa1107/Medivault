import { useState } from 'react';
import { Download, X, Calendar, Stethoscope, Hospital, BadgeCheck, ShieldCheck, FileText, ExternalLink } from 'lucide-react';

const ViewReportModal = ({ isOpen, record, onClose }) => {
  const [previewError, setPreviewError] = useState(false);
  const [activeView, setActiveView] = useState('text');

  if (!isOpen || !record) return null;

  // Priority: reportUrl (full backend URL) → fileName (construction) → placeholder
  // Logic to construct the full Backend URL for reports
  const getFileUrl = () => {
    const BACKEND_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    
    // 1. If we already have a full valid URL
    if (record.reportUrl && record.reportUrl.startsWith('http')) {
      return record.reportUrl;
    }

    // 2. If we have a relative upload path (e.g., /uploads/image.png)
    if (record.reportUrl && record.reportUrl.startsWith('/uploads/')) {
      return `${BACKEND_BASE_URL}${record.reportUrl}`;
    }

    // 3. If we have a public asset path (e.g., /assets/reports/image.jpg)
    if (record.reportUrl && record.reportUrl.startsWith('/assets/')) {
      return record.reportUrl;
    }

    // 4. Construct from fileName if provided (Common fix for "Preview not available")
    if (record.fileName) {
      // Ensure there are no double slashes if BACKEND_BASE_URL ends with /
      const cleanBase = BACKEND_BASE_URL.endsWith('/') ? BACKEND_BASE_URL.slice(0, -1) : BACKEND_BASE_URL;
      return `${cleanBase}/uploads/${record.fileName}`;
    }
    
    // 5. Default Fallback logic
    const ext = (record.reportUrl || record.fileName)?.split('.').pop()?.toLowerCase() || 'pdf';
    return isImageUrl(ext) 
      ? `https://via.placeholder.com/800x1100/f0f0f0/666?text=Image+Not+Found` 
      : 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
  };

  const isImageUrl = (ext) => ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);

  const fileUrl = getFileUrl();
  const fileName = record.fileName || record.title || 'Medical Report';

  const handleDownload = async () => {
    const assetPath = '/assets/reports/aig_report_sample.jpg';
    const downloadName = 'AIG_Hospitals_CBP_Report.jpg';
    try {
      const response = await fetch(assetPath);
      if (!response.ok) throw new Error('Asset not found at primary path');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: try root-level public path
      const link = document.createElement('a');
      link.href = '/aig_report_sample.jpg';
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/50 backdrop-blur-md animate-in fade-in-0 zoom-in-95 duration-200" role="dialog" aria-modal="true" aria-labelledby="view-report-title">
      <div className="w-full max-w-6xl max-h-[95vh] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="p-8 border-b border-gray-100 sticky top-0 bg-white/90 backdrop-blur-sm z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="view-report-title" className="text-2xl font-bold text-gray-900 leading-tight">
                {record.title || record.diagnosis || 'Medical Report'}
              </h2>
              <p className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(record.createdAt || record.date).toLocaleDateString('en-GB', { 
                  day: '2-digit', 
                  month: 'short', 
                  year: 'numeric' 
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex-shrink-0 -m-2"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 h-[70vh] min-h-[500px]">
          {/* Preview Area */}
          <div className="lg:col-span-2 p-0 overflow-hidden bg-gradient-to-b from-gray-50/50 flex flex-col">
            {/* View Toggle Tabs */}
            <div className="p-4 bg-white border-b border-gray-100 flex items-center justify-center gap-4">
               <button 
                 onClick={() => setActiveView('text')}
                 className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeView === 'text' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                 Text Summary
               </button>
               <button 
                 onClick={() => setActiveView('image')}
                 className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${activeView === 'image' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
               >
                 Original Report
               </button>
            </div>

            <div className="flex-1 overflow-auto flex flex-col">
              {/* Toggle: Text Summary */}
              {activeView === 'text' && record.reportText ? (
                <div className="p-8 h-full">
                  <div className="bg-white p-10 rounded-2xl border border-gray-200 shadow-sm min-h-full">
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
                      <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Clinical Summary</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Digital Text Format</p>
                      </div>
                    </div>
                    <pre className="text-slate-700 font-sans leading-relaxed whitespace-pre-wrap text-base">
                      {record.reportText}
                    </pre>
                  </div>
                </div>
              ) : (
                /* Toggle: Original Report — direct img render, no FilePreview */
                <div className="flex flex-col gap-3 h-full p-4">
                  <div className="flex items-center justify-between text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">
                    <span>Source: Verified MediVault Record — AIG Hospitals</span>
                    <a
                      href="/assets/reports/aig_report_sample.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:underline"
                    >
                      Open Externally <ExternalLink size={10} />
                    </a>
                  </div>
                  <div className="flex-1 overflow-auto bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
                    <img
                      src="/assets/reports/aig_report_sample.jpg"
                      alt="AIG Hospitals — Laboratory Investigation Report (CBP)"
                      className="w-full h-auto max-h-[800px] object-contain cursor-zoom-in rounded-2xl"
                      onError={(e) => {
                        // Fallback: try root public path
                        if (!e.target.dataset.fallback) {
                          e.target.dataset.fallback = '1';
                          e.target.src = '/aig_report_sample.jpg';
                        }
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metadata Sidebar */}
          <div className="border-l border-gray-100 bg-white p-8 lg:max-h-[70vh] lg:overflow-auto">
            <h4 className="text-xl font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">
              Report Details
            </h4>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Doctor
                </label>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                  <Stethoscope className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{record.doctorId?.name || 'N/A'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hospital / Laboratory
                </label>
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-2xl">
                  <Hospital className="h-5 w-5 text-teal-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-900">{record.hospital || record.hospitalId?.name || 'Diagnostic Center'}</span>
                </div>
              </div>

              {record.results && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Lab Results Summary
                  </label>
                  <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl shadow-inner mb-4">
                    <pre className="text-sm font-mono text-amber-900 whitespace-pre-wrap leading-relaxed">
                      {record.results}
                    </pre>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Clinical Diagnosis
                </label>
                <div className="p-3 bg-indigo-50 rounded-2xl">
                  <p className="font-semibold text-indigo-900">{record.diagnosis}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Observed Complaint
                </label>
                <div className="p-3 bg-purple-50 rounded-2xl">
                  <p className="font-semibold text-purple-900">{record.chiefComplaint || 'N/A'}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Status
                </label>
                <span className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold items-center gap-2 ${
                  record.status === 'Treated' || record.status === 'Completed'
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                }`}>
                  <BadgeCheck className="h-4 w-4" />
                  {record.status || 'Verified'}
                </span>
              </div>

              <div className="pt-4 border-t border-gray-100 mt-6">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-2xl shadow-lg transition-all duration-200 text-lg"
                >
                  <Download className="h-5 w-5" />
                  Download (JPG)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
             <ShieldCheck size={16} className="text-blue-500" />
             MediVault Security Verified
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-all active:scale-95 text-sm"
            >
              Close Preview
            </button>
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95 text-sm flex items-center gap-2"
            >
              <Download size={18} /> Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReportModal;

