import React, { createContext, useState, useEffect, useContext } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in on component mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const userData = await authAPI.getCurrentUser();
          setCurrentUser({
            id: userData.id,
            name: userData.full_name,
            email: userData.email,
            role: 'admin', // Assuming admin role for now, could be determined by backend
          });
        } catch (err) {
          console.error('Failed to fetch user data:', err);
          localStorage.removeItem('authToken');
        }
      }
      setLoading(false);
    };
    
    fetchUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true);
      setError(null);
      
      // Call the backend API to authenticate
      const response = await authAPI.login(email, password);
      
      // Store the token
      localStorage.setItem('authToken', response.access_token);
      
      // Fetch user data
      const userData = await authAPI.getCurrentUser();
      
      const user = {
        id: userData.id,
        name: userData.full_name,
        email: userData.email,
        role: 'admin', // Assuming admin role for now, could be determined by backend
      };
      
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login');
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
    // For now, just log to console, but in the future this could be sent to the backend
    console.log(`[AUDIT] ${new Date().toISOString()} - User ${currentUser?.id}: ${action}`, details);
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