import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Contexts
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QueueProvider } from './contexts/QueueContext';

// Components
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Search from './components/Search';
import DownloadQueue from './components/DownloadQueue';
import Settings from './components/Settings';
import Navbar from './components/Navbar';

// Styles
import './App.css';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render the protected component
  return children;
};

function App() {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);

    // Apply dark mode to the document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AuthProvider>
      <QueueProvider>
        <Router>
          <div className={`min-h-screen flex flex-col ${
            darkMode
              ? 'dark bg-[#0f172a] text-white'
              : 'bg-gray-50 text-[#0f172a]'
          }`}>
            <AuthContent darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </Router>
      </QueueProvider>
    </AuthProvider>
  );
}

// Component to handle authentication state
const AuthContent = ({ darkMode, toggleDarkMode }) => {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <>
      {isAuthenticated && <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />}
      <main className={`flex-grow transition-all duration-300 ${
        isAuthenticated ? 'p-4 md:p-8 pt-16' : 'p-0'
      }`}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated
                ? <Navigate to="/" replace />
                : <Auth darkMode={darkMode} />
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <Search darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue"
            element={
              <ProtectedRoute>
                <DownloadQueue darkMode={darkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings darkMode={darkMode} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
};

export default App;
