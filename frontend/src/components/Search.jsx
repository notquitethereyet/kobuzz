import { useState } from 'react';
import api from '../services/api';
import { useQueue } from '../contexts/QueueContext';

const Search = ({ darkMode }) => {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('album');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '' });

  const { addToQueue } = useQueue();

  const handleSearch = async (e) => {
    e.preventDefault();

    // Client-side validation for minimum query length
    if (!query.trim()) return;
    if (query.trim().length < 3) {
      setError('Search query must be at least 3 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/search', {
        params: { query, type, limit }
      });
      setResults(response.data);
    } catch (err) {
      // Handle the specific error for short/invalid queries
      if (err.response?.data?.error?.includes('too short or invalid')) {
        setError('Your search query is too short or invalid. Please use at least 3 characters and try again.');
      } else {
        setError(err.response?.data?.error || 'Search failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToQueue = (item) => {
    addToQueue(item);
    setNotification({
      show: true,
      message: `Added "${item.text}" to download queue`
    });

    // Auto-hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ show: false, message: '' });
    }, 3000);
  };

  return (
    <div className="w-full">
      <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Search
      </h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Search Query
            </label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              required
              minLength={3}
              className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none ${darkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
              placeholder="Enter artist, album, track or playlist (min. 3 characters)"
            />
            <p className={`mt-1 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Use at least 3 characters for better search results
            </p>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none ${darkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
            >
              <option value="album">Albums</option>
              <option value="track">Tracks</option>
              <option value="artist">Artists</option>
              <option value="playlist">Playlists</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Limit
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className={`w-full px-3 py-2 border ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'} rounded-md focus:outline-none ${darkMode ? 'focus:ring-blue-500 focus:border-blue-500' : 'focus:ring-blue-500 focus:border-blue-500'}`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium mb-1 opacity-0">
              Search
            </label>
            <button
              type="submit"
              disabled={loading || query.trim().length < 3}
              className={`w-full flex justify-center items-center py-2 px-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${(loading || query.trim().length < 3) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Searching...
                </div>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-sm fade-in">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Search Error</h3>
              <div className="mt-1 text-sm text-red-700">
                {error}
              </div>
              {error.includes('Not authenticated') && (
                <div className="mt-2">
                  <p>Please log out and log back in to authenticate with the server.</p>
                  <button
                    onClick={() => window.location.href = '/login'}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Go to Login
                  </button>
                </div>
              )}
              {error.includes('too short or invalid') && (
                <div className="mt-2">
                  <p className="text-sm text-red-700">Try using more specific search terms or check for typos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((item, index) => {
            const [artist, ...rest] = item.text.split(' - ');
            const details = rest.join(' - ');

            // Extract year if present (typically in format YYYY or (YYYY))
            const yearMatch = details.match(/\(?(\d{4})\)?/);
            const year = yearMatch ? yearMatch[1] : null;

            // Extract bit depth and sampling rate information
            const isHiRes = item.text.includes('HI-RES');
            const is24Bit = item.text.includes('24BIT') || isHiRes; // HI-RES is typically 24-bit
            const is16Bit = !is24Bit && item.text.includes('LOSSLESS');
            const bitDepth = is24Bit ? '24-bit' : (is16Bit ? '16-bit' : '');

            // Extract sampling rate - try to find it in the text first
            let samplingRate = '';
            const samplingRateMatch = item.text.match(/(\d+(?:\.\d+)?)kHz/);

            if (samplingRateMatch) {
              samplingRate = samplingRateMatch[0];
            } else if (item.text.includes('192kHz')) {
              samplingRate = '192kHz';
            } else if (item.text.includes('96kHz')) {
              samplingRate = '96kHz';
            } else if (item.text.includes('48kHz')) {
              samplingRate = '48kHz';
            } else if (is16Bit) {
              samplingRate = '44.1kHz';
            } else if (isHiRes) {
              // Default for HI-RES if no specific rate is found
              samplingRate = '96kHz';
            }

            return (
              <div
                key={index}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow overflow-hidden flex flex-col h-full`}
              >
                <div className="p-6 flex-grow">
                  <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {artist}
                  </h3>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {details}
                    {year && !details.includes(year) && (
                      <span className="ml-1 text-xs font-medium">({year})</span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {item.text.includes('HI-RES') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        HI-RES {bitDepth}/{samplingRate}
                      </span>
                    )}
                    {item.text.includes('LOSSLESS') && !item.text.includes('HI-RES') && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        LOSSLESS {bitDepth}/{samplingRate}
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-6 pb-4">
                  <button
                    onClick={() => handleAddToQueue(item)}
                    className={`w-full flex justify-center items-center py-2 px-4 ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add to Queue
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !loading && (
          <div className={`text-center py-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <p>No results found. Try a different search query.</p>
          </div>
        )
      )}

      {/* Notification */}
      {notification.show && (
        <div className="fixed bottom-4 right-4 max-w-md bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Search;
