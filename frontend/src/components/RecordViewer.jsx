import { useState } from 'react';
import { FileText, Image, Download, AlertCircle } from 'lucide-react';

const RecordViewer = ({ url, fileName = 'Document', className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getExtension = (name = url) => {
    return name.split('.').pop()?.toLowerCase();
  };

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(getExtension());
  const isPdf = getExtension() === 'pdf';

  const handleError = () => {
    setError(true);
    setLoading(false);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 ${className}`}>
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading file</h3>
        <p className="text-gray-500 mb-6">Unable to display {fileName}</p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download File
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 shadow-lg bg-white ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white to-blue-50">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}

      {isImage ? (
        <img
          src={url}
          alt={fileName}
          className="w-full h-full object-contain"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : isPdf ? (
        <embed
          src={url}
          type="application/pdf"
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <iframe
          src={url}
          className="w-full h-full"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}

      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
        title="Download"
      >
        <Download className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default RecordViewer;

