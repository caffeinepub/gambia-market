import { Star, MapPin, TrendingUp, Zap } from 'lucide-react';
import { ListingComparison, BoostTier } from '../types/blueprint';

interface BoostedListingMockupProps {
  comparisonDemo: ListingComparison;
  pricingTiers: BoostTier[];
}

export default function BoostedListingMockup({ comparisonDemo, pricingTiers }: BoostedListingMockupProps) {
  return (
    <div className="space-y-6 mt-4">
      {/* Primary Revenue Driver banner */}
      <div className="flex items-center gap-2 bg-accent/10 border border-accent/30 rounded-xl px-4 py-2.5">
        <TrendingUp className="w-5 h-5 text-accent-foreground flex-shrink-0" />
        <span className="font-heading font-bold text-sm text-accent-foreground">
          Primary Revenue Driver — Highest projected income for Gambia Market
        </span>
      </div>

      {/* Side-by-side comparison */}
      <div>
        <h4 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Standard vs Boosted</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Standard listing */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-card flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Standard</span>
            </div>
            <div className="bg-muted h-24 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-muted-foreground/30" />
            </div>
            <div>
              <h5 className="font-heading font-bold text-sm text-foreground">{comparisonDemo.standard.title}</h5>
              <p className="text-primary font-heading font-black text-base">D {comparisonDemo.standard.price.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs font-body text-muted-foreground">{comparisonDemo.standard.location}</span>
              </div>
            </div>
            <div className="text-xs font-body text-muted-foreground bg-muted/50 rounded-lg px-2 py-1.5">
              Normal feed position · No badge
            </div>
          </div>

          {/* Boosted listing */}
          <div className="bg-card border-2 border-accent rounded-2xl p-4 shadow-card ring-2 ring-accent/20 flex flex-col gap-3 relative">
            <div className="absolute -top-3 left-4">
              <span className="bg-accent text-accent-foreground text-xs font-heading font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3 h-3 fill-current" />
                Sponsored
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-body font-semibold text-accent-foreground uppercase tracking-wide">Boosted</span>
            </div>
            <div className="bg-accent/10 h-24 rounded-xl flex items-center justify-center border border-accent/20">
              <Zap className="w-8 h-8 text-accent/50" />
            </div>
            <div>
              <h5 className="font-heading font-bold text-sm text-foreground">{comparisonDemo.boosted.title}</h5>
              <p className="text-primary font-heading font-black text-base">D {comparisonDemo.boosted.price.toLocaleString()}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-secondary" />
                <span className="text-xs font-body text-muted-foreground">{comparisonDemo.boosted.location}</span>
              </div>
            </div>
            <div className="text-xs font-body text-accent-foreground bg-accent/10 rounded-lg px-2 py-1.5 border border-accent/20">
              Top of feed · Gold border · Sponsored badge
            </div>
          </div>
        </div>
      </div>

      {/* Pricing tiers */}
      <div>
        <h4 className="font-heading font-bold text-sm text-muted-foreground uppercase tracking-wide mb-3">Boost Pricing Tiers</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {pricingTiers.map((tier, idx) => (
            <div
              key={tier.duration}
              className={`bg-card rounded-2xl p-4 shadow-card flex flex-col gap-2 border ${
                idx === 1 ? 'border-primary/40 ring-1 ring-primary/20' : 'border-border'
              }`}
            >
              {idx === 1 && (
                <span className="text-xs font-heading font-black text-primary bg-primary/10 px-2 py-0.5 rounded-full self-start">
                  Popular
                </span>
              )}
              <div>
                <span className="font-heading font-black text-2xl text-foreground">D {tier.price}</span>
                <span className="text-xs font-body text-muted-foreground ml-1">{tier.currency}</span>
              </div>
              <span className="font-heading font-bold text-sm text-foreground">{tier.duration}</span>
              <span className="text-xs font-body text-primary font-semibold">{tier.expectedReach}</span>
              <ul className="space-y-1 mt-1">
                {tier.features.map((feat) => (
                  <li key={feat} className="flex items-start gap-1.5 text-xs font-body text-muted-foreground">
                    <span className="text-primary mt-0.5 flex-shrink-0">✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
