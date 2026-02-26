import { RevenueStream } from '../types/blueprint';
import { TrendingUp, Star } from 'lucide-react';

const typeColors: Record<string, string> = {
  'Pay-per-use': 'bg-primary/10 text-primary border-primary/20',
  'Subscription': 'bg-accent/20 text-accent-foreground border-accent/30',
  'Commission': 'bg-secondary/15 text-secondary border-secondary/20',
  'Sponsorship': 'bg-accent/20 text-accent-foreground border-accent/30',
  'Partnership': 'bg-primary/10 text-primary border-primary/20',
};

interface RevenueCardProps {
  stream: RevenueStream;
}

export default function RevenueCard({ stream }: RevenueCardProps) {
  const typeColor = typeColors[stream.revenueType] || 'bg-muted text-muted-foreground border-border';

  return (
    <div
      className={`relative bg-card rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-3 ${
        stream.isPrimary
          ? 'border-2 border-accent ring-2 ring-accent/20'
          : 'border border-border'
      }`}
    >
      {stream.isPrimary && (
        <div className="absolute -top-3 left-5">
          <span className="bg-accent text-accent-foreground text-xs font-heading font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
            <Star className="w-3 h-3 fill-current" />
            Primary Revenue
          </span>
        </div>
      )}

      <div className="flex items-start justify-between gap-2 mt-1">
        <h3 className="font-heading font-bold text-base text-foreground leading-snug">{stream.title}</h3>
        <span className={`text-xs font-body font-semibold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${typeColor}`}>
          {stream.revenueType}
        </span>
      </div>

      <p className="text-muted-foreground text-sm font-body leading-relaxed">{stream.description}</p>

      <div className="flex items-start gap-2 bg-muted/50 rounded-xl p-3 mt-auto">
        <TrendingUp className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <p className="text-xs font-body text-foreground leading-relaxed">{stream.projectedImpact}</p>
      </div>
    </div>
  );
}
