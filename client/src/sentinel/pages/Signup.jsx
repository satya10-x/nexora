import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, AlertCircle, ArrowRight, Loader2, User, Mail, Lock, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Name is required and must be at least 2 characters.');
      return;
    }

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError('Please provide a valid work email address.');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);

    try {
      await register(trimmedName, trimmedEmail, password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setError(null);
    try {
      await loginAsDemo();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to open the demo workspace.');
    }
  };

  return (
    <div className="relative min-h-screen bg-ink text-white flex flex-col justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 sentinel-grid opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(0,240,255,0.10),transparent_65%)]" aria-hidden="true" />
      <div className="relative sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="sentinel-logo-mark flex h-12 w-12 items-center justify-center rounded-2xl group-hover:scale-105 transition-transform">
              <Shield className="h-6 w-6 text-neon-cyan" />
            </div>
          </Link>
        </div>
        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Create SentinelQA Account
        </h2>
        <p className="mt-2 text-center text-xs text-white/45">
          Get started with autonomous UI testing, AI locator healing, and Jira sync.
        </p>
      </div>

      <div className="relative mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="sentinel-panel rounded-2xl p-6 sm:p-8 shadow-glass">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="signup-name" className="block text-xs font-medium text-white/70 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/45">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="signup-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sarah Connor"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-xs font-medium text-white/70 mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/45">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="signup-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="sarah@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-xs font-medium text-white/70 mb-1.5">
                Password <span className="text-white/30">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/45">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="signup-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/60 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-xs font-medium text-white/70 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-white/45">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="signup-confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.02] text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-cyan/60 focus:ring-1 focus:ring-neon-cyan/60 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl btn-sentinel-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:brightness-110 focus:outline-none disabled:opacity-50 transition-all mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-white/[0.06]" />
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/25">or</span>
            <span className="h-px flex-1 bg-white/[0.06]" />
          </div>

          <button
            type="button"
            onClick={handleDemo}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-neon-cyan/25 bg-neon-cyan/[0.06] px-4 py-2.5 text-sm font-medium text-neon-cyan transition-colors hover:border-neon-cyan/45 hover:bg-neon-cyan/[0.10] disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>Continue with demo workspace</span>
          </button>

          <div className="mt-6 pt-5 border-t border-white/[0.06] text-center text-xs text-white/45">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/90 font-medium">
              Sign in
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-xs text-white/45 hover:text-white/85 transition-colors">
            ← Back to SentinelQA Overview
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;

