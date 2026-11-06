import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket as TicketIcon,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import api from '../api/axios.js';
import Badge from '../components/common/Badge.jsx';
import Pagination from '../components/common/Pagination.jsx';
import TicketModal from '../components/tickets/TicketModal.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { formatDate } from '../utils/formatters.js';

export const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTickets, setTotalTickets] = useState(0);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);

  // Delete modal
  const [deletingTicket, setDeletingTicket] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Fetch projects list for filter dropdown
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get('/projects');
        setProjects(res.data.projects || []);
      } catch (err) {
        console.error('Failed to load projects filter:', err);
      }
    };
    fetchProjects();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { page, limit: 10 };
      if (projectFilter !== 'all') params.projectId = projectFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (severityFilter !== 'all') params.severity = severityFilter;
      if (priorityFilter !== 'all') params.priority = priorityFilter;
      if (search.trim()) params.search = search.trim();

      const res = await api.get('/tickets', { params });
      setTickets(res.data.tickets || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalTickets(res.data.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch tickets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page, projectFilter, statusFilter, severityFilter, priorityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setIsModalOpen(true);
  };

  const handleTicketSaved = () => {
    fetchTickets();
  };

  const handleConfirmDelete = async () => {
    if (!deletingTicket) return;
    const tId = deletingTicket._id || deletingTicket.id;

    try {
      setDeleteLoading(true);
      await api.delete(`/tickets/${tId}`);
      setDeletingTicket(null);
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ticket.');
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
            Test Tickets & Stories
          </h2>
          <p className="mt-1 text-sm text-white/45">
            Acceptance criteria, Gherkin scenarios, and automated test specifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchTickets}
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
            <span>New Ticket</span>
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tickets by title or description..."
            className="w-full rounded-xl border border-white/[0.08] bg-white/[0.035] pl-9 pr-3.5 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Project selector */}
          <select
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none max-w-[160px] truncate"
          >
            <option value="all">All Projects</option>
            {projects.map((p) => {
              const pId = p._id || p.id;
              return (
                <option key={pId} value={pId}>
                  {p.name}
                </option>
              );
            })}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Severity filter */}
          <select
            value={severityFilter}
            onChange={(e) => {
              setSeverityFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Priority filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            className="rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs text-white/85 focus:border-neon-cyan/60 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* Main Table / Empty State */}
      {loading && tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-white/45">
          <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mb-3" />
          <p className="text-xs">Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <EmptyState
          icon={TicketIcon}
          title="No Tickets Found"
          description={
            projects.length === 0
              ? 'Create a project first, then add testing tickets with acceptance criteria.'
              : 'Add testing tickets with Gherkin acceptance criteria to synthesize Playwright tests.'
          }
          actionLabel="Create Ticket"
          onAction={handleOpenCreate}
        />
      ) : (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-white/45 font-medium bg-white/[0.015]">
                  <th className="py-3 px-3.5">Title / Summary</th>
                  <th className="py-3 px-3.5">Project</th>
                  <th className="py-3 px-3.5">Severity</th>
                  <th className="py-3 px-3.5">Priority</th>
                  <th className="py-3 px-3.5">Status</th>
                  <th className="py-3 px-3.5">Scenarios</th>
                  <th className="py-3 px-3.5">Created</th>
                  <th className="py-3 px-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-white/70">
                {tickets.map((t) => {
                  const tId = t._id || t.id;
                  const proj = t.project;
                  const projId = proj?._id || proj?.id;
                  const projName = proj?.name || 'Unknown Project';
                  const scenarioCount = t.parsedCriteria?.length || 0;

                  return (
                    <tr key={tId} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 px-3.5 font-medium text-white max-w-xs">
                        <Link
                          to={`/tickets/${tId}`}
                          className="hover:text-neon-cyan transition-colors block truncate"
                          title={t.title}
                        >
                          {t.title}
                        </Link>
                      </td>
                      <td className="py-3 px-3.5 max-w-[140px]">
                        {projId ? (
                          <Link
                            to={`/projects/${projId}`}
                            className="inline-flex items-center gap-1 text-white/70 hover:text-neon-cyan truncate"
                            title={projName}
                          >
                            <Layers className="h-3 w-3 text-white/30 shrink-0" />
                            <span className="truncate">{projName}</span>
                          </Link>
                        ) : (
                          <span className="text-white/30">—</span>
                        )}
                      </td>
                      <td className="py-3 px-3.5">
                        <Badge type="severity" value={t.severity} size="xs" />
                      </td>
                      <td className="py-3 px-3.5">
                        <Badge type="priority" value={t.priority} size="xs" />
                      </td>
                      <td className="py-3 px-3.5">
                        <Badge type="status" value={t.status} size="xs" />
                      </td>
                      <td className="py-3 px-3.5">
                        <span className="inline-flex items-center gap-1 rounded bg-white/[0.06] px-2 py-0.5 font-mono text-[11px] text-white/70 border border-white/[0.10]">
                          <Sparkles className="h-3 w-3 text-neon-cyan" />
                          <span>{scenarioCount}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-white/30 whitespace-nowrap">
                        {formatDate(t.createdAt)}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/tickets/${tId}`}
                            className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white"
                            title="View Ticket Details"
                          >
                            <TicketIcon className="h-3.5 w-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(t)}
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
          </div>

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

      {/* Ticket Create/Edit Modal */}
      <TicketModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        ticket={editingTicket}
        defaultProjectId={projectFilter !== 'all' ? projectFilter : ''}
        onSaved={handleTicketSaved}
      />

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
                onClick={handleConfirmDelete}
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

export default Tickets;
