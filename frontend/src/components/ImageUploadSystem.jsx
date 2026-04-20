import React, { useState } from 'react';
import axios from '../services/axios';
import { Upload, File, CheckCircle, AlertCircle, X, Image as ImageIcon, Loader2 } from 'lucide-react';

const ImageUploadSystem = () => {
    const [file, setFile] = useState(null);
    const [previews, setPreviews] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadedUrl, setUploadedUrl] = useState('');
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        // Basic validation
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Please select a valid image (JPG, PNG, WEBP) or PDF.');
            return;
        }

        setFile(selectedFile);
        setError(null);
        setUploadedUrl('');

        // Create preview
        if (selectedFile.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews([reader.result]);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            setPreviews([]); // No preview for PDF
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setProgress(0);

        const formData = new FormData();
        formData.append('file', file); // Field name must match backend 'file'

        try {
            // Using the base api service or direct axios
            const response = await axios.post('/upload/single', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                },
            });

            if (response.data.success) {
                setUploadedUrl(response.data.fileUrl);
                setFile(null);
                setPreviews([]);
            }
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.response?.data?.message || 'Upload failed. Check server status.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 font-sans">
            <div className="mb-8 flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
                    <Upload className="text-white w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cloud Storage</h2>
                    <p className="text-xs text-blue-600 font-black uppercase tracking-widest mt-0.5">Secure MERN File System</p>
                </div>
            </div>

            {/* Upload Area */}
            {!uploadedUrl ? (
                <div className="space-y-6">
                    <div 
                        className={`relative group border-2 border-dashed rounded-[2rem] p-10 transition-all text-center
                        ${file ? 'border-blue-400 bg-blue-50/30' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'}`}
                    >
                        <input 
                            type="file" 
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        
                        <div className="space-y-3">
                            <div className="w-16 h-16 bg-white rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                {file ? <File className="text-blue-600 w-8 h-8" /> : <ImageIcon className="text-slate-300 w-8 h-8" />}
                            </div>
                            
                            {file ? (
                                <div>
                                    <p className="text-slate-900 font-bold truncate max-w-[200px] mx-auto">{file.name}</p>
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-slate-900 font-bold">Pick a file to upload</p>
                                    <p className="text-xs text-slate-400">PDF, JPG, or PNG (Max 20MB)</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {uploading && (
                        <div className="space-y-2 px-2">
                            <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <span>Uploading Storage...</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                    >
                        {uploading ? <Loader2 className="animate-spin w-6 h-6" /> : <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />}
                        {uploading ? 'Processing...' : 'Upload To Server'}
                    </button>
                </div>
            ) : (
                /* Success State */
                <div className="space-y-6 text-center animate-in zoom-in-95 duration-300">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 bg-green-50 rounded-[2.5rem] mx-auto flex items-center justify-center border-2 border-green-100">
                            <CheckCircle className="text-green-500 w-16 h-16" />
                        </div>
                        <div className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                            <Sparkles size={16} />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Upload Ready!</h3>
                        <p className="text-xs text-slate-400 mt-1">Available at cloud-sync URL</p>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 group">
                        <div className="flex items-center gap-3 text-left">
                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Access URL</p>
                                <p className="text-xs font-mono text-blue-600 truncate bg-white p-2 rounded-lg border border-slate-200 group-hover:border-blue-200 transition-colors">
                                    {uploadedUrl}
                                </p>
                            </div>
                            <button 
                                onClick={() => window.open(uploadedUrl, '_blank')}
                                className="p-3 bg-white rounded-xl shadow-sm text-slate-600 hover:text-blue-600 transition-all border border-slate-100"
                            >
                                <ExternalLink size={20} />
                            </button>
                        </div>
                    </div>

                    {uploadedUrl.match(/\.(jpeg|jpg|gif|png|webp)$/) && (
                        <div className="rounded-3xl overflow-hidden border-2 border-slate-100 shadow-md">
                            <img src={uploadedUrl} alt="Uploaded" className="w-full h-48 object-cover" />
                        </div>
                    )}

                    <button 
                        onClick={() => setUploadedUrl('')}
                        className="text-xs font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors"
                    >
                        Upload Another File
                    </button>
                </div>
            )}
        </div>
    );
};

const Sparkles = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M19 17v4" /><path d="M3 5h4" /><path d="M17 19h4" />
    </svg>
);

const ExternalLink = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
    </svg>
);

export default ImageUploadSystem;
