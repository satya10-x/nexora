import React from 'react';

const SEVERITY_CONFIG = {
  critical: { label: 'Critical', bg: 'bg-rose-500/15', text: 'text-rose-300', border: 'border-rose-400/30', dot: 'bg-rose-400' },
  high: { label: 'High', bg: 'bg-amber-400/10', text: 'text-amber-300', border: 'border-amber-400/25', dot: 'bg-amber-400' },
  medium: { label: 'Medium', bg: 'bg-yellow-400/10', text: 'text-yellow-300', border: 'border-yellow-400/25', dot: 'bg-yellow-400' },
  low: { label: 'Low', bg: 'bg-sky-400/10', text: 'text-sky-300', border: 'border-sky-400/25', dot: 'bg-sky-400' },
};

const PRIORITY_CONFIG = {
  high: { label: 'High', bg: 'bg-orange-400/10', text: 'text-orange-300', border: 'border-orange-400/25' },
  medium: { label: 'Medium', bg: 'bg-sky-400/10', text: 'text-sky-300', border: 'border-sky-400/25' },
  low: { label: 'Low', bg: 'bg-white/[0.06]', text: 'text-white/45', border: 'border-white/[0.08]' },
};

const STATUS_CONFIG = {
  open: { label: 'Open', bg: 'bg-neon-cyan/15', text: 'text-neon-cyan', border: 'border-neon-cyan/30', dot: 'bg-neon-cyan' },
  in_progress: { label: 'In Progress', bg: 'bg-sky-400/10', text: 'text-sky-300', border: 'border-sky-400/25', dot: 'bg-sky-400 animate-pulse' },
  resolved: { label: 'Resolved', bg: 'bg-neon-violet/15', text: 'text-neon-violet', border: 'border-neon-violet/30', dot: 'bg-neon-violet' },
  closed: { label: 'Closed', bg: 'bg-white/[0.06]', text: 'text-white/45', border: 'border-white/[0.08]', dot: 'bg-white/30' },
};

const PROJECT_STATUS_CONFIG = {
  active: { label: 'Active', bg: 'bg-neon-cyan/15', text: 'text-neon-cyan', border: 'border-neon-cyan/30' },
  archived: { label: 'Archived', bg: 'bg-white/[0.06]', text: 'text-white/45', border: 'border-white/[0.08]' },
};

const PARSING_STATUS_CONFIG = {
  complete: { label: 'Fully Parsed', bg: 'bg-neon-cyan/15', text: 'text-neon-cyan', border: 'border-neon-cyan/30' },
  parsed: { label: 'Parsed', bg: 'bg-neon-cyan/15', text: 'text-neon-cyan', border: 'border-neon-cyan/30' },
  partial: { label: 'Partially Parsed', bg: 'bg-amber-400/10', text: 'text-amber-300', border: 'border-amber-400/25' },
  unrecognized: { label: 'Unstructured', bg: 'bg-white/[0.06]', text: 'text-white/45', border: 'border-white/[0.08]' },
  empty: { label: 'No Criteria', bg: 'bg-white/[0.06]', text: 'text-white/45', border: 'border-white/[0.08]' },
};

export const Badge = ({ type = 'status', value, size = 'sm', className = '' }) => {
  let config;
  const val = String(value || '').toLowerCase();

  switch (type) {
    case 'severity':
      config = SEVERITY_CONFIG[val] || SEVERITY_CONFIG.medium;
      break;
    case 'priority':
      config = PRIORITY_CONFIG[val] || PRIORITY_CONFIG.medium;
      break;
    case 'projectStatus':
      config = PROJECT_STATUS_CONFIG[val] || PROJECT_STATUS_CONFIG.active;
      break;
    case 'parsingStatus':
      config = PARSING_STATUS_CONFIG[val] || PARSING_STATUS_CONFIG.unrecognized;
      break;
    case 'status':
    default:
      config = STATUS_CONFIG[val] || STATUS_CONFIG.open;
      break;
  }

  const sizeClasses = size === 'xs'
    ? 'text-[10px] px-1.5 py-0.5'
    : 'text-xs px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${config.bg} ${config.text} ${config.border} ${sizeClasses} ${className}`}
    >
      {config.dot && (
        <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default Badge;
