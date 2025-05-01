import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Auth = ({ darkMode }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${darkMode ? '' : 'bg-gradient-primary'}`}>
      <div className="w-full max-w-md fade-in">
        <div className={`${darkMode ? 'bg-[#1e293b]' : 'bg-white'} rounded-2xl p-8 transition-all duration-300 shadow-xl`}>
          <div className="flex flex-col items-center">
            <div className="flex flex-col items-center mb-4">
              <img
                src={darkMode ? "/dark.svg" : "/light.svg"}
                alt="Ko-buzz Logo"
                className="h-20 w-20 mb-3 logo-pulse"
              />
              <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-[#0f172a]'}`}>
                Ko-buzz
              </h1>
              <h2 className={`text-lg mt-1 ${darkMode ? 'text-[#cbd5e1]' : 'text-[#64748b]'}`}>
                Qobuz Downloader
              </h2>
            </div>

            {error && (
              <div className="w-full mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="w-full">
              <div className="mb-5">
                <label
                  htmlFor="email"
                  className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Qobuz Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  autoFocus
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all duration-200 ${
                    darkMode
                      ? 'bg-[#334155] border-[#475569] text-white placeholder-[#94a3b8]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Qobuz Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all duration-200 ${
                    darkMode
                      ? 'bg-[#334155] border-[#475569] text-white placeholder-[#94a3b8]'
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
                  }`}
                  placeholder="••••••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-medium rounded-lg shadow-md
                  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0ea5e9]
                  ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <div className="flex justify-center items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </div>
                ) : 'Sign In'}
              </button>
            </form>

            <p className={`mt-8 text-sm text-center ${darkMode ? 'text-[#94a3b8]' : 'text-[#64748b]'}`}>
              You need a Qobuz account with an active subscription to use this application.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
