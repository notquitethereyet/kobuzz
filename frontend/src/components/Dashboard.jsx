import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useQueue } from '../contexts/QueueContext';

const Dashboard = ({ darkMode }) => {
  const { user } = useAuth();
  const { queue, downloadStatus, isPolling } = useQueue();

  const features = [
    {
      title: 'Search',
      description: 'Search for albums, tracks, artists, and playlists on Qobuz',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      link: '/search'
    },
    {
      title: 'Download Queue',
      description: 'Manage your download queue',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      ),
      link: '/queue'
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      link: '/settings'
    }
  ];

  return (
    <div className="w-full fade-in">
      <div className="mb-10">
        <div className="flex items-center mb-3">
          <img
            src={darkMode ? "/dark.svg" : "/light.svg"}
            alt="Ko-buzz Logo"
            className="h-12 w-12 mr-4 logo-pulse"
          />
          <div>
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#0f172a]'}`}>
              Welcome to Ko-buzz
            </h1>
            <p className={`mt-1 ${darkMode ? 'text-[#cbd5e1]' : 'text-[#64748b]'}`}>
              A modern GUI for qobuz-dl
            </p>
          </div>
        </div>
      </div>

      {user && (
        <div className={`${darkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-xl p-6 mb-8 transition-all duration-300 shadow-card hover:shadow-card-hover`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-[#0f172a]'}`}>
            Account Information
          </h2>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <p className={`${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                <span className="font-medium">Email:</span> {user.email}
              </p>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <p className={`${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                <span className="font-medium">Membership:</span> {user.membership}
              </p>
            </div>
          </div>
        </div>
      )}

      {downloadStatus.active && (
        <div className={`${darkMode ? 'bg-dark-800' : 'bg-white'} rounded-xl shadow-card p-6 mb-8 transition-all duration-300 hover:shadow-card-hover border-l-4 border-primary-500`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-900'} flex items-center`}>
            <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Status
          </h2>

          <div className="mb-4">
            <div className="flex items-center mb-2">
              <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2.5 mr-2">
                <div
                  className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${(downloadStatus.completed / downloadStatus.total) * 100}%` }}
                ></div>
              </div>
              <p className={`ml-2 font-medium ${darkMode ? 'text-white' : 'text-dark-900'}`}>
                {Math.round((downloadStatus.completed / downloadStatus.total) * 100)}%
              </p>
            </div>
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Progress: {downloadStatus.completed} / {downloadStatus.total} files
              {isPolling && (
                <svg className="animate-spin h-4 w-4 text-primary-500 ml-2 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
            </p>
          </div>

          {downloadStatus.current_item && (
            <div className={`p-3 mb-4 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <span className="font-medium">Currently downloading:</span> {downloadStatus.current_item}
              </p>
            </div>
          )}

          <Link
            to="/queue"
            className="btn-primary inline-flex items-center"
          >
            <span>View Details</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      )}

      <div className="mb-10">
        <h2 className={`text-2xl font-semibold mb-6 ${darkMode ? 'text-white' : 'text-dark-900'} flex items-center`}>
          <svg className="w-6 h-6 mr-2 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`${darkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl border ${darkMode ? 'border-[#334155]' : 'border-gray-200'}`}
            >
              <div className="p-6 flex-grow">
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-full ${darkMode ? 'bg-[#0f172a]' : 'bg-gray-100'} text-[#0ea5e9]`}>
                    {feature.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Link
                  to={feature.link}
                  className="w-full inline-flex justify-center items-center px-4 py-3 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ea5e9]"
                >
                  Go to {feature.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${darkMode ? 'bg-dark-800' : 'bg-white'} rounded-xl shadow-card p-6 mb-8 transition-all duration-300 hover:shadow-card-hover border-l-4 border-green-500`}>
        <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-900'} flex items-center`}>
          <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Audio Quality Options
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className={`p-3 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                MP3
              </span>
              <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                320 kbps
              </p>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Standard quality compressed audio, smaller file size
            </p>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mr-2">
                CD
              </span>
              <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                16-bit / 44.1kHz FLAC
              </p>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              CD quality lossless audio
            </p>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                Hi-Res
              </span>
              <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                24-bit / ≤96kHz FLAC
              </p>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              High resolution audio, better than CD quality
            </p>
          </div>

          <div className={`p-3 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'}`}>
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 mr-2">
                Studio
              </span>
              <p className={`font-medium ${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
                24-bit / &gt;96kHz FLAC
              </p>
            </div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Studio quality audio, highest resolution available
            </p>
          </div>
        </div>

        <Link
          to="/settings"
          className="inline-flex items-center text-green-500 hover:text-green-600 font-medium"
        >
          <span>Configure Quality Settings</span>
          <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      {queue.length > 0 && (
        <div className={`${darkMode ? 'bg-dark-800' : 'bg-white'} rounded-xl shadow-card p-6 transition-all duration-300 hover:shadow-card-hover border-l-4 border-accent-500`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-dark-900'} flex items-center`}>
            <svg className="w-6 h-6 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Download Queue
          </h2>
          <div className={`p-3 mb-4 rounded-lg ${darkMode ? 'bg-dark-700' : 'bg-gray-100'} flex items-center`}>
            <svg className="w-5 h-5 mr-2 text-accent-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <p className={`${darkMode ? 'text-gray-200' : 'text-dark-800'}`}>
              You have <span className="font-semibold">{queue.length}</span> items in your download queue.
            </p>
          </div>
          <Link
            to="/queue"
            className="btn-accent inline-flex items-center"
          >
            <span>View Queue</span>
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
