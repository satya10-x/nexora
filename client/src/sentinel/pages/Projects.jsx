import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Ticket,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import api from '../api/axios.js';
import Badge from '../components/common/Badge.jsx';
import ProjectModal from '../components/projects/ProjectModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';

export const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  // Delete confirmation modal state
  const [deletingProject, setDeletingProject] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/projects', { params });
      setProjects(res.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleProjectSaved = () => {
    fetchProjects();
  };

  const handleConfirmDelete = async () => {
    if (!deletingProject) return;
    const pId = deletingProject._id || deletingProject.id;

    try {
      setDeleteLoading(true);
      await api.delete(`/projects/${pId}`);
      setDeletingProject(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete project.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Testing Projects
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Manage target applications, environments, and test suites under test.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchProjects}
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-1.5 rounded-xl btn-sentinel-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by name..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-10 pr-4 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/45">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/45">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mb-3" />
          <p className="text-xs">Loading projects...</p>
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No Projects Found"
          description="Create your first testing project to configure a target URL and start managing test tickets."
          actionLabel="Create Project"
          onAction={handleOpenCreate}
        />
      ) : (
        /* Projects Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((proj) => {
            const pId = proj._id || proj.id;
            return (
              <div
                key={pId}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-sm hover:border-white/[0.10] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white truncate hover:text-neon-cyan">
                      <Link to={`/projects/${pId}`}>{proj.name}</Link>
                    </h3>
                    <Badge type="projectStatus" value={proj.status} size="xs" />
                  </div>

                  {/* Target URL */}
                  <div className="flex items-center gap-1.5 text-xs text-white/45 mb-3 font-mono bg-white/[0.02] border border-white/[0.08] rounded-lg px-2.5 py-1">
                    <span className="truncate flex-1">{proj.targetUrl}</span>
                    <a
                      href={proj.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/30 hover:text-neon-cyan transition-colors"
                      title="Open target application in new tab"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-white/45 line-clamp-2 min-h-[2rem] mb-4">
                    {proj.description || 'No description provided.'}
                  </p>

                  {/* Metrics Badges */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/[0.06] text-center">
                    <div className="rounded-lg bg-white/[0.015] p-2 border border-white/[0.04]">
                      <div className="text-base font-bold text-white">
                        {proj.ticketCount || 0}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Tickets
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/[0.015] p-2 border border-white/[0.04]">
                      <div className="text-base font-bold text-neon-cyan">
                        {proj.openTicketsCount || 0}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Open
                      </div>
                    </div>
                    <div className="rounded-lg bg-white/[0.015] p-2 border border-white/[0.04]">
                      <div className="text-base font-bold text-neon-violet">
                        {proj.resolvedTicketsCount || 0}
                      </div>
                      <div className="text-[10px] text-white/30 uppercase tracking-wider">
                        Resolved
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer & Actions */}
                <div className="flex items-center justify-between pt-4 mt-2 text-xs text-white/30">
                  <span>Created {formatDate(proj.createdAt)}</span>

                  <div className="flex items-center gap-1">
                    <Link
                      to={`/projects/${pId}`}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white transition-colors"
                      title="View Details"
                    >
                      <Layers className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(proj)}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white transition-colors"
                      title="Edit Project"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProject(proj)}
                      className="rounded-lg p-1.5 text-white/45 hover:bg-rose-500/20 hover:text-rose-400 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Project Create/Edit Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        project={editingProject}
        onSaved={handleProjectSaved}
      />

      {/* Safe Project Deletion Confirmation Dialog */}
      {deletingProject && (
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
              Are you sure you want to delete <strong className="text-white">"{deletingProject.name}"</strong>?
              This action will permanently delete this project and{' '}
              <span className="text-rose-400 font-semibold">
                cascade delete all {deletingProject.ticketCount || 0} associated testing tickets
              </span>.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setDeletingProject(null)}
                disabled={deleteLoading}
                className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteLoading}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-500 transition-colors disabled:opacity-50"
              >
                {deleteLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Project & Tickets</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Projects;
