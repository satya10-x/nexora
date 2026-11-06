import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="flex min-h-[500px] flex-col items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] p-8 text-center backdrop-blur-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">404 - Page Not Found</h2>
      <p className="mt-2 max-w-md text-sm text-white/45">
        The SentinelQA interface path you are attempting to access does not exist or has moved.
      </p>

      <Link
        to="/dashboard"
        className="mt-6 inline-flex items-center gap-2 rounded-lg btn-sentinel-primary px-4 py-2.5 text-sm font-medium text-white transition-all hover:brightness-110 shadow-sm"
      >
        <Home className="h-4 w-4" />
        Return to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;

