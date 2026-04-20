import { useState } from 'react';
import { FileText, Download, AlertCircle, Loader2 } from 'lucide-react';

const FilePreview = ({ fileUrl, fileName = 'Document', className = '', onError }) => {
  const [loading, setLoading] = useState(true);
  const [previewError, setPreviewError] = useState(false);

  const getExtension = (name = fileUrl) => name.split('.').pop()?.toLowerCase() || '';

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(getExtension());
  const isPdf = getExtension() === 'pdf';

  const handleError = () => {
    setPreviewError(true);
    setLoading(false);
    onError?.();
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (previewError) {
    return (
      <div className={`flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 min-h-[400px] ${className}`}>
        <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Preview not available</h3>
        <p className="text-gray-500 mb-6 max-w-md text-center">
          {fileName} could not be previewed. Download for full view.
        </p>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Download className="w-4 h-4" />
          Download ({getExtension(fileName).toUpperCase() || 'FILE'})
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full min-h-[400px] rounded-2xl bg-white ${className}`}>
      {loading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gradient-to-br from-white to-indigo-50">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
          <p className="text-indigo-700 font-medium">Loading preview...</p>
        </div>
      )}

      {isImage ? (
        <img
          src={fileUrl}
          alt={fileName}
          className="w-full h-auto object-contain shadow-sm"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : isPdf ? (
        <iframe
          src={fileUrl}
          className="w-full h-full border-0"
          title={fileName}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <FileText className="w-20 h-20 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">{fileName}</p>
          <p className="text-gray-500 mb-6">Preview not supported</p>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all"
          >
            <Download className="w-4 h-4" />
            Download to View
          </button>
        </div>
      )}

      <button
        onClick={handleDownload}
        className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-200 opacity-0 group-hover:opacity-100 z-20"
        title="Download"
      >
        <Download className="w-5 h-5 text-gray-700" />
      </button>
    </div>
  );
};

export default FilePreview;

