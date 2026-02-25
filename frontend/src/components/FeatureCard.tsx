import {
  Phone, PlusCircle, MapPin, Search, MessageCircle,
  BadgeCheck, Truck, Wallet, Star, ShieldAlert
} from 'lucide-react';
import { Feature } from '../types/blueprint';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone, PlusCircle, MapPin, Search, MessageCircle,
  BadgeCheck, Truck, Wallet, Star, ShieldAlert,
};

const categoryColors: Record<string, string> = {
  Auth: 'bg-primary/10 text-primary',
  Listings: 'bg-accent/20 text-accent-foreground',
  Discovery: 'bg-secondary/15 text-secondary',
  Communication: 'bg-primary/10 text-primary',
  Trust: 'bg-accent/20 text-accent-foreground',
  Logistics: 'bg-secondary/15 text-secondary',
  Payments: 'bg-primary/10 text-primary',
  Safety: 'bg-destructive/10 text-destructive',
};

interface FeatureCardProps {
  feature: Feature;
}

export default function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon] || Phone;
  const catColor = categoryColors[feature.category] || 'bg-muted text-muted-foreground';

  return (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${catColor}`}>
          {feature.category}
        </span>
      </div>
      <div>
        <h3 className="font-heading font-bold text-base text-foreground mb-1">{feature.title}</h3>
        <p className="text-muted-foreground text-sm font-body leading-relaxed">{feature.description}</p>
      </div>
    </div>
  );
}
