import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // For demo purposes, we'll just set a mock user
      // In a real app, you would validate the token with your backend
      setCurrentUser({
        id: 'user-1',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'admin', // Could be 'admin', 'manager', or 'user' as per TR4.3
      });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // In a real app, this would be an API call to your backend
      // const response = await axios.post('/api/auth/login', { email, password });
      
      // For demo purposes, we'll simulate a successful login
      // with a mock token and user data
      const mockResponse = {
        token: 'mock-jwt-token',
        user: {
          id: 'user-1',
          name: 'Demo User',
          email: email,
          role: 'admin',
        }
      };
      
      localStorage.setItem('authToken', mockResponse.token);
      setCurrentUser(mockResponse.user);
      return mockResponse.user;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    setCurrentUser(null);
  };

  // Check if user has required role
  const hasRole = (requiredRole) => {
    if (!currentUser) return false;
    
    // Role hierarchy: admin > manager > user
    if (currentUser.role === 'admin') return true;
    if (currentUser.role === 'manager' && requiredRole !== 'admin') return true;
    if (currentUser.role === 'user' && requiredRole === 'user') return true;
    
    return false;
  };

  // Log activity for audit purposes (TR4.4)
  const logActivity = (action, details) => {
    // In a real app, this would send the activity log to your backend
    console.log(`[AUDIT] ${new Date().toISOString()} - User ${currentUser?.id}: ${action}`, details);
    
    // Example implementation with axios:
    // if (currentUser) {
    //   axios.post('/api/logs/activity', {
    //     userId: currentUser.id,
    //     action,
    //     details,
    //     timestamp: new Date().toISOString()
    //   });
    // }
  };

  const value = {
    currentUser,
    loading,
    error,
    login,
    logout,
    hasRole,
    logActivity
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;