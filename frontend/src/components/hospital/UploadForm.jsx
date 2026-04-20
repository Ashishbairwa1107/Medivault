import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Loader2, CheckCircle } from 'lucide-react';
// import { Toaster, toast } from 'react-hot-toast'; // Fixed: react-hot-toast installed
import api from '../../services/axios';

const REPORT_TYPES = ['Blood Test', 'X-Ray', 'CT Scan', 'MRI', 'Ultrasound', 'ECG', 'Pathology', 'Biopsy'];

/**
 * UploadForm — Drop-zone + form for uploading patient medical reports.
 * Props: onSuccess(reportId) — callback after successful upload
 */
const UploadForm = ({ onSuccess }) => {
    const [patientId, setPatientId] = useState('');
    const [reportType, setReportType] = useState('Blood Test');
    const [reportDate, setReportDate] = useState(new Date().toISOString().split('T')[0]);
    const [orderingDoctor, setOrderingDoctor] = useState('');
    const [notes, setNotes] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(null);
    const fileInputRef = useRef(null);

    const VALID_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

    const validateFile = useCallback((file) => {
        setFileError('');
        if (!file) return false;
        if (!VALID_TYPES.includes(file.type)) {
            setFileError('Only PDF, JPG, or PNG files are accepted.');
            return false;
        }
        if (file.size > MAX_SIZE) {
            setFileError('File must be under 10 MB.');
            return false;
        }
        return true;
    }, []);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (validateFile(file)) setSelectedFile(file);
        else { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (validateFile(file)) setSelectedFile(file);
    };

    const handleDragOver = (e) => { e.preventDefault(); setDragOver(true); };
    const handleDragLeave = () => setDragOver(false);

    const resetForm = () => {
        setPatientId('');
        setReportType('Blood Test');
        setReportDate(new Date().toISOString().split('T')[0]);
        setOrderingDoctor('');
        setNotes('');
        setSelectedFile(null);
        setFileError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleUpload = async () => {
        if (!patientId.trim()) return alert('Please enter a valid Patient ID.');
        if (!selectedFile) return alert('Please attach a file.');
        if (uploading) return;

        setUploading(true);
        setUploadSuccess(null);
        try {
            const formData = new FormData();
            formData.append('patientId', patientId.trim());
            formData.append('reportType', reportType);
            formData.append('reportDate', reportDate);
            formData.append('orderingDoctor', orderingDoctor);
            formData.append('notes', notes);
            formData.append('file', selectedFile);

            const response = await toast.promise(
                api.post('/api/records/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }),
                {
                    loading: 'Uploading report...',
                    success: <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Report uploaded! ID: {response.data.reportId}</span>,
                    error: <span>Upload failed: {err.response?.data?.message || 'Unknown error'}</span>
                }
            );

            const rid = response.data.reportId || `RPT-${Date.now()}`;
            if (onSuccess) onSuccess(rid);
            resetForm();
        } catch (err) {
            console.error('Upload error:', err);
            toast.error(err.response?.data?.message || 'Upload failed. Check patient ID or try again.');
        } finally {
            setUploading(false);
        }
    };

    const sizeKB = selectedFile ? (selectedFile.size / 1024).toFixed(1) : 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 860 }}>
            <Toaster position="top-right" />

            {/* Form Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 28px' }}>
                {/* Patient ID */}
                <div>
                    <label className="form-label">Patient ID *</label>
                    <input
                        className="form-input"
                        placeholder="e.g. MV-P001 or AP-2024-001"
                        value={patientId}
                        onChange={e => setPatientId(e.target.value)}
                        list="patient-suggestions"
                    />
                    <datalist id="patient-suggestions">
                        <option value="MV-P001" />
                        <option value="MV-P002" />
                        <option value="MV-P003" />
                        <option value="AP-2024-001" />
                        <option value="AP-2024-002" />
                    </datalist>
                </div>

                {/* Report Type */}
                <div>
                    <label className="form-label">Report Type *</label>
                    <div style={{ position: 'relative' }}>
                        <select
                            className="form-select"
                            value={reportType}
                            onChange={e => setReportType(e.target.value)}
                            style={{ paddingRight: 36 }}
                        >
                            {REPORT_TYPES.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.8rem', color: 'var(--text3)' }}>▾</span>
                    </div>
                </div>

                {/* Report Date */}
                <div>
                    <label className="form-label">Report Date *</label>
                    <input
                        type="date"
                        className="form-input"
                        value={reportDate}
                        onChange={e => setReportDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                    />
                </div>

                {/* Ordering Doctor */}
                <div>
                    <label className="form-label">Ordering Doctor</label>
                    <input
                        className="form-input"
                        placeholder="e.g. Dr. R. Sharma"
                        value={orderingDoctor}
                        onChange={e => setOrderingDoctor(e.target.value)}
                    />
                </div>

                {/* Notes — full width */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Clinical Notes</label>
                    <textarea
                        className="form-input"
                        placeholder="Optional notes for the report…"
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        rows={3}
                        style={{ resize: 'vertical' }}
                    />
                </div>

                {/* Drag & Drop zone — full width */}
                <div style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">Attach File * (PDF / JPG / PNG, max 10 MB)</label>
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        style={{
                            border: `2px dashed ${dragOver ? 'var(--primary)' : selectedFile ? '#16a34a' : 'var(--border)'}`,
                            borderRadius: 14,
                            padding: '32px 20px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            background: dragOver
                                ? 'var(--primary-light)'
                                : selectedFile
                                    ? '#f0fdf4'
                                    : 'var(--surface2)',
                            transition: 'border-color 0.2s, background 0.2s',
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                            onChange={handleFileSelect}
                        />
                        <div style={{ fontSize: '2.2rem', marginBottom: 10 }}>📎</div>
                        {selectedFile ? (
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
                                    ✅ {selectedFile.name}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>{sizeKB} KB • Click to replace</div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text2)', marginBottom: 4 }}>
                                    {dragOver ? 'Drop your file here' : 'Drag & drop or click to upload'}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>Supports PDF, JPG, PNG up to 10 MB</div>
                            </div>
                        )}
                    </div>
                    {fileError && (
                        <p style={{ color: 'var(--red)', fontSize: '0.8rem', marginTop: 6, fontWeight: 600 }}>⚠️ {fileError}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                    className="btn btn-primary"
                    onClick={handleUpload}
                    disabled={!patientId.trim() || !selectedFile || uploading || !!fileError}
                    style={{
                        opacity: (!patientId.trim() || !selectedFile || uploading || !!fileError) ? 0.6 : 1,
                        minWidth: 180,
                    }}
                >
                    {uploading ? (
                        <>
                            <div style={{
                                width: 15, height: 15, border: '2px solid transparent',
                                borderTop: '2px solid currentColor', borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                            }} />
                            Uploading…
                        </>
                    ) : '⬆ Upload Report'}
                </button>
                <button
                    className="btn btn-ghost"
                    onClick={resetForm}
                    disabled={uploading}
                >
                    Clear Form
                </button>
            </div>
        </div>
    );
};

export default UploadForm;
