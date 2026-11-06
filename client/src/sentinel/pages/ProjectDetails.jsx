import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Ticket as TicketIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../api/axios.js';
import Badge from '../components/common/Badge.jsx';
import ProjectModal from '../components/projects/ProjectModal.jsx';
import TicketModal from '../components/tickets/TicketModal.jsx';
import Pagination from '../components/common/Pagination.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';

export const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [projectLoading, setProjectLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Pagination for project tickets
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Modals
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Safe Deletion Modals
  const [isDeleteProjectOpen, setIsDeleteProjectOpen] = useState(false);
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjectDetails = async () => {
    try {
      setProjectLoading(true);
      setError('');
      const res = await api.get(`/projects/${projectId}`);
      setProject(res.data.project);
      setMetrics(res.data.metrics);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load project details.');
    } finally {
      setProjectLoading(false);
    }
  };

  const fetchProjectTickets = async () => {
    try {
      setTicketsLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get(`/projects/${projectId}/tickets`, { params });
      setTickets(res.data.tickets || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalTickets(res.data.total || 0);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    } finally {
      setTicketsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    fetchProjectTickets();
  }, [projectId, page, statusFilter, severityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProjectTickets();
  };

  const handleCreateTicket = () => {
    setEditingTicket(null);
    setIsTicketModalOpen(true);
  };

  const handleEditTicket = (t) => {
    setEditingTicket(t);
    setIsTicketModalOpen(true);
  };

  const handleTicketSaved = () => {
    fetchProjectDetails();
    fetchProjectTickets();
  };

  const handleProjectSaved = (updated) => {
    setProject(updated);
    fetchProjectDetails();
  };

  const handleDeleteProject = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/projects/${projectId}`);
      navigate('/projects');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete project.');
      setDeleteLoading(false);
    }
  };

  const handleDeleteTicket = async () => {
    if (!deletingTicket) return;
    const tId = deletingTicket._id || deletingTicket.id;
    try {
      setDeleteLoading(true);
      await api.delete(`/tickets/${tId}`);
      setDeletingTicket(null);
      fetchProjectDetails();
      fetchProjectTickets();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ticket.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (projectLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/45">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mb-3" />
        <p className="text-xs">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-300 text-xs">
          {error || 'Project not found or access denied.'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back button & Breadcrumbs */}
      <div>
        <Link
          to="/projects"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Projects</span>
        </Link>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {project.name}
              </h2>
              <Badge type="projectStatus" value={project.status} />
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/45">
              <span className="flex items-center gap-1.5 font-mono bg-white/[0.02] border border-white/[0.08] px-2.5 py-1 rounded-md text-white/70">
                <span>{project.targetUrl}</span>
                <a
                  href={project.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/30 hover:text-neon-cyan"
                >
                  <ExternalLink className="h-3 w-3" />
                </a>
              </span>
              <span>•</span>
              <span>Created {formatDate(project.createdAt)}</span>
            </div>

            {project.description && (
              <p className="mt-2 text-xs text-white/45 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Project</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteProjectOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={handleCreateTicket}
              className="inline-flex items-center gap-1.5 rounded-xl btn-sentinel-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>New Ticket</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Total Tickets
          </span>
          <div className="mt-1 text-2xl font-bold text-white">
            {metrics?.total || 0}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Open
          </span>
          <div className="mt-1 text-2xl font-bold text-neon-cyan">
            {metrics?.open || 0}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            In Progress
          </span>
          <div className="mt-1 text-2xl font-bold text-sky-400">
            {metrics?.in_progress || 0}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Resolved
          </span>
          <div className="mt-1 text-2xl font-bold text-neon-violet">
            {metrics?.resolved || 0}
          </div>
        </div>
        <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-4">
          <span className="text-[11px] font-medium text-white/45 uppercase tracking-wider">
            Critical / High
          </span>
          <div className="mt-1 text-2xl font-bold text-rose-400">
            {(metrics?.critical || 0) + (metrics?.high || 0)}
          </div>
        </div>
      </div>

      {/* Embedded Project Tickets Section */}
      <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-2.5">
            <TicketIcon className="h-5 w-5 text-neon-cyan" />
            <div>
              <h3 className="text-base font-semibold text-white">
                Project Test Tickets & Criteria
              </h3>
              <p className="text-xs text-white/45">
                User stories, acceptance criteria, and expected outcomes defined for this project
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCreateTicket}
            className="inline-flex items-center gap-1.5 rounded-xl btn-sentinel-primary px-3.5 py-1.5 text-xs font-semibold text-white hover:brightness-110 transition-colors self-start sm:self-auto"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Ticket</span>
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tickets..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none"
            />
          </form>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <select
              value={severityFilter}
              onChange={(e) => {
                setSeverityFilter(e.target.value);
                setPage(1);
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-2.5 py-1.5 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Tickets Table / List */}
        {ticketsLoading && tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-white/45">
            <Loader2 className="h-6 w-6 animate-spin text-neon-cyan mb-2" />
            <p className="text-xs">Loading tickets...</p>
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/[0.08] rounded-xl">
            <TicketIcon className="h-8 w-8 text-white/25 mx-auto mb-2" />
            <p className="text-xs font-medium text-white/70">No tickets found in this project</p>
            <p className="text-[11px] text-white/30 mt-1">
              Add user stories and acceptance criteria to fuel test generation.
            </p>
            <button
              type="button"
              onClick={handleCreateTicket}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg btn-sentinel-primary px-3 py-1.5 text-xs font-semibold text-white hover:brightness-110"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create First Ticket</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/45 font-medium bg-white/[0.015]">
                  <th className="py-2.5 px-3">Title / Summary</th>
                  <th className="py-2.5 px-3">Severity</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Scenarios</th>
                  <th className="py-2.5 px-3">Created</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/70">
                {tickets.map((t) => {
                  const tId = t._id || t.id;
                  const scenarioCount = t.parsedCriteria?.length || 0;
                  return (
                    <tr key={tId} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3 font-medium text-white">
                        <Link
                          to={`/tickets/${tId}`}
                          className="hover:text-neon-cyan transition-colors"
                        >
                          {t.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="severity" value={t.severity} size="xs" />
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="priority" value={t.priority} size="xs" />
                      </td>
                      <td className="py-3 px-3">
                        <Badge type="status" value={t.status} size="xs" />
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-white/70 border border-white/[0.10]">
                          <Sparkles className="h-3 w-3 text-neon-cyan" />
                          <span>{scenarioCount} parsed</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-white/30 whitespace-nowrap">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/tickets/${tId}`}
                            className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white"
                            title="View Ticket"
                          >
                            <TicketIcon className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleEditTicket(t)}
                            className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white"
                            title="Edit Ticket"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingTicket(t)}
                            className="rounded-lg p-1.5 text-white/45 hover:bg-rose-500/20 hover:text-rose-400"
                            title="Delete Ticket"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              page={page}
              totalPages={totalPages}
              total={totalTickets}
              limit={10}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* Edit Project Modal */}
      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        project={project}
        onSaved={handleProjectSaved}
      />

      {/* Ticket Create/Edit Modal */}
      <TicketModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        ticket={editingTicket}
        defaultProjectId={projectId}
        onSaved={handleTicketSaved}
      />

      {/* Safe Project Deletion Dialog */}
      {isDeleteProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-ink-800 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Delete Project</h3>
                <p className="text-xs text-rose-300">Cascade Deletion Warning</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Are you sure you want to permanently delete <strong className="text-white">"{project.name}"</strong>?
              This will cascade delete all <strong className="text-rose-400">{metrics?.total || 0} tickets</strong> in this project.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsDeleteProjectOpen(false)}
                disabled={deleteLoading}
                className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteProject}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Project & All Tickets</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Ticket Confirmation Dialog */}
      {deletingTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-ink-800 p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-rose-400">
              <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Delete Ticket</h3>
                <p className="text-xs text-rose-300">Permanent Ticket Deletion</p>
              </div>
            </div>

            <p className="text-xs text-white/70 leading-relaxed mb-4">
              Are you sure you want to delete ticket <strong className="text-white">"{deletingTicket.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setDeletingTicket(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteTicket}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-500 disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Ticket</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;

