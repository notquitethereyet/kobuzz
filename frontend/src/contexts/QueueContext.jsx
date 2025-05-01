import { createContext, useState, useContext, useEffect, useRef } from 'react';
import api from '../services/api';

const QueueContext = createContext();

export const useQueue = () => useContext(QueueContext);

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState([]);
  const [downloadStatus, setDownloadStatus] = useState({
    active: false,
    total: 0,
    completed: 0,
    current_item: null,
    errors: [],
    zip_file: null,
    download_complete: false,
    last_download_time: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(false);
  const pollingIntervalRef = useRef(null);

  // Stop polling function - defined early to avoid dependency issues
  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsPolling(false);
  };

  // Handle polling for download status
  useEffect(() => {
    const fetchDownloadStatus = async () => {
      try {
        const response = await api.get('/download/status');
        setDownloadStatus(response.data);

        // If download is complete, stop polling
        if (!response.data.active && isPolling) {
          stopPolling();
        }
      } catch (err) {
        console.error('Error fetching download status:', err);
      }
    };

    // Initial fetch
    fetchDownloadStatus();

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [isPolling]);

  // Start polling function
  const startPolling = () => {
    if (!isPolling) {
      setIsPolling(true);
      // Poll every 1 second for more responsive updates
      pollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await api.get('/download/status');
          setDownloadStatus(response.data);

          // Log the status for debugging
          console.log('Download status:', response.data);

          // If download is complete, stop polling
          if (!response.data.active) {
            stopPolling();
          }
        } catch (err) {
          console.error('Error polling download status:', err);
        }
      }, 1000);
    }
  };

  const addToQueue = (items) => {
    if (!Array.isArray(items)) {
      items = [items];
    }
    setQueue([...queue, ...items]);
  };

  const removeFromQueue = (index) => {
    const newQueue = [...queue];
    newQueue.splice(index, 1);
    setQueue(newQueue);
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const resetDownloadStatus = async () => {
    try {
      const response = await api.post('/download/clear');
      if (response.data.success) {
        setDownloadStatus({
          active: false,
          total: 0,
          completed: 0,
          current_item: null,
          errors: [],
          zip_file: null,
          download_complete: false,
          last_download_time: null
        });
        return true;
      } else {
        console.error('Error clearing downloads:', response.data.message);
        return false;
      }
    } catch (err) {
      console.error('Error clearing downloads:', err);
      return false;
    }
  };

  const startDownload = async (quality, directory, embedArt) => {
    if (queue.length === 0) {
      setError('Queue is empty');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const urls = queue.map(item => item.url);
      const response = await api.post('/download', {
        urls,
        quality,
        directory,
        embed_art: embedArt
      });
      setDownloadStatus(response.data.status);

      // Start polling when download starts
      if (response.data.status.active) {
        startPolling();
      }

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Download failed');
      setLoading(false);
      throw err;
    }
  };

  // Fetch download status - used for manual refresh
  const getDownloadStatus = async () => {
    try {
      const response = await api.get('/download/status');
      setDownloadStatus(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get download status');
      throw err;
    }
  };

  const value = {
    queue,
    downloadStatus,
    loading,
    error,
    isPolling,
    addToQueue,
    removeFromQueue,
    clearQueue,
    startDownload,
    getDownloadStatus,
    startPolling,
    stopPolling,
    resetDownloadStatus
  };

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
};

export default QueueContext;
