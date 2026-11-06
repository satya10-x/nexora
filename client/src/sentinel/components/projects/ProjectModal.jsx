import React, { useState, useEffect } from 'react';
import { X, Layers, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import api from '../../api/axios.js';

const URL_REGEX = /^(https?:\/\/)(localhost|127\.0\.0\.1|([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}|[a-zA-Z0-9-]+)(:[0-9]{1,5})?(\/.*)?$/i;

export const ProjectModal = ({ isOpen, onClose, project = null, onSaved }) => {
  const isEditing = Boolean(project);

  const [formData, setFormData] = useState({
    name: '',
    targetUrl: '',
    description: '',
    status: 'active',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || '',
        targetUrl: project.targetUrl || '',
        description: project.description || '',
        status: project.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        targetUrl: '',
        description: '',
        status: 'active',
      });
    }
    setError('');
  }, [project, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleUseDemoApp = () => {
    setFormData((prev) => ({
      ...prev,
      name: prev.name || 'ShopEase E-Commerce Store',
      targetUrl: 'http://localhost:4000',
      description: prev.description || 'Target application for autonomous QA tests and locator mutation recovery',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedName = formData.name.trim();
    const trimmedUrl = formData.targetUrl.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setError('Project name is required and must be at least 2 characters.');
      return;
    }

    if (!trimmedUrl || !URL_REGEX.test(trimmedUrl)) {
      setError('Please provide a valid target URL (e.g. http://localhost:4000 or https://example.com).');
      return;
    }

    setLoading(true);

    try {
      let response;
      const payload = {
        name: trimmedName,
        targetUrl: trimmedUrl,
        description: formData.description.trim(),
        status: formData.status,
      };

      const projectId = project?._id || project?.id;

      if (isEditing) {
        response = await api.patch(`/projects/${projectId}`, payload);
      } else {
        response = await api.post('/projects', payload);
      }

      const saved = response.data.project;
      if (onSaved) onSaved(saved);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save project.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-ink-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4 bg-white/[0.035]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                {isEditing ? 'Edit Project' : 'Create New Project'}
              </h3>
              <p className="text-xs text-white/45">
                {isEditing ? 'Update target URL or configuration' : 'Configure application target and QA repository'}
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick preset for Demo App */}
          {!isEditing && (
            <div className="flex items-center justify-between rounded-xl bg-neon-cyan/[0.04] border border-neon-cyan/20 px-3.5 py-2.5 text-xs">
              <span className="text-white/70">Testing the local ShopEase Demo App?</span>
              <button
                type="button"
                onClick={handleUseDemoApp}
                className="font-medium text-neon-cyan hover:text-neon-cyan/90 underline underline-offset-2 flex items-center gap-1"
              >
                <span>Auto-fill Demo App</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Project Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-white/70 mb-1.5">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. ShopEase E-Commerce QA"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60"
            />
          </div>

          {/* Target URL */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="targetUrl" className="block text-xs font-medium text-white/70">
                Target Application URL <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-white/30">Supports localhost:4000</span>
            </div>
            <input
              id="targetUrl"
              name="targetUrl"
              type="text"
              required
              value={formData.targetUrl}
              onChange={handleChange}
              placeholder="http://localhost:4000 or https://app.example.com"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60 font-mono text-xs"
            />
            <p className="mt-1 text-[11px] text-white/30">
              The base URL where tests will execute against.
            </p>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-xs font-medium text-white/70 mb-1.5">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-white focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs font-medium text-white/70 mb-1.5">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              placeholder="Testing scope, repo links, or team objectives..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2 text-sm text-white placeholder-white/25 focus:border-neon-cyan/60 focus:outline-none focus:ring-1 focus:ring-neon-cyan/60 resize-none text-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/[0.08]">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-white/[0.08] bg-white/[0.05] px-4 py-2 text-xs font-medium text-white/70 hover:bg-white/[0.06] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl btn-sentinel-primary px-4 py-2 text-xs font-semibold text-white shadow-sm hover:brightness-110 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Project'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;

