import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-violet shadow-lg shadow-neon-cyan/20">
            <Shield className="h-7 w-7 text-white animate-pulse" />
          </div>
          <div className="flex items-center gap-2 text-sm text-white/45">
            <span className="h-2 w-2 rounded-full bg-neon-cyan animate-ping"></span>
            Verifying SentinelQA session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;

