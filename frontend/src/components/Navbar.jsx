import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    {
      text: 'Dashboard',
      path: '/',
      icon: (
        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      text: 'Search',
      path: '/search',
      icon: (
        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      text: 'Download Queue',
      path: '/queue',
      icon: (
        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
      )
    },

    {
      text: 'Settings',
      path: '/settings',
      icon: (
        <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
  ];

  return (
    <>
      {/* Floating menu button for mobile */}
      <button
        onClick={toggleDrawer(true)}
        className={`fixed top-4 left-4 z-30 p-2 rounded-full shadow-lg ${
          darkMode
            ? 'bg-[#1e293b] text-white hover:bg-[#334155]'
            : 'bg-white text-[#0f172a] hover:bg-gray-100'
        } focus:outline-none transition-all duration-200`}
        aria-label="Open menu"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logout button in top right */}
      <button
        onClick={handleLogout}
        className={`fixed top-4 right-4 z-30 px-3 py-2 rounded-md shadow-lg flex items-center ${
          darkMode
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-red-500 text-white hover:bg-red-600'
        } focus:outline-none transition-all duration-200`}
        aria-label="Logout"
      >
        <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>

      {/* Drawer */}
      <div className={`fixed inset-0 z-40 ${drawerOpen ? 'block' : 'hidden'}`}>
        {/* Semi-transparent backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={toggleDrawer(false)}
          aria-hidden="true"
        ></div>

        {/* Drawer panel */}
        <div
          className={`fixed inset-y-0 left-0 flex flex-col w-64 max-w-xs transform transition-transform duration-300 ease-in-out z-50 ${
            drawerOpen ? 'translate-x-0' : '-translate-x-full'
          } ${darkMode ? 'bg-[#1e293b] text-white' : 'bg-white text-[#0f172a]'} shadow-xl`}
        >
          <div className="p-6">
            <div className="flex items-center mb-6">
              <img
                src={darkMode ? "/dark.svg" : "/light.svg"}
                alt="Ko-buzz Logo"
                className="h-10 w-10 mr-3 logo-pulse"
              />
              <span className="font-bold text-xl tracking-tight">Ko-buzz</span>
            </div>

            {user && (
              <div className={`mt-2 p-3 rounded-lg ${darkMode ? 'bg-[#0f172a]' : 'bg-gray-100'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-[#cbd5e1]' : 'text-[#64748b]'}`}>
                  {user.email}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-[#94a3b8]' : 'text-[#94a3b8]'}`}>
                  Membership: {user.membership}
                </p>
              </div>
            )}
          </div>

          <div className={`border-t ${darkMode ? 'border-[#334155]' : 'border-gray-200'}`}></div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.text}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    darkMode
                      ? 'hover:bg-[#0f172a] active:bg-[#0f172a]'
                      : 'hover:bg-gray-100 active:bg-gray-200'
                  }`}
                  onClick={toggleDrawer(false)}
                >
                  {item.icon}
                  {item.text}
                </Link>
              ))}
            </nav>
          </div>

          <div className={`border-t ${darkMode ? 'border-[#334155]' : 'border-gray-200'}`}></div>

          <div className="p-4 space-y-3">
            <button
              onClick={toggleDarkMode}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                darkMode
                  ? 'bg-[#0f172a] hover:bg-[#1e293b]'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {darkMode ? (
                <>
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>

            <button
              onClick={() => {
                handleLogout();
                toggleDrawer(false)();
              }}
              className="w-full flex items-center px-4 py-3 rounded-lg text-base font-medium bg-[#0ea5e9] hover:bg-[#0284c7] text-white transition-colors duration-200"
            >
              <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
