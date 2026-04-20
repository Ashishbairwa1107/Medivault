import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import api from '../../services/axios';
import toast from 'react-hot-toast';

const ReportUploader = () => {
    const [file, setFile] = useState(null);
    const [formData, setFormData] = useState({
        patientId: '',
        reportType: 'Blood Test',
        reportDate: new Date().toISOString().split('T')[0],
        diagnosis: '',
        notes: '',
        orderingDoctor: ''
    });
    const [loading, setLoading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            toast.error("Please select a file to upload");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('report', file); // 'report' matches backend multer field name
        data.append('patientId', formData.patientId);
        data.append('reportType', formData.reportType);
        data.append('reportDate', formData.reportDate);
        data.append('diagnosis', formData.diagnosis);
        data.append('notes', formData.notes);
        data.append('orderingDoctor', formData.orderingDoctor);

        try {
            const response = await api.post('/records/upload', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success("Report uploaded successfully!");
                setUploadSuccess(response.data.reportUrl);
                // Reset form
                setFile(null);
                setFormData({
                    patientId: '',
                    reportType: 'Blood Test',
                    reportDate: new Date().toISOString().split('T')[0],
                    diagnosis: '',
                    notes: '',
                    orderingDoctor: ''
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-3xl shadow-xl border border-slate-100">
            <div className="mb-8 flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-2xl">
                    <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Upload Medical Report</h2>
                    <p className="text-slate-500 font-medium">Link digital reports directly to patient UPID</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Patient UPID *</label>
                        <input 
                            type="text" 
                            name="patientId"
                            value={formData.patientId}
                            onChange={handleInputChange}
                            placeholder="e.g. UPID-001" 
                            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Report Type *</label>
                        <select 
                            name="reportType"
                            value={formData.reportType}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                        >
                            <option>Blood Test</option>
                            <option>CT Scan</option>
                            <option>MRI</option>
                            <option>X-Ray</option>
                            <option>Prescription</option>
                            <option>Discharge Summary</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Report Date *</label>
                        <input 
                            type="date" 
                            name="reportDate"
                            value={formData.reportDate}
                            onChange={handleInputChange}
                            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                            required
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Diagnosis / Title</label>
                        <input 
                            type="text" 
                            name="diagnosis"
                            value={formData.diagnosis}
                            onChange={handleInputChange}
                            placeholder="Brief description" 
                            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Ordering Doctor</label>
                        <input 
                            type="text" 
                            name="orderingDoctor"
                            value={formData.orderingDoctor}
                            onChange={handleInputChange}
                            placeholder="Dr. Name" 
                            className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold"
                        />
                    </div>
                    
                    {/* File Dropzone */}
                    <div className="relative">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Report File (PDF/Image) *</label>
                        <div className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all ${file ? 'border-green-300 bg-green-50' : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'}`}>
                            <input 
                                type="file" 
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {file ? (
                                <div className="text-center animate-in zoom-in duration-300">
                                    <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-800 truncate max-w-[200px]">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-slate-500">Click or drag to upload</p>
                                    <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 10MB</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Full Width */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Additional Notes</label>
                    <textarea 
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                        rows="3" 
                        className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-semibold resize-none"
                    ></textarea>
                </div>

                <div className="md:col-span-2">
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 rounded-2xl font-black text-white shadow-xl shadow-blue-100 flex items-center justify-center gap-3 transition-all transform active:scale-95 ${loading ? 'bg-slate-400' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-2xl hover:shadow-blue-200'}`}
                    >
                        {loading ? (
                            <><Loader2 className="w-6 h-6 animate-spin" /> Uploading...</>
                        ) : (
                            <><Upload className="w-6 h-6" /> Submit Medical Report</>
                        )}
                    </button>
                    
                    {uploadSuccess && (
                        <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                           <p className="text-emerald-700 text-sm font-bold flex items-center gap-2">
                             <CheckCircle className="w-5 h-5" /> File Uploaded Successfully!
                           </p>
                           <a 
                             href={uploadSuccess} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="text-blue-600 text-xs font-bold underline mt-1 block truncate"
                           >
                             View File: {uploadSuccess}
                           </a>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ReportUploader;
