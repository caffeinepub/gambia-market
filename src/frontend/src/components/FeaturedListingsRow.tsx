import React from 'react';
import { MapPin, Zap, ChevronRight } from 'lucide-react';
import { PublicListing, ListingCategory } from '../backend';

interface FeaturedListingsRowProps {
  listings: PublicListing[];
  onListingClick: (id: bigint) => void;
}

const categoryEmoji: Record<string, string> = {
  [ListingCategory.carsAndTrucks]: '🚗',
  [ListingCategory.motorcycles]: '🏍️',
  [ListingCategory.bicycles]: '🚲',
  [ListingCategory.spareParts]: '🔧',
  [ListingCategory.electronics]: '💻',
  [ListingCategory.phones]: '📱',
  [ListingCategory.laptops]: '💻',
  [ListingCategory.furniture]: '🛋️',
  [ListingCategory.appliances]: '🏠',
  [ListingCategory.clothing]: '👕',
  [ListingCategory.shoes]: '👟',
  [ListingCategory.fashion]: '👗',
  [ListingCategory.beauty]: '💄',
  [ListingCategory.health]: '💊',
  [ListingCategory.services]: '🛠️',
  [ListingCategory.pets]: '🐾',
  [ListingCategory.realEstate]: '🏡',
  [ListingCategory.other]: '📦',
};

export default function FeaturedListingsRow({ listings, onListingClick }: FeaturedListingsRowProps) {
  if (!listings || listings.length === 0) return null;

  return (
    <section className="px-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--accent)' }} />
          <h2 className="font-display font-bold text-base text-foreground">Featured</h2>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold font-body text-accent-foreground"
            style={{ background: 'var(--accent)' }}>
            <Zap className="w-2.5 h-2.5" />
            Boosted
          </span>
        </div>
        <button className="flex items-center gap-1 text-xs font-body font-medium text-primary hover:text-primary/80 transition-colors">
          See all <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {listings.map((listing) => {
          const emoji = categoryEmoji[listing.category as string] || '📦';
          const hasPhoto = listing.photos && listing.photos.length > 0;

          return (
            <button
              key={listing.id.toString()}
              onClick={() => onListingClick(listing.id)}
              className="shrink-0 w-44 text-left bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-card group"
            >
              <div className="relative h-28 bg-muted overflow-hidden">
                {hasPhoto ? (
                  <img
                    src={listing.photos[0].getDirectURL()}
                    alt={listing.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-3xl opacity-40">{emoji}</span>
                  </div>
                )}
                <div className="absolute top-1.5 left-1.5">
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-body text-accent-foreground"
                    style={{ background: 'var(--accent)' }}>
                    <Zap className="w-2 h-2" />
                    Featured
                  </span>
                </div>
              </div>
              <div className="p-2.5">
                <p className="font-body font-semibold text-xs text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                  {listing.title}
                </p>
                <p className="font-display font-bold text-sm" style={{ color: 'var(--brand-coral)' }}>
                  D {Number(listing.price).toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="text-[10px] font-body truncate">{listing.location}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
