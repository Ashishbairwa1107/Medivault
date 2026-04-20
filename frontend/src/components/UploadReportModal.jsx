import { useState, useRef, useCallback } from 'react';
import { CloudUpload, X, Loader2, CheckCircle } from 'lucide-react';

const UploadReportModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab Result',
    date: '',
    doctorName: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleClickUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const categories = ['Lab Result', 'Prescription', 'Imaging', 'Discharge Summary'];

  const resetForm = () => {
    setFormData({ title: '', category: 'Lab Result', date: '', doctorName: '' });
    setSelectedFile(null);
    setDragging(false);
    setUploading(false);
    setProgress(0);
    setError('');
  };

  const handleInputChange = useCallback((e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  }, []);

  const validateForm = () => {
    if (!formData.title.trim()) return 'Report title is required.';
    if (!formData.doctorName.trim()) return 'Doctor name is required.';
    if (!formData.date) return 'Date of issue is required.';
    if (!selectedFile) return 'Please select a file.';
    return null;
  };

  const validateFile = useCallback((file) => {
    const validTypes = {
      'application/pdf': 'PDF',
      'image/jpeg': 'JPG',
      'image/jpg': 'JPG',
      'image/png': 'PNG'
    };
    if (!validTypes[file.type]) return 'Only PDF, JPG, PNG files are supported.';
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return 'File size must be less than 10MB.';
    
    return null;
  }, []);

  const handleFileSelect = useCallback((file) => {
    const fileError = validateFile(file);
    if (fileError) {
      setError(fileError);
      return;
    }
    setSelectedFile(file);
    setError('');
  }, [validateFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleFileInput = useCallback((e) => {
    const file = e.target.files[0];
    if (file) handleFileSelect(file);
    // Reset input value for re-selection
    e.target.value = '';
  }, [handleFileSelect]);

  const handleSave = useCallback(async () => {
    const formError = validateForm();
    if (formError) {
      setError(formError);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError('');

    // Simulate upload progress
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(95, (elapsed / 3000) * 100 + Math.random() * 3);
      setProgress(newProgress);
      
      if (elapsed > 3000) {
        clearInterval(interval);
      }
    }, 100);

    // Mock backend upload
    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      
      // Success mock data
      const newRecord = {
        _id: `rec_${Date.now()}`,
        title: formData.title,
        category: formData.category,
        date: formData.date,
        doctorId: { name: formData.doctorName },
        hospitalId: { name: 'Self-Uploaded via Patient Portal' },
        diagnosis: formData.title,
        chiefComplaint: `${formData.category} report`,
        status: 'Uploaded',
        createdAt: new Date().toISOString(),
        fileName: selectedFile.name,
        fileUrl: `http://localhost:5000/uploads/${Date.now()}_${selectedFile.name}`,
        prescriptions: []
      };

      setTimeout(() => {
        onSuccess(newRecord);
        resetForm();
        onClose();
      }, 800);
    }, 3500);
  }, [formData, selectedFile, validateForm, onSuccess, onClose]);

  const handleCancel = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in-0 zoom-in-95 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleCancel}
    >
      <div 
        className="w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/50 max-h-[95vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 border-b border-gray-100 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="modal-title" className="text-2xl font-bold text-gray-900 leading-tight">
                Upload New Medical Report
              </h2>
              <p className="text-gray-600 mt-1 text-sm">Securely add to your personal health vault</p>
            </div>
            <button
              onClick={handleCancel}
              className="p-2 -m-2 rounded-2xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200"
              aria-label="Close upload modal"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-8 pb-12 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {/* Report Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Report Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder-gray-500"
              placeholder="e.g. Complete Blood Count Report - March 28, 2025"
              aria-required="true"
              autoComplete="off"
            />
          </div>

          {/* Row: Category + Date */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-5 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200"
                aria-required="true"
              >
                <option value="Lab Result">📊 Lab Result</option>
                <option value="Prescription">💊 Prescription</option>
                <option value="Imaging">📸 Imaging</option>
                <option value="Discharge Summary">📄 Discharge Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Date of Issue <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-5 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder-gray-500"
                aria-required="true"
              />
            </div>
          </div>

          {/* Doctor Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Issued By / Doctor Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="doctorName"
              value={formData.doctorName}
              onChange={handleInputChange}
              className="w-full px-5 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200 placeholder-gray-500"
              placeholder="Dr. Jane Smith, Internal Medicine"
              aria-required="true"
            />
          </div>

          {/* Drag & Drop Upload Area */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-4">
              Medical Report File <span className="text-red-500">*</span>
            </label>
            <div
              className={`group relative border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300 hover:border-indigo-400 hover:bg-indigo-50/30 ${
                dragging 
                  ? 'border-indigo-500 bg-indigo-50 ring-4 ring-indigo-500/20 scale-[1.02]' 
                  : 'border-gray-300 hover:border-gray-400 bg-white/50'
              } ${selectedFile ? 'border-green-300 bg-green-50/50' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClickUpload}
              role="button"
              tabIndex="0"
              aria-describedby="file-help"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf, image/jpeg, image/jpg, image/png"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileInput}
                aria-hidden="true"
              />
              
              {selectedFile ? (
                <div className="space-y-4">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto animate-bounce" />
                  <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6">
                    <div className="font-semibold text-xl text-green-900 truncate mb-1">{selectedFile.name}</div>
                    <div className="text-sm text-green-700 font-mono">{Math.round(selectedFile.size / 1024)} KB</div>
                  </div>
                  <button
                    onClick={() => setSelectedFile(null)}
                    className="text-sm text-gray-500 hover:text-gray-700 underline flex items-center gap-1 mx-auto"
                  >
                    <X className="h-4 w-4" />
                    Change file
                  </button>
                </div>
              ) : (
                <>
                  <CloudUpload className="mx-auto h-20 w-20 text-gray-400 group-hover:text-indigo-500 transition-transform duration-300 group-hover:scale-110 mb-6" />
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-gray-900 group-hover:text-indigo-900 transition-colors">
                      Drop your file here
                    </p>
                    <p className="text-lg text-gray-600 group-hover:text-gray-700">or click to browse</p>
                  </div>
                  <p id="file-help" className="text-sm text-gray-500 mt-4">
                    PDF, JPG, PNG • Maximum 10MB
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="p-6 bg-gray-50/50 rounded-2xl border-2 border-dashed border-indigo-200">
              <div className="flex items-center justify-center mb-4 gap-3">
                <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                <span className="text-xl font-semibold text-indigo-900">Uploading to secure vault...</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-600 h-4 rounded-full shadow-lg transition-all duration-500 flex items-center justify-center text-xs font-bold text-white"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                >
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-4 mt-6 px-8 py-6 bg-gradient-to-r from-gray-50 to-white/50 border-t border-gray-100 rounded-b-3xl backdrop-blur-sm sticky bottom-0 shadow-lg">
          <button
            onClick={handleCancel}
            className="flex-1 max-w-xs px-6 py-4 border border-gray-300 text-gray-700 rounded-2xl font-semibold text-sm uppercase tracking-wide hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={uploading || !formData.title.trim() || !selectedFile}
            className="flex-1 max-w-xs px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-2xl font-semibold text-sm uppercase tracking-wide shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-gray-400 disabled:hover:bg-gray-400 disabled:text-gray-200 flex items-center justify-center gap-2"
            aria-describedby="save-help"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Saving...
              </>
            ) : (
              'SAVE TO VAULT'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadReportModal;

