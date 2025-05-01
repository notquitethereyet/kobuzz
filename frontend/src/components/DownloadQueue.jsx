import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueue } from '../contexts/QueueContext';
import api from '../services/api';

const DownloadQueue = ({ darkMode }) => {
  const navigate = useNavigate();
  const {
    queue,
    removeFromQueue,
    clearQueue,
    startDownload,
    downloadStatus,
    isPolling,
    resetDownloadStatus,
    getDownloadStatus
  } = useQueue();

  const [quality, setQuality] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [settings, setSettings] = useState(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Fetch settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings');
        setSettings(response.data);
        setQuality(response.data.quality);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  // Set up periodic status check
  useEffect(() => {
    const checkDownloadStatus = async () => {
      try {
        await getDownloadStatus();
      } catch (err) {
        console.error('Error checking download status:', err);
      }
    };

    // Initial check
    checkDownloadStatus();

    // Set up a periodic check for download status
    const statusInterval = setInterval(checkDownloadStatus, 2000);

    return () => {
      clearInterval(statusInterval);
    };
  }, [getDownloadStatus]);

  // No need for polling here as it's handled in the QueueContext

  const handleStartDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      await startDownload(quality, settings?.download_dir, settings?.embed_art);
    } catch (err) {
      setError(err.message || 'Failed to start download');
    } finally {
      setLoading(false);
    }
  };

  const handleClearQueue = () => {
    setClearDialogOpen(true);
  };

  const confirmClearQueue = () => {
    clearQueue();
    setClearDialogOpen(false);
  };

  const handleCheckStatus = async () => {
    try {
      await getDownloadStatus();
      console.log('Current download status:', downloadStatus);
    } catch (err) {
      console.error('Error checking status:', err);
    }
  };

  const handleStartNewDownload = async () => {
    try {
      setLoading(true);
      const success = await resetDownloadStatus();
      if (success) {
        // Navigate to the Search page
        navigate('/search');
      }
    } catch (err) {
      console.error('Error starting new download:', err);
    } finally {
      setLoading(false);
    }
  };

  const qualityOptions = [
    { value: 5, label: 'MP3 (320 kbps)' },
    { value: 6, label: 'FLAC (16-bit / 44.1kHz - CD Quality)' },
    { value: 7, label: 'FLAC (24-bit / ≤96kHz - Hi-Res)' },
    { value: 27, label: 'FLAC (24-bit / >96kHz - Hi-Res Studio)' }
  ];

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Download Queue
        </h1>
        <div className="flex items-center space-x-2">
          {downloadStatus.zip_file && (
            <a
              href={`${api.defaults.baseURL}/download/zip`}
              className={`px-3 py-1 text-sm ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white rounded`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              Download ZIP
            </a>
          )}
          <button
            onClick={handleCheckStatus}
            className={`px-3 py-1 text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded`}
          >
            Check Status
          </button>
        </div>
      </div>

      {/* Debug output */}
      <div className={`mb-4 p-2 text-xs font-mono ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-100 text-gray-700'} rounded overflow-auto`} style={{maxHeight: '100px'}}>
        <pre>
          {JSON.stringify(downloadStatus, null, 2)}
        </pre>
      </div>

      {downloadStatus.active ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Download in Progress
          </h2>
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <p className={`mr-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Progress: {downloadStatus.completed} / {downloadStatus.total}
              </p>
              {isPolling && (
                <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </div>
            {downloadStatus.current_item && (
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Currently downloading: {downloadStatus.current_item}
              </p>
            )}
          </div>
          {downloadStatus.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-red-500 font-medium mb-2">Errors:</h3>
              <ul className="space-y-1">
                {downloadStatus.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-400">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : downloadStatus.zip_file ? (
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Download Complete
          </h2>
          <div className="mb-4">
            <p className={`mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Your download has been completed and is ready for download.
            </p>
            <a
              href={`${api.defaults.baseURL}/download/zip`}
              className={`inline-flex items-center px-4 py-2 ${darkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
              download
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download ZIP File
            </a>

            <button
              onClick={handleStartNewDownload}
              disabled={loading}
              className={`ml-4 inline-flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Start New Download
            </button>
          </div>
          {downloadStatus.errors.length > 0 && (
            <div className="mt-4">
              <h3 className="text-red-500 font-medium mb-2">Errors:</h3>
              <ul className="space-y-1">
                {downloadStatus.errors.map((error, index) => (
                  <li key={index} className="text-sm text-red-400">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        queue.length > 0 ? (
          <>
            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none ${darkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
                  >
                    {qualityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <button
                    onClick={handleStartDownload}
                    disabled={loading || queue.length === 0}
                    className={`w-full flex justify-center items-center py-2 px-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || queue.length === 0) ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </div>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Download
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <button
                    onClick={handleClearQueue}
                    disabled={queue.length === 0}
                    className={`w-full flex justify-center items-center py-2 px-4 border ${darkMode ? 'border-red-500 text-red-500 hover:bg-red-500 hover:bg-opacity-10' : 'border-red-500 text-red-500 hover:bg-red-50'} font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${queue.length === 0 ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Queue
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
            </div>

            <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden`}>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {queue.map((item, index) => (
                  <li key={index} className="p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.text}</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.url}</p>
                      </div>
                      <button
                        onClick={() => removeFromQueue(index)}
                        className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        aria-label="Remove from queue"
                      >
                        <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-8 text-center`}>
            <h2 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Your download queue is empty
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Search for music and add items to your queue to download them.
            </p>
            <Link
              to="/search"
              className={`inline-flex items-center px-4 py-2 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            >
              Go to Search
            </Link>
          </div>
        )
      )}

      {/* Confirmation Dialog */}
      {clearDialogOpen && (
        <>
          {/* Backdrop - higher z-index to ensure it's on top */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setClearDialogOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Modal Dialog - even higher z-index */}
          <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen p-4">
              <div
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-md w-full mx-auto shadow-xl overflow-hidden`}
                onClick={(e) => e.stopPropagation()} // Prevent clicks from closing the modal
              >
                <div className="px-6 pt-6 pb-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                      <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3
                        className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}
                        id="modal-title"
                      >
                        Clear Download Queue
                      </h3>
                      <div className="mt-2">
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                          Are you sure you want to clear the download queue? This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`px-6 py-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'} flex justify-end space-x-3`}>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md text-sm font-medium ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    onClick={() => setClearDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded-md text-sm font-medium bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={confirmClearQueue}
                  >
                    Clear Queue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DownloadQueue;
