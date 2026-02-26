import { FutureFeature } from '../types/blueprint';

interface FutureFeatureCardProps {
  feature: FutureFeature;
}

export default function FutureFeatureCard({ feature }: FutureFeatureCardProps) {
  const isPhase2 = feature.phase === 'Phase 2';

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-heading font-bold text-sm text-foreground leading-snug">{feature.title}</h3>
        <span
          className={`text-xs font-body font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 ${
            isPhase2
              ? 'bg-primary/10 text-primary border border-primary/20'
              : 'bg-secondary/15 text-secondary border border-secondary/20'
          }`}
        >
          {feature.phase}
        </span>
      </div>
      <p className="text-muted-foreground text-xs font-body leading-relaxed">{feature.description}</p>
    </div>
  );
}
