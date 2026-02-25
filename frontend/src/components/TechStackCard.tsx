import { TechStackItem } from '../types/blueprint';

const categoryColorMap: Record<string, string> = {
  green: 'bg-primary/10 text-primary border-primary/20',
  gold: 'bg-accent/20 text-accent-foreground border-accent/30',
  terra: 'bg-secondary/15 text-secondary border-secondary/20',
};

interface TechStackCardProps {
  item: TechStackItem;
}

export default function TechStackCard({ item }: TechStackCardProps) {
  const colorClass = categoryColorMap[item.categoryColor] || categoryColorMap.green;

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-3 mb-3">
        <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full border ${colorClass} whitespace-nowrap flex-shrink-0`}>
          {item.category}
        </span>
      </div>
      <h3 className="font-heading font-bold text-base text-foreground mb-2">{item.technology}</h3>
      <p className="text-muted-foreground text-sm font-body leading-relaxed">{item.rationale}</p>
    </div>
  );
}
