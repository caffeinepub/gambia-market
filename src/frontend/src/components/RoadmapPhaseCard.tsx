import { RoadmapPhase } from '../types/blueprint';
import { CheckCircle2, Target } from 'lucide-react';

interface RoadmapPhaseCardProps {
  phase: RoadmapPhase;
  isLast: boolean;
}

const phaseColors = [
  { bg: 'bg-primary/8', border: 'border-primary/25', badge: 'bg-primary text-primary-foreground', num: 'text-primary' },
  { bg: 'bg-accent/10', border: 'border-accent/30', badge: 'bg-accent text-accent-foreground', num: 'text-accent-foreground' },
  { bg: 'bg-secondary/8', border: 'border-secondary/25', badge: 'bg-secondary text-secondary-foreground', num: 'text-secondary' },
  { bg: 'bg-primary/8', border: 'border-primary/25', badge: 'bg-primary text-primary-foreground', num: 'text-primary' },
];

export default function RoadmapPhaseCard({ phase, isLast }: RoadmapPhaseCardProps) {
  const color = phaseColors[(phase.phase - 1) % phaseColors.length];

  return (
    <div className="flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full ${color.badge} flex items-center justify-center font-heading font-black text-sm shadow-md flex-shrink-0`}>
          {phase.phase}
        </div>
        {!isLast && <div className="w-0.5 flex-1 bg-border min-h-8 my-2" />}
      </div>

      {/* Content */}
      <div className={`flex-1 rounded-2xl border ${color.border} ${color.bg} p-5 mb-4`}>
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-heading font-black text-base text-foreground">
            Phase {phase.phase}: {phase.name}
          </h3>
          <span className="text-xs font-body font-semibold bg-card border border-border text-muted-foreground px-2.5 py-0.5 rounded-full">
            {phase.timeframe}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {/* Deliverables */}
          <div>
            <p className="text-xs font-body font-bold text-muted-foreground uppercase tracking-wide mb-2">
              Key Deliverables
            </p>
            <ul className="space-y-1.5">
              {phase.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${color.num} flex-shrink-0 mt-0.5`} />
                  <span className="text-xs font-body text-foreground leading-snug">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Success Metrics */}
          <div>
            <p className="text-xs font-body font-bold text-muted-foreground uppercase tracking-wide mb-2">
              Success Metrics
            </p>
            <ul className="space-y-1.5">
              {phase.successMetrics.map((m) => (
                <li key={m} className="flex items-start gap-1.5">
                  <Target className={`w-3.5 h-3.5 ${color.num} flex-shrink-0 mt-0.5`} />
                  <span className="text-xs font-body text-foreground leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
