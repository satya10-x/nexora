import React from 'react';

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  badge = 'Coming Soon',
  children,
}) => {
  return (
    <div className="flex min-h-[420px] w-full flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.02] p-8 text-center backdrop-blur-sm">
      {Icon && (
        <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.05] shadow-inner">
          <Icon className="h-8 w-8 text-neon-cyan" />
          <div className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon-cyan opacity-60"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-neon-cyan"></span>
          </div>
        </div>
      )}

      {badge && (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-xs font-medium text-neon-cyan">
          <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan"></span>
          {badge}
        </span>
      )}

      <h3 className="mt-4 text-xl font-semibold text-white tracking-tight">
        {title}
      </h3>

      <p className="mt-2 max-w-md text-sm text-white/45 leading-relaxed">
        {description}
      </p>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
};

export default EmptyState;

