import { MapPin, Zap } from 'lucide-react';
import type { PublicListing, ListingId } from '../backend';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '📱', Clothing: '👗', Food: '🥘', Vehicles: '🚗',
  Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
};

const CONDITION_COLORS: Record<string, string> = {
  New: 'bg-primary/10 text-primary',
  Used: 'bg-muted text-muted-foreground',
  Refurbished: 'bg-accent/10 text-accent-foreground',
};

interface ListingCardProps {
  listing: PublicListing;
  onClick: (id: ListingId) => void;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const photoUrl = listing.photos.length > 0 ? listing.photos[0].getDirectURL() : null;
  const categoryIcon = CATEGORY_ICONS[listing.category] || '📦';
  const conditionClass = CONDITION_COLORS[listing.condition] || CONDITION_COLORS['Used'];

  return (
    <button
      onClick={() => onClick(listing.id)}
      className={`group relative flex flex-col bg-card rounded-xl overflow-hidden text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-card-hover active:scale-[0.97] ${
        listing.isBoosted
          ? 'ring-2 ring-accent shadow-card'
          : 'border border-border shadow-xs hover:border-primary/30'
      }`}
    >
      {/* Sponsored badge */}
      {listing.isBoosted && (
        <div className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          <Zap className="w-2.5 h-2.5" />
          Sponsored
        </div>
      )}

      {/* Photo */}
      <div className="aspect-square w-full bg-muted overflow-hidden">
        {photoUrl ? (
          <img
            src={photoUrl}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-4xl">{categoryIcon}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-2.5 flex flex-col gap-1">
        <p className="font-heading font-semibold text-sm text-foreground line-clamp-2 leading-tight">
          {listing.title}
        </p>
        <p className="font-heading font-bold text-base text-primary">
          D {Number(listing.price).toLocaleString()}
        </p>
        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1 text-muted-foreground min-w-0">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="text-[11px] font-body truncate">{listing.location}</span>
          </div>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full flex-shrink-0 ${conditionClass}`}>
            {listing.condition}
          </span>
        </div>
      </div>
    </button>
  );
}
