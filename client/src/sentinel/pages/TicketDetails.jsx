import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Ticket as TicketIcon,
  Layers,
  Edit2,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  AlertTriangle,
  FileText,
  ListOrdered,
  CheckCircle2,
  HelpCircle,
  Code,
} from 'lucide-react';
import api from '../api/axios.js';
import Badge from '../components/common/Badge.jsx';
import CriteriaScenarioCard from '../components/tickets/CriteriaScenarioCard.jsx';
import TicketModal from '../components/tickets/TicketModal.jsx';
import { formatDate } from '../utils/formatters.js';

export const TicketDetails = () => {
  const { ticketId } = useParams();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRawCriteria, setShowRawCriteria] = useState(false);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get(`/tickets/${ticketId}`);
      setTicket(res.data.ticket);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load ticket.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [ticketId]);

  const handleSaved = (updated) => {
    setTicket(updated);
    fetchTicket();
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await api.delete(`/tickets/${ticketId}`);
      navigate('/tickets');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete ticket.');
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/45">
        <Loader2 className="h-8 w-8 animate-spin text-neon-cyan mb-3" />
        <p className="text-xs">Loading ticket details...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="space-y-4">
        <Link
          to="/tickets"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-white/45 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Tickets</span>
        </Link>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-5 text-rose-300 text-xs">
          {error || 'Ticket not found or access denied.'}
        </div>
      </div>
    );
  }

  const proj = ticket.project || {};
  const projId = proj._id || proj.id;
  const scenarios = ticket.parsedCriteria || [];

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <div>
        <div className="flex items-center gap-2 text-xs text-white/45 mb-4">
          <Link to="/tickets" className="hover:text-white transition-colors">
            Tickets
          </Link>
          <span>/</span>
          {projId && (
            <>
              <Link to={`/projects/${projId}`} className="hover:text-neon-cyan transition-colors">
                {proj.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-white/85 truncate max-w-xs">{ticket.title}</span>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {ticket.title}
              </h2>
              <Badge type="status" value={ticket.status} />
              <Badge type="severity" value={ticket.severity} />
              <Badge type="priority" value={ticket.priority} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-white/45 pt-1">
              {projId && (
                <Link
                  to={`/projects/${projId}`}
                  className="inline-flex items-center gap-1.5 text-white/70 hover:text-neon-cyan font-medium"
                >
                  <Layers className="h-3.5 w-3.5 text-white/30" />
                  <span>{proj.name}</span>
                </Link>
              )}
              {proj.targetUrl && (
                <span className="flex items-center gap-1 font-mono text-[11px] text-white/45 bg-white/[0.02] border border-white/[0.08] px-2 py-0.5 rounded">
                  <span>Target: {proj.targetUrl}</span>
                  <a
                    href={proj.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neon-cyan"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </span>
              )}
              <span>•</span>
              <span>Created {formatDate(ticket.createdAt)}</span>
            </div>

            {ticket.description && (
              <p className="mt-2 text-xs text-white/70 leading-relaxed max-w-3xl">
                {ticket.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3.5 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Ticket</span>
            </button>
            <button
              type="button"
              onClick={() => setIsDeleteOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/20 bg-rose-500/10 px-3.5 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Acceptance Criteria Scenarios (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-neon-cyan" />
                <div>
                  <h3 className="text-base font-semibold text-white">
                    Acceptance Criteria & Scenarios
                  </h3>
                  <p className="text-xs text-white/45">
                    Rule-based parsed Gherkin clauses preserving givenAnd, whenAnd, thenAnd
                  </p>
                </div>
              </div>

              {ticket.acceptanceCriteria && (
                <button
                  type="button"
                  onClick={() => setShowRawCriteria(!showRawCriteria)}
                  className="text-xs text-white/45 hover:text-white/85 inline-flex items-center gap-1 underline underline-offset-2"
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>{showRawCriteria ? 'Hide Raw Gherkin' : 'View Raw Gherkin'}</span>
                </button>
              )}
            </div>

            {/* Raw Criteria Text Box */}
            {showRawCriteria && ticket.acceptanceCriteria && (
              <div className="rounded-xl border border-white/[0.08] bg-black/60 p-4 font-mono text-xs text-white/70 whitespace-pre-wrap">
                {ticket.acceptanceCriteria}
              </div>
            )}

            {/* Parsed Scenarios */}
            {scenarios.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-white/[0.08] rounded-xl text-white/45">
                <FileText className="h-8 w-8 mx-auto mb-2 text-white/25" />
                <p className="text-xs font-medium text-white/70">No structured scenarios parsed</p>
                <p className="text-[11px] text-white/30 mt-1">
                  Add criteria using Given / When / Then to automatically extract structured scenarios.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {scenarios.map((scenario, idx) => (
                  <CriteriaScenarioCard
                    key={idx}
                    scenario={scenario}
                    index={idx}
                    defaultExpanded={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Expected & Actual Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <h4 className="text-xs font-semibold text-white/85 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-neon-cyan" />
                <span>Expected Result</span>
              </h4>
              <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                {ticket.expectedResult || <span className="text-white/30 italic">No expected result specified.</span>}
              </p>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <h4 className="text-xs font-semibold text-white/85 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                <span>Actual Result / Bug Behavior</span>
              </h4>
              <p className="text-xs text-white/70 leading-relaxed whitespace-pre-wrap">
                {ticket.actualResult || <span className="text-white/30 italic">None recorded.</span>}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Metadata & Reproduction Steps (1 col) */}
        <div className="space-y-6">
          {/* Reproduction Steps Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 space-y-3">
            <h4 className="text-xs font-semibold text-white/85 flex items-center gap-1.5 border-b border-white/[0.06] pb-2">
              <ListOrdered className="h-4 w-4 text-neon-violet" />
              <span>Reproduction Steps</span>
            </h4>

            {Array.isArray(ticket.reproductionSteps) && ticket.reproductionSteps.length > 0 ? (
              <ol className="list-decimal list-inside space-y-2 text-xs text-white/70">
                {ticket.reproductionSteps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed">
                    <span className="font-mono text-white/85">{step}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-xs text-white/30 italic">No reproduction steps logged.</p>
            )}
          </div>

          {/* Ticket Metadata Card */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 space-y-3 text-xs">
            <h4 className="font-semibold text-white/85 border-b border-white/[0.06] pb-2">
              Ticket Information
            </h4>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-white/30">Ticket ID</span>
                <span className="font-mono text-white/70">{ticket._id || ticket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Target Project</span>
                <span className="text-white/85 font-medium">{proj.name || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Severity</span>
                <Badge type="severity" value={ticket.severity} size="xs" />
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Priority</span>
                <Badge type="priority" value={ticket.priority} size="xs" />
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Status</span>
                <Badge type="status" value={ticket.status} size="xs" />
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Created At</span>
                <span className="text-white/70">{formatDate(ticket.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/30">Updated At</span>
                <span className="text-white/70">{formatDate(ticket.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Ticket Modal */}
      <TicketModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        ticket={ticket}
        defaultProjectId={projId}
        onSaved={handleSaved}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteOpen && (
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
              Are you sure you want to delete <strong className="text-white">"{ticket.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteLoading}
                className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
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

export default TicketDetails;

