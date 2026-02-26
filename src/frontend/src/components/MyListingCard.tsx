import React, { useState } from 'react';
import { Edit2, Trash2, Zap, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicListing, ListingCategory } from '../backend';
import BoostModal from './BoostModal';

interface MyListingCardProps {
  listing: PublicListing;
  onEdit: () => void;
  onClick: (listingId: bigint) => void;
  onDelete: () => void;
}

const CATEGORY_EMOJI: Record<string, string> = {
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

export default function MyListingCard({ listing, onEdit, onClick, onDelete }: MyListingCardProps) {
  const [boostOpen, setBoostOpen] = useState(false);

  const thumbnailUrl = listing.photos.length > 0
    ? listing.photos[0].getDirectURL()
    : null;

  const emoji = CATEGORY_EMOJI[listing.category as string] || '📦';

  const statusColor = listing.status === 'Active'
    ? 'bg-green-100 text-green-700 border-green-200'
    : listing.status === 'Sold'
    ? 'bg-gray-100 text-gray-600 border-gray-200'
    : 'bg-yellow-100 text-yellow-700 border-yellow-200';

  return (
    <>
      <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex gap-3 p-3">
          {/* Thumbnail */}
          <div
            className="w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0 cursor-pointer"
            onClick={() => onClick(listing.id)}
          >
            {thumbnailUrl ? (
              <img
                src={thumbnailUrl}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                {emoji}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3
                className="font-semibold text-foreground text-sm leading-tight line-clamp-2 cursor-pointer hover:text-brand-green transition-colors"
                onClick={() => onClick(listing.id)}
              >
                {listing.title}
              </h3>
              <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 font-medium ${statusColor}`}>
                {listing.status}
              </span>
            </div>

            <p className="text-brand-green font-bold text-sm mt-1">
              D {Number(listing.price).toLocaleString()}
            </p>

            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              📍 {listing.location}
            </p>

            {listing.isBoosted && (
              <span className="inline-flex items-center gap-1 text-xs text-brand-gold font-medium mt-1">
                <Zap className="w-3 h-3 fill-brand-gold" />
                Boosted
              </span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex border-t border-border">
          <button
            onClick={() => onClick(listing.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            View
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-brand-green hover:bg-brand-green/5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => setBoostOpen(true)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-brand-gold hover:bg-brand-gold/5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            Boost
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      <BoostModal
        listingId={listing.id}
        isOpen={boostOpen}
        onClose={() => setBoostOpen(false)}
      />
    </>
  );
}
