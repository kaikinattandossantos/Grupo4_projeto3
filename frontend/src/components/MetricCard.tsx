import React from 'react';

interface MetricCardProps {
  value: string | number;
  title: string;
  description: string;
  iconClass: string;
  glowColor?: 'green' | 'blue' | 'teal';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  value,
  title,
  description,
  iconClass,
  glowColor = 'green',
}) => {
  const glowStyles = {
    green: 'bg-accent-green-light text-accent-green shadow-[0_0_15px_rgba(0,161,132,0.2)]',
    blue: 'bg-accent-blue-light text-accent-blue shadow-[0_0_15px_rgba(13,138,255,0.2)]',
    teal: 'bg-accent-teal-light text-accent-teal shadow-[0_0_15px_rgba(32,201,151,0.2)]',
  };

  return (
    <article className="flex items-start gap-4 p-4 rounded-xl border border-text-light/30 bg-bg-card hover:shadow-md transition-all duration-300">
      <div className={`flex items-center justify-center w-12 h-12 rounded-lg shrink-0 ${glowStyles[glowColor]}`}>
        <i className={`${iconClass} text-lg`} aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <strong className="text-xl font-extrabold text-text-main leading-tight">{value}</strong>
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block truncate" title={title}>{title}</span>
        <p className="text-[11px] text-text-muted leading-relaxed mt-1">{description}</p>
      </div>
    </article>
  );
};
