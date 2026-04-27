import React from 'react';

const SkillCard = ({ name, icon, proficiency, percentage, years }) => {
  return (
    <div className="border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
      <div className="mb-2.5 flex items-center justify-between gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-accent/15 bg-accent/5">
            {icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-content-primary">{name}</p>
            <p className="text-xs text-content-muted">{years || '2+ years'}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden text-[11px] font-medium uppercase tracking-wide text-content-muted sm:inline">
            {proficiency}
          </span>
          <span className="text-sm font-semibold tabular-nums text-accent">{percentage}%</span>
        </div>
      </div>

      <div className="relative h-1 w-full overflow-hidden rounded-full bg-background/80 ring-1 ring-inset ring-white/[0.06]">
        <div
          className="skill-bar-fill absolute left-0 top-0 h-full rounded-full bg-accent"
          style={{ width: '0%' }}
          data-percent={percentage}
        />
      </div>
    </div>
  );
};

export default SkillCard;
