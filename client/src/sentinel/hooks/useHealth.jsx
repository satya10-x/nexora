import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios.js';

const HealthContext = createContext(null);

export const HealthProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/health');
      setData(response.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Failed to connect to SentinelQA backend service'
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const isHealthy = Boolean(
    data?.success && (data?.db === 'connected' || data?.db === 'demo'),
  );
  const isDemo = data?.mode === 'demo' || data?.db === 'demo';

  const value = {
    data,
    loading,
    error,
    refresh: fetchHealth,
    isHealthy,
    isDemo,
  };

  return (
    <HealthContext.Provider value={value}>
      {children}
    </HealthContext.Provider>
  );
};

export const useHealth = () => {
  const context = useContext(HealthContext);
  if (!context) {
    throw new Error('useHealth must be used within a HealthProvider');
  }
  return context;
};

export default useHealth;

