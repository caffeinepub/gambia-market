import SectionContainer from './SectionContainer';
import RevenueCard from './RevenueCard';
import BoostedListingMockup from './BoostedListingMockup';
import { revenueStreams } from '../data/monetization';

export default function MonetizationSection() {
  const primary = revenueStreams.filter((s) => s.isPrimary);
  const secondary = revenueStreams.filter((s) => !s.isPrimary);

  return (
    <SectionContainer
      title="Monetization Strategy"
      subtitle="6 revenue streams designed for the Gambian market — starting simple and scaling with user growth."
    >
      {/* Primary stream highlighted */}
      <div className="mb-8">
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Primary Revenue Driver
        </h3>
        {primary.map((stream) => (
          <div key={stream.id} className="bg-card border-2 border-accent rounded-3xl p-5 shadow-card ring-2 ring-accent/20">
            <RevenueCard stream={stream} />
            {stream.comparisonDemo && stream.pricingTiers && (
              <BoostedListingMockup
                comparisonDemo={stream.comparisonDemo}
                pricingTiers={stream.pricingTiers}
              />
            )}
          </div>
        ))}
      </div>

      {/* Secondary streams */}
      <div>
        <h3 className="font-heading font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-4">
          Additional Revenue Streams
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondary.map((stream) => (
            <RevenueCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>
    </SectionContainer>
  );
}
