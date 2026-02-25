import { MapPin, Smartphone, Armchair, Zap, Bike } from 'lucide-react';
import { SampleListing } from '../types/blueprint';

const categoryIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Electronics: Smartphone,
  'Home & Garden': Armchair,
  Other: Bike,
};

const DefaultIcon = Zap;

interface HomeFeedMockupProps {
  listings: SampleListing[];
}

export default function HomeFeedMockup({ listings }: HomeFeedMockupProps) {
  return (
    <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {listings.map((listing) => {
        const CatIcon = categoryIconMap[listing.category] || DefaultIcon;
        return (
          <div
            key={listing.id}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 flex flex-col"
          >
            {/* Image placeholder */}
            <div className={`${listing.imagePlaceholder} h-28 flex items-center justify-center relative`}>
              <CatIcon className="w-10 h-10 text-foreground/20" />
              <span className="absolute top-2 right-2 bg-card/90 text-foreground text-xs font-body px-1.5 py-0.5 rounded-full border border-border">
                {listing.condition}
              </span>
            </div>

            {/* Details */}
            <div className="p-3 flex flex-col gap-1.5 flex-1">
              <h4 className="font-heading font-bold text-sm text-foreground leading-tight line-clamp-2">{listing.title}</h4>
              <p className="text-primary font-heading font-black text-base">
                D {listing.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-auto">
                <MapPin className="w-3 h-3 text-secondary flex-shrink-0" />
                <span className="text-xs font-body text-muted-foreground truncate">{listing.location}</span>
                <span className="text-xs font-body text-muted-foreground ml-auto flex-shrink-0">{listing.distance}km</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
