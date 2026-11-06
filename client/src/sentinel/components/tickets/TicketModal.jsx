import React, { useState, useEffect, useRef } from 'react';
import { X, Ticket, AlertCircle, Loader2, Sparkles, CheckCircle2, Wand2 } from 'lucide-react';
import api from '../../api/axios.js';
import CriteriaScenarioCard from './CriteriaScenarioCard.jsx';
import Badge from '../common/Badge.jsx';

const SAMPLE_CRITERIA = `Scenario: User Authentication Flow
Given user navigates to "/login"
And user enters valid demo credentials
When user clicks "#login-btn"
Then user is redirected to "/dashboard"
And session cookie "session_id" is set`;

export const TicketModal = ({
  isOpen,
  onClose,
  ticket = null,
  defaultProjectId = '',
  onSaved,
}) => {
  const isEditing = Boolean(ticket);

  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    project: defaultProjectId || '',
    severity: 'medium',
    priority: 'medium',
    status: 'open',
    acceptanceCriteria: '',
    expectedResult: '',
    actualResult: '',
    reproductionSteps: '',
  });

  const [parsedPreview, setParsedPreview] = useState(null);
  const [parsingLoading, setParsingLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const debounceTimeoutRef = useRef(null);

  // Fetch available projects for dropdown
  useEffect(() => {
    if (!isOpen) return;

    const fetchProjects = async () => {
      try {
        setLoadingProjects(true);
        const res = await api.get('/projects?status=active');
        const list = res.data.projects || [];
        setProjects(list);

        if (!formData.project) {
          if (defaultProjectId) {
            setFormData((prev) => ({ ...prev, project: defaultProjectId }));
          } else if (list.length > 0) {
            setFormData((prev) => ({ ...prev, project: list[0]._id || list[0].id }));
          }
        }
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchProjects();
  }, [isOpen, defaultProjectId]);

  // Initialize form state
  useEffect(() => {
    if (ticket) {
      const projId = typeof ticket.project === 'object'
        ? (ticket.project?._id || ticket.project?.id)
        : ticket.project;

      setFormData({
        title: ticket.title || '',
        project: projId || defaultProjectId || '',
        severity: ticket.severity || 'medium',
        priority: ticket.priority || 'medium',
        status: ticket.status || 'open',
        acceptanceCriteria: ticket.acceptanceCriteria || '',
        expectedResult: ticket.expectedResult || '',
        actualResult: ticket.actualResult || '',
        reproductionSteps: Array.isArray(ticket.reproductionSteps)
          ? ticket.reproductionSteps.join('\n')
          : (ticket.reproductionSteps || ''),
      });

      if (ticket.parsedCriteria && ticket.parsedCriteria.length > 0) {
        setParsedPreview({
          scenarios: ticket.parsedCriteria,
          totalScenarios: ticket.parsedCriteria.length,
          parsingStatus: 'complete',
          confidenceScore: 100,
        });
      } else {
        setParsedPreview(null);
      }
    } else {
      setFormData({
        title: '',
        project: defaultProjectId || (projects[0]?._id || projects[0]?.id || ''),
        severity: 'medium',
        priority: 'medium',
        status: 'open',
        acceptanceCriteria: '',
        expectedResult: '',
        actualResult: '',
        reproductionSteps: '',
      });
      setParsedPreview(null);
    }
    setError('');
  }, [ticket, isOpen, defaultProjectId]);

  // Debounced live criteria parsing preview
  const triggerCriteriaParse = (text) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (!text || !text.trim()) {
      setParsedPreview(null);
      setParsingLoading(false);
      return;
    }

    setParsingLoading(true);
    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        const res = await api.post('/tickets/parse-criteria', { criteria: text });
        setParsedPreview(res.data);
      } catch (err) {
        console.warn('Failed to parse criteria preview:', err);
      } finally {
        setParsingLoading(false);
      }
    }, 400);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');

    if (name === 'acceptanceCriteria') {
      triggerCriteriaParse(value);
    }
  };

  const handleInsertSample = () => {
    setFormData((prev) => ({
      ...prev,
      acceptanceCriteria: SAMPLE_CRITERIA,
      title: prev.title || 'AUTH-101: Verify standard user authentication',
      expectedResult: prev.expectedResult || 'User lands on /dashboard with greeting and valid session cookie',
    }));
    triggerCriteriaParse(SAMPLE_CRITERIA);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedTitle = formData.title.trim();
    if (!trimmedTitle || trimmedTitle.length < 3) {
      setError('Ticket title is required and must be at least 3 characters.');
      return;
    }

    if (!formData.project) {
      setError('Please select a project for this ticket.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: trimmedTitle,
        severity: formData.severity,
        priority: formData.priority,
        status: formData.status,
        acceptanceCriteria: formData.acceptanceCriteria.trim(),
        expectedResult: formData.expectedResult.trim(),
        actualResult: formData.actualResult.trim(),
        reproductionSteps: formData.reproductionSteps
          ? formData.reproductionSteps.split('\n').map((s) => s.trim()).filter(Boolean)
          : [],
      };

      let response;
      const ticketId = ticket?._id || ticket?.id;

      if (isEditing) {
        response = await api.patch(`/tickets/${ticketId}`, payload);
      } else {
        response = await api.post(`/projects/${formData.project}/tickets`, payload);
      }

      const saved = response.data.ticket;
      if (onSaved) onSaved(saved);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save ticket.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-2xl border border-white/[0.08] bg-ink-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.035] sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-violet/10 border border-neon-violet/25 text-neon-violet">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isEditing ? 'Edit Ticket' : 'Create QA Ticket'}
              </h3>
              <p className="text-xs text-white/45">
                {isEditing ? 'Update ticket details and acceptance criteria' : 'Define user story, Gherkin criteria & expected outcomes'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/45 hover:bg-white/[0.06] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Project & Title row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label htmlFor="project" className="block text-xs font-medium text-white/70 mb-1.5">
                Target Project <span className="text-rose-400">*</span>
              </label>
              <select
                id="project"
                name="project"
                disabled={isEditing || loadingProjects}
                value={formData.project}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60 disabled:opacity-60"
              >
                {projects.map((p) => {
                  const pId = p._id || p.id;
                  return (
                    <option key={pId} value={pId}>
                      {p.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-xs font-medium text-white/70 mb-1.5">
                Ticket Title / Summary <span className="text-rose-400">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. AUTH-101: Standard User Login Flow"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60"
              />
            </div>
          </div>

          {/* Severity, Priority, Status row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="severity" className="block text-xs font-medium text-white/70 mb-1.5">
                Severity
              </label>
              <select
                id="severity"
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-neon-cyan/60 focus:outline-none"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-xs font-medium text-white/70 mb-1.5">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-neon-cyan/60 focus:outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-xs font-medium text-white/70 mb-1.5">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white focus:border-neon-cyan/60 focus:outline-none"
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          {/* Acceptance Criteria Input with Live Gherkin Parser Preview */}
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.015] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-neon-cyan" />
                <label htmlFor="acceptanceCriteria" className="text-xs font-semibold text-white/85">
                  Acceptance Criteria (Gherkin or Natural Language)
                </label>
              </div>

              <div className="flex items-center gap-2">
                {parsingLoading && (
                  <span className="flex items-center gap-1 text-[11px] text-white/45">
                    <Loader2 className="h-3 w-3 animate-spin text-neon-cyan" />
                    <span>Parsing...</span>
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleInsertSample}
                  className="text-[11px] font-medium text-neon-cyan hover:text-neon-cyan/90 underline underline-offset-2"
                >
                  Insert Sample Gherkin
                </button>
              </div>
            </div>

            <textarea
              id="acceptanceCriteria"
              name="acceptanceCriteria"
              rows={5}
              value={formData.acceptanceCriteria}
              onChange={handleChange}
              placeholder={`Given user is on "/login"\nAnd credentials are valid\nWhen user clicks submit\nThen user should be on "/dashboard"`}
              className="w-full rounded-xl border border-white/[0.08] bg-black/50 p-3 text-xs font-mono text-white placeholder-white/20 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60 resize-y"
            />

            {/* Live Parser Feedback */}
            {parsedPreview && (
              <div className="mt-2 space-y-2 border-t border-white/[0.08] pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white/70 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-neon-cyan" />
                    <span>Criteria Parser Live Preview</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge type="parsingStatus" value={parsedPreview.parsingStatus} size="xs" />
                    <span className="text-[11px] font-medium text-white/45">
                      {parsedPreview.totalScenarios} scenario{parsedPreview.totalScenarios === 1 ? '' : 's'} ({parsedPreview.confidenceScore}% confidence)
                    </span>
                  </div>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {parsedPreview.scenarios?.map((scenario, sIdx) => (
                    <CriteriaScenarioCard key={sIdx} scenario={scenario} index={sIdx} defaultExpanded={true} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Expected & Actual Results */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="expectedResult" className="block text-xs font-medium text-white/70 mb-1.5">
                Expected Result
              </label>
              <textarea
                id="expectedResult"
                name="expectedResult"
                rows={2}
                value={formData.expectedResult}
                onChange={handleChange}
                placeholder="Expected behavior after test execution..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label htmlFor="actualResult" className="block text-xs font-medium text-white/70 mb-1.5">
                Actual Result (if bug/defect)
              </label>
              <textarea
                id="actualResult"
                name="actualResult"
                rows={2}
                value={formData.actualResult}
                onChange={handleChange}
                placeholder="Observed behavior or mutation error..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Reproduction Steps */}
          <div>
            <label htmlFor="reproductionSteps" className="block text-xs font-medium text-white/70 mb-1.5">
              Reproduction Steps (one per line)
            </label>
            <textarea
              id="reproductionSteps"
              name="reproductionSteps"
              rows={2}
              value={formData.reproductionSteps}
              onChange={handleChange}
              placeholder={`1. Open browser to http://localhost:4000\n2. Fill username\n3. Click Login`}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-xs text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none resize-none font-mono text-[11px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08] sticky bottom-0 bg-ink-800 py-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl btn-sentinel-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-colors disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Ticket'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketModal;

