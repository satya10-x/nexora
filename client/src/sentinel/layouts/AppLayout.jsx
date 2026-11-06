import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Layers,
  Ticket,
  PlayCircle,
  Wrench,
  BarChart3,
  Settings,
  Menu,
  X,
  LogOut,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', path: '/projects', icon: Layers },
  { name: 'Tickets', path: '/tickets', icon: Ticket },
  { name: 'Test Runs', path: '/runs', icon: PlayCircle },
  { name: 'Self-Healing', path: '/repairs', icon: Wrench },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Settings', path: '/settings', icon: Settings },
];

const getPageTitle = (pathname) => {
  if (pathname === '/dashboard' || pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/projects')) return 'Projects & Targets';
  if (pathname.startsWith('/tickets')) return 'Jira Tickets';
  if (pathname.startsWith('/runs')) return 'Test Runs';
  if (pathname.startsWith('/repairs')) return 'Self-Healing Locators';
  if (pathname.startsWith('/reports')) return 'Reports & Analytics';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'SentinelQA';
};

export const AppLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { data, loading: healthLoading, error: healthError, isHealthy, isDemo } = useHealth();
  const { user, logout } = useAuth();

  const title = getPageTitle(location.pathname);

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-ink text-white">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-white/[0.07] bg-ink-950 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5">
          <div className="flex items-center gap-3">
            <div className="sentinel-logo-mark flex h-9 w-9 items-center justify-center rounded-xl">
              <Shield className="h-[18px] w-[18px] text-neon-cyan" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold tracking-tight text-white">SentinelQA</span>
                <span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.14em] text-neon-cyan">
                  v0.3
                </span>
              </div>
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
                by Nexora
              </p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-1 text-white/45 hover:bg-white/[0.06] lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="sentinel-scroll flex-1 space-y-1 overflow-y-auto px-3 py-5">
          <div className="flex items-center justify-between px-3 pb-3 font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">
            <span>Platform</span>
            <Sparkles className="h-3 w-3 text-neon-cyan/60" />
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-[13px] font-medium transition-all ${
                    isActive
                      ? 'border-neon-cyan/20 bg-neon-cyan/[0.07] text-neon-cyan shadow-[inset_0_0_24px_-16px_rgba(0,240,255,0.8)]'
                      : 'border-transparent text-white/45 hover:border-white/[0.06] hover:bg-white/[0.025] hover:text-white/85'
                  }`
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.07] p-3">
          <a
            href="/"
            className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/40 transition-colors hover:border-neon-cyan/30 hover:text-white"
          >
            <span>Back to site</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neon-cyan/20 bg-neon-cyan/10 text-xs font-semibold text-neon-cyan">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-semibold text-white/85">{user?.name || 'Engineer'}</p>
                  <p className="truncate text-[10px] text-white/45">{user?.email || 'Authenticated'}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg p-1.5 text-white/45 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                title="Sign out"
                aria-label="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] bg-ink/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-white/45 hover:bg-white/[0.06] lg:hidden"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl">{title}</h1>
              <p className="hidden font-mono text-[8px] uppercase tracking-[0.22em] text-white/25 sm:block">
                SentinelQA / autonomous quality
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.18em] backdrop-blur-sm transition-colors ${
                healthLoading
                  ? 'border-white/[0.10] bg-white/[0.03] text-white/45'
                  : isHealthy
                    ? 'border-neon-cyan/20 bg-neon-cyan/[0.07] text-neon-cyan'
                    : 'border-rose-500/20 bg-rose-500/10 text-rose-400'
              }`}
              title={
                healthLoading
                  ? 'Checking SentinelQA status...'
                  : isHealthy
                    ? isDemo
                      ? 'Demo runtime active with seeded local data'
                      : `API healthy | DB ${data?.db}`
                    : `System degraded: ${healthError || 'Database disconnected or API unreachable'}`
              }
            >
              <span className="relative flex h-1.5 w-1.5">
                {!healthLoading && isHealthy && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-70" />
                )}
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    healthLoading ? 'bg-white/30' : isHealthy ? 'bg-neon-cyan' : 'bg-rose-400'
                  }`}
                />
              </span>
              <span className="hidden sm:inline">System</span>
              <span>
                {healthLoading
                  ? 'Checking'
                  : isDemo
                    ? 'Demo'
                    : isHealthy
                      ? 'Operational'
                      : 'Degraded'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-1.5 text-[11px] font-medium text-white/60 transition-all hover:border-rose-500/20 hover:text-rose-400"
              title="Sign out of SentinelQA"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </header>

        <main className="sentinel-scroll relative flex-1 overflow-y-auto bg-ink p-4 sm:p-6 lg:p-8">
          <div
            className="pointer-events-none absolute inset-0 sentinel-grid opacity-20"
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
