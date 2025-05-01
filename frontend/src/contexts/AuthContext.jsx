import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth', { email, password });
      const userData = {
        email,
        membership: response.data.membership
      };

      // Save to state only (no localStorage)
      setUser(userData);

      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    // Clear from state
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
