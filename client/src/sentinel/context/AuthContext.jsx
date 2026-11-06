import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';
import { enableDemoSession } from '../api/demo.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore authenticated session from HTTP-only cookie on mount
  const checkAuth = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Login failed');
  };

  const register = async (name, email, password) => {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Registration failed');
  };

  const loginAsDemo = async () => {
    enableDemoSession();
    const response = await api.post('/auth/login', {
      email: 'demo@sentinelqa.dev',
      password: 'demo1234',
    });
    if (response.data?.success && response.data?.user) {
      setUser(response.data.user);
      return response.data.user;
    }
    throw new Error(response.data?.message || 'Unable to open the demo workspace');
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    loginAsDemo,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;

