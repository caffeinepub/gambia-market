import { MVPTimelineWeek } from '../types/blueprint';
import { CheckCircle2 } from 'lucide-react';

interface MVPTimelineProps {
  weeks: MVPTimelineWeek[];
}

export default function MVPTimeline({ weeks }: MVPTimelineProps) {
  const colors = [
    { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
    { bg: 'bg-accent/15', text: 'text-accent-foreground', border: 'border-accent/30', dot: 'bg-accent' },
    { bg: 'bg-secondary/10', text: 'text-secondary', border: 'border-secondary/30', dot: 'bg-secondary' },
    { bg: 'bg-primary/10', text: 'text-primary', border: 'border-primary/30', dot: 'bg-primary' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {weeks.map((week, index) => {
        const color = colors[index % colors.length];
        return (
          <div key={week.weeks} className={`rounded-2xl border ${color.border} ${color.bg} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2.5 h-2.5 rounded-full ${color.dot} flex-shrink-0`} />
              <span className={`text-xs font-body font-bold ${color.text} uppercase tracking-wide`}>{week.weeks}</span>
            </div>
            <h4 className="font-heading font-bold text-sm text-foreground mb-3">{week.milestone}</h4>
            <ul className="space-y-1.5">
              {week.tasks.map((task) => (
                <li key={task} className="flex items-start gap-1.5">
                  <CheckCircle2 className={`w-3.5 h-3.5 ${color.text} flex-shrink-0 mt-0.5`} />
                  <span className="text-xs font-body text-muted-foreground leading-snug">{task}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
