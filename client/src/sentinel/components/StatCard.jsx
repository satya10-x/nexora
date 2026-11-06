import React from 'react';

export const StatCard = ({
  title,
  value = '—',
  icon: Icon,
  description,
  accentColor = 'emerald',
}) => {
  const accentClasses = {
    emerald: 'text-neon-cyan bg-neon-cyan/10 border-neon-cyan/20',
    blue: 'text-sky-300 bg-sky-400/10 border-sky-400/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    purple: 'text-neon-violet bg-neon-violet/10 border-neon-violet/25',
    amber: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  };

  const badgeClass = accentClasses[accentColor] || accentClasses.emerald;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.035] p-5 shadow-sm backdrop-blur-sm transition-all hover:border-white/[0.12]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-white/45">
          {title}
        </span>
        {Icon && (
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg border ${badgeClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {value}
        </span>
      </div>

      {description && (
        <p className="mt-2 text-xs text-white/45 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default StatCard;

