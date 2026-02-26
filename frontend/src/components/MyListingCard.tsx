import React, { useState } from 'react';
import { MapPin, Edit2, Trash2, Zap, Tag, MoreVertical } from 'lucide-react';
import { PublicListing, ListingId, ListingCategory } from '../backend';
import { useDeleteListing } from '../hooks/useQueries';
import BoostModal from './BoostModal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface MyListingCardProps {
  listing: PublicListing;
  onEdit: () => void;
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

export default function MyListingCard({ listing, onEdit, onClick }: MyListingCardProps) {
  const [showBoostModal, setShowBoostModal] = useState(false);
  const deleteListing = useDeleteListing();
  const emoji = categoryEmoji[listing.category as string] || '📦';
  const hasPhoto = listing.photos && listing.photos.length > 0;

  const statusColor = listing.status === 'Active'
    ? 'text-success bg-success/10 border-success/20'
    : listing.status === 'Sold'
    ? 'text-muted-foreground bg-muted border-border'
    : 'text-warning bg-warning/10 border-warning/20';

  return (
    <>
      <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
        <div className="flex gap-3 p-3">
          {/* Thumbnail */}
          <button
            onClick={() => onClick(listing.id)}
            className="w-20 h-20 rounded-xl bg-muted overflow-hidden shrink-0 border border-border"
          >
            {hasPhoto ? (
              <img
                src={listing.photos[0].getDirectURL()}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-2xl opacity-40">{emoji}</span>
              </div>
            )}
          </button>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <button
                onClick={() => onClick(listing.id)}
                className="font-body font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition-colors text-left"
              >
                {listing.title}
              </button>
              <div className="flex items-center gap-1 shrink-0">
                {listing.isBoosted && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold font-body text-accent-foreground"
                    style={{ background: 'var(--accent)' }}>
                    <Zap className="w-2 h-2" />
                    Boosted
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-display font-bold text-base" style={{ color: 'var(--brand-coral)' }}>
                D {Number(listing.price).toLocaleString()}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-body font-semibold border ${statusColor}`}>
                {listing.status}
              </span>
            </div>

            <div className="flex items-center gap-1 text-muted-foreground mb-2">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="text-xs font-body truncate">{listing.location}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-border bg-muted text-foreground text-xs font-body font-medium hover:border-primary/40 hover:bg-muted/80 transition-all"
              >
                <Edit2 className="w-3 h-3" />
                Edit
              </button>
              <button
                onClick={() => setShowBoostModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-body font-medium text-accent-foreground transition-all"
                style={{ background: 'var(--accent)' }}
              >
                <Zap className="w-3 h-3" />
                Boost
              </button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-destructive/30 bg-destructive/5 text-destructive text-xs font-body font-medium hover:bg-destructive/10 transition-all">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">Delete Listing?</AlertDialogTitle>
                    <AlertDialogDescription className="font-body">
                      This will permanently remove "{listing.title}" from the marketplace.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl font-body">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteListing.mutate(listing.id)}
                      className="rounded-xl font-body bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>

      {showBoostModal && (
        <BoostModal
          listingId={listing.id}
          onClose={() => setShowBoostModal(false)}
        />
      )}
    </>
  );
}
