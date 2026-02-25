import { useRef } from 'react';
import { MapPin, Zap, ChevronRight } from 'lucide-react';
import type { PublicListing, ListingId } from '../backend';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '📱', Clothing: '👗', Food: '🥘', Vehicles: '🚗',
  Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
};

interface FeaturedListingsRowProps {
  listings: PublicListing[];
  onListingClick: (id: ListingId) => void;
}

export default function FeaturedListingsRow({ listings, onListingClick }: FeaturedListingsRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!listings || listings.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-4 mb-2">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <h2 className="font-heading font-bold text-sm text-foreground">Featured Listings</h2>
        </div>
        <span className="text-xs text-muted-foreground font-body flex items-center gap-0.5">
          Scroll <ChevronRight className="w-3 h-3" />
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-3 px-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
      >
        {listings.map((listing) => {
          const photoUrl = listing.photos.length > 0 ? listing.photos[0].getDirectURL() : null;
          const categoryIcon = CATEGORY_ICONS[listing.category] || '📦';

          return (
            <button
              key={listing.id.toString()}
              onClick={() => onListingClick(listing.id)}
              className="flex-shrink-0 w-48 snap-start flex flex-col bg-card rounded-xl overflow-hidden border-2 border-accent shadow-card hover:shadow-card-hover active:scale-[0.98] transition-all text-left"
            >
              <div className="relative h-32 w-full bg-muted overflow-hidden">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={listing.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">{categoryIcon}</span>
                  </div>
                )}
                <div className="absolute top-2 left-2 flex items-center gap-1 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Zap className="w-2.5 h-2.5" />
                  Featured
                </div>
              </div>
              <div className="p-2.5">
                <p className="font-heading font-semibold text-xs text-foreground line-clamp-2 leading-tight mb-1">
                  {listing.title}
                </p>
                <p className="font-heading font-bold text-sm text-primary">
                  D {Number(listing.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="text-[10px] font-body truncate">{listing.location}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
