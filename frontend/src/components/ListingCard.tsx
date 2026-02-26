import React from 'react';
import { MapPin, Zap, Tag } from 'lucide-react';
import { PublicListing, ListingCategory, ListingId } from '../backend';

interface ListingCardProps {
  listing: PublicListing;
  onClick: (id: ListingId) => void;
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

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const emoji = categoryEmoji[listing.category as string] || '📦';
  const hasPhoto = listing.photos && listing.photos.length > 0;

  return (
    <button
      onClick={() => onClick(listing.id)}
      className="group w-full text-left bg-card rounded-2xl border border-border overflow-hidden card-hover shadow-card"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {hasPhoto ? (
          <img
            src={listing.photos[0].getDirectURL()}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-40">{emoji}</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.isBoosted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-body text-accent-foreground shadow-sm"
              style={{ background: 'var(--accent)' }}>
              <Zap className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {listing.status !== 'Active' && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="px-3 py-1 rounded-lg bg-card text-foreground text-xs font-bold font-body">
              {listing.status}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-body font-semibold text-sm text-foreground line-clamp-2 leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-base" style={{ color: 'var(--brand-coral)' }}>
            D {Number(listing.price).toLocaleString()}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px] font-body font-medium">
            <Tag className="w-2.5 h-2.5" />
            {listing.condition}
          </span>
        </div>

        <div className="flex items-center gap-1 mt-2 text-muted-foreground">
          <MapPin className="w-3 h-3 shrink-0" />
          <span className="text-xs font-body truncate">{listing.location}</span>
        </div>
      </div>
    </button>
  );
}
