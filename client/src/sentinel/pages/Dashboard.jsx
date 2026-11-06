import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  Server,
  Database,
  Cpu,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
  Sparkles,
  Bug,
  Activity,
  Layers,
  ExternalLink,
  History,
  Terminal,
  Plus,
  Ticket as TicketIcon,
  Loader2,
} from 'lucide-react';
import { useHealth } from '../hooks/useHealth.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import StatCard from '../components/StatCard.jsx';
import Badge from '../components/common/Badge.jsx';
import ProjectModal from '../components/projects/ProjectModal.jsx';
import TicketModal from '../components/tickets/TicketModal.jsx';
import api from '../api/axios.js';

export const Dashboard = () => {
  const { data, loading, error, refresh, isHealthy } = useHealth();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

  const fetchDashboardProjects = async () => {
    try {
      setLoadingProjects(true);
      const res = await api.get('/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error('Failed to load dashboard projects:', err);
    } finally {
      setLoadingProjects(false);
    }
  };

  useEffect(() => {
    fetchDashboardProjects();
  }, []);

  const totalTickets = projects.reduce((acc, p) => acc + (p.ticketCount || 0), 0);
  const totalOpenTickets = projects.reduce((acc, p) => acc + (p.openTicketsCount || 0), 0);
  const totalResolvedTickets = projects.reduce((acc, p) => acc + (p.resolvedTicketsCount || 0), 0);

  return (
    <div className="space-y-8">
      {/* Personalized Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Welcome back, {user?.name || 'Engineer'}
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Autonomous QA Operations • AI Locator Healing • Playwright Orchestrator
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            <Plus className="h-3.5 w-3.5 text-neon-cyan" />
            <span>New Project</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTicketModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-semibold text-white/85 hover:bg-white/[0.06] hover:text-white transition-all"
          >
            <TicketIcon className="h-3.5 w-3.5 text-neon-violet" />
            <span>New Ticket</span>
          </button>
          <a
            href="http://localhost:4000/__control"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg btn-sentinel-primary px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-all"
          >
            <span>Open Demo Control</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Quick Project & Ticket Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Active Projects
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{projects.length}</span>
            <span className="text-xs text-white/30">targets configured</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Total QA Tickets
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{totalTickets}</span>
            <span className="text-xs text-white/30">across projects</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Open Criteria
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neon-cyan">{totalOpenTickets}</span>
            <span className="text-xs text-white/30">pending tests</span>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Resolved Tickets
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-neon-violet">{totalResolvedTickets}</span>
            <span className="text-xs text-white/30">verified</span>
          </div>
        </div>
      </div>

      {/* Platform Introduction Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-gradient-to-r from-white/[0.055] via-white/[0.03] to-ink-950 p-6 shadow-sm backdrop-blur-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
            <Terminal className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">
              SentinelQA Autonomous Testing Pipeline
            </h3>
            <p className="mt-1 text-xs text-white/45 leading-relaxed max-w-4xl">
              SentinelQA continuously connects to Jira user stories to parse acceptance criteria, synthesizes robust Playwright tests using Groq LLM acceleration, executes tests against application targets, and self-heals brittle selectors when UI structures shift.
            </p>

            <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/70">
              <span className="flex items-center gap-1.5 rounded-md bg-white/[0.02] border border-white/[0.08] px-2.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />
                Zero Test Maintenance Flakiness
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-white/[0.02] border border-white/[0.08] px-2.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />
                Automated DOM Mutation Recovery
              </span>
              <span className="flex items-center gap-1.5 rounded-md bg-white/[0.02] border border-white/[0.08] px-2.5 py-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-neon-cyan" />
                Live Video & Trace Telemetry
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Card */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-sm backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/[0.06] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                System Health & Core Services
              </h3>
              <p className="text-xs text-white/45">
                Live connectivity verification for backend runtime, database, and integrations
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/[0.12] bg-white/[0.06] px-4 py-2 text-xs font-medium text-white/85 transition-all hover:bg-white/[0.08] hover:text-white disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Refreshing...' : 'Refresh Status'}</span>
          </button>
        </div>

        {/* Error state if server unreachable */}
        {error && (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
            <div className="flex-1">
              <p className="font-semibold text-rose-200">Unable to reach SentinelQA Backend</p>
              <p className="mt-1 text-rose-300/80">{error}</p>
              <p className="mt-2 text-[11px] text-white/45">
                Ensure the server is running on <code className="text-white/85">http://localhost:5001</code> and valid <code className="text-white/85">MONGODB_URI</code> is configured.
              </p>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* API Server */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <Server className="h-4 w-4 text-white/45" />
                API Service
              </div>
              <span className="relative flex h-2.5 w-2.5">
                {data?.success && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    loading
                      ? 'bg-white/30'
                      : data?.success
                      ? 'bg-neon-cyan'
                      : 'bg-rose-400'
                  }`}
                />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold text-white">
                {loading ? 'Checking...' : data?.success ? 'Operational' : 'Unavailable'}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {data?.uptime !== undefined
                  ? `Uptime: ${Math.floor(data.uptime)}s`
                  : 'Backend health check'}
              </p>
            </div>
          </div>

          {/* Database */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <Database className="h-4 w-4 text-white/45" />
                MongoDB
              </div>
              <span className="relative flex h-2.5 w-2.5">
                {data?.db === 'connected' && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    loading
                      ? 'bg-white/30'
                      : data?.db === 'connected'
                      ? 'bg-neon-cyan'
                      : 'bg-rose-400'
                  }`}
                />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold text-white">
                {loading
                  ? 'Checking...'
                  : data?.db === 'connected'
                  ? 'Connected'
                  : 'Disconnected'}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {data?.db === 'connected'
                  ? 'Authenticated sessions active'
                  : 'Requires active MongoDB instance'}
              </p>
            </div>
          </div>

          {/* Groq LLM */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <Cpu className="h-4 w-4 text-white/45" />
                Groq LLM API
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    loading
                      ? 'bg-white/30'
                      : data?.integrations?.groq
                      ? 'bg-neon-cyan'
                      : 'bg-amber-400'
                  }`}
                />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold text-white">
                {loading
                  ? 'Checking...'
                  : data?.integrations?.groq
                  ? 'Configured'
                  : 'Ready for code generation'}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {data?.integrations?.groq
                  ? 'Fast inference verified'
                  : 'Configured in server .env'}
              </p>
            </div>
          </div>

          {/* Jira Integration */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition-colors hover:border-white/[0.10]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-medium text-white/70">
                <FileSpreadsheet className="h-4 w-4 text-white/45" />
                Jira Sync
              </div>
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                    loading
                      ? 'bg-white/30'
                      : data?.integrations?.jira
                      ? 'bg-neon-cyan'
                      : 'bg-amber-400'
                  }`}
                />
              </span>
            </div>
            <div className="mt-3">
              <p className="text-sm font-semibold text-white">
                {loading
                  ? 'Checking...'
                  : data?.integrations?.jira
                  ? 'Configured'
                  : 'Not Configured'}
              </p>
              <p className="mt-1 text-xs text-white/45">
                {data?.integrations?.jira
                  ? 'Ticket criteria sync active'
                  : 'Optional external sync'}
              </p>
            </div>
          </div>
        </div>

        {data?.timestamp && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.04] pt-4 text-[11px] text-white/45">
            <span>Service: {data.service}</span>
            <span>Last Checked: {new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* Projects Overview & Target Application Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4">
            <div className="flex items-center gap-2.5">
              <Layers className="h-5 w-5 text-neon-cyan" />
              <h3 className="text-base font-semibold text-white">
                Configured Application Targets
              </h3>
            </div>
            <Link
              to="/projects"
              className="text-xs font-medium text-neon-cyan hover:text-neon-cyan/90"
            >
              View All Projects →
            </Link>
          </div>

          {loadingProjects ? (
            <div className="py-8 flex items-center justify-center text-white/30 text-xs">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span>Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            /* ShopEase Demo Preset if no projects exist */
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 border border-sky-400/20 text-sky-300 font-bold text-sm">
                  SE
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-white">ShopEase E-Commerce</h4>
                    <span className="rounded bg-neon-cyan/10 px-2 py-0.5 text-[10px] font-semibold text-neon-cyan border border-neon-cyan/20">
                      Demo Target Available
                    </span>
                  </div>
                  <p className="text-xs text-white/45 mt-0.5">
                    Target URL: <code className="text-white/70">http://localhost:4000</code> • Ready for autonomous test generation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg btn-sentinel-primary px-3 py-1.5 text-xs font-medium text-white hover:brightness-110 transition-colors"
                >
                  <Plus className="h-3 w-3" />
                  <span>Create Project</span>
                </button>
                <a
                  href="http://localhost:4000/__control"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 px-3 py-1.5 text-xs font-medium text-neon-cyan/90 hover:bg-neon-cyan/15 transition-colors"
                >
                  <span>Control App</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          ) : (
            /* Render list of user's active projects */
            <div className="space-y-3">
              {projects.slice(0, 3).map((proj) => {
                const pId = proj._id || proj.id;
                return (
                  <div
                    key={pId}
                    className="rounded-xl border border-white/[0.07] bg-white/[0.015] p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:border-white/[0.11] transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/projects/${pId}`}
                          className="text-sm font-semibold text-white hover:text-neon-cyan transition-colors"
                        >
                          {proj.name}
                        </Link>
                        <Badge type="projectStatus" value={proj.status} size="xs" />
                      </div>
                      <p className="text-xs text-white/45 mt-0.5 font-mono">
                        Target: <span className="text-white/70">{proj.targetUrl}</span> • {proj.ticketCount || 0} tickets
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={proj.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.05] px-2.5 py-1 text-xs font-medium text-white/70 hover:text-white"
                      >
                        <span>Visit</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <Link
                        to={`/projects/${pId}`}
                        className="inline-flex items-center gap-1 rounded-lg bg-neon-cyan/10 border border-neon-cyan/30 px-2.5 py-1 text-xs font-medium text-neon-cyan/90 hover:bg-neon-cyan/15"
                      >
                        <span>Details</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Guide & Recent Activity Card */}
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 border-b border-white/[0.06] pb-4 mb-4">
              <History className="h-5 w-5 text-white/45" />
              <h3 className="text-base font-semibold text-white">Workflow Checklist</h3>
            </div>

            <div className="space-y-3 text-xs text-white/70">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan font-bold text-[10px]">
                  1
                </span>
                <p>
                  <strong>Create a Project:</strong> Map to <code className="text-white/85">http://localhost:4000</code>.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan font-bold text-[10px]">
                  2
                </span>
                <p>
                  <strong>Add QA Ticket:</strong> Define criteria with Given / When / Then scenarios.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neon-cyan/20 text-neon-cyan font-bold text-[10px]">
                  3
                </span>
                <p>
                  <strong>Run Autonomous QA:</strong> SentinelQA synthesizes Playwright tests with Groq.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.06] mt-4 text-[11px] text-white/30">
            Phase 4: Project & Ticket Management Active
          </div>
        </div>
      </div>

      {/* Autonomous QA Telemetry Stat Cards */}
      <div>
        <div className="mb-4">
          <h3 className="text-base font-semibold text-white">
            Autonomous QA Telemetry
          </h3>
          <p className="text-xs text-white/45">
            Metrics will populate automatically once test runs and self-healing pipelines are executed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          <StatCard
            title="Total Tests"
            value="—"
            icon={FlaskConical}
            description="Playwright test cases synthesized from Jira stories"
            accentColor="blue"
          />

          <StatCard
            title="Passed"
            value="—"
            icon={CheckCircle2}
            description="Tests passing verification criteria"
            accentColor="emerald"
          />

          <StatCard
            title="Auto-Healed"
            value="—"
            icon={Sparkles}
            description="Broken locators dynamically healed by Groq"
            accentColor="purple"
          />

          <StatCard
            title="Real Bugs Found"
            value="—"
            icon={Bug}
            description="Verified application defects detected"
            accentColor="rose"
          />
        </div>
      </div>

      {/* Project & Ticket Modals */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onSaved={fetchDashboardProjects}
      />

      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSaved={fetchDashboardProjects}
      />
    </div>
  );
};

export default Dashboard;
