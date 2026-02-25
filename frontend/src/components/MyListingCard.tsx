import { useState } from 'react';
import { Edit2, Trash2, Zap, MapPin } from 'lucide-react';
import type { PublicListing, ListingId } from '../backend';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import BoostModal from './BoostModal';
import { useDeleteListing } from '../hooks/useQueries';
import { toast } from 'sonner';

interface MyListingCardProps {
  listing: PublicListing;
  onEdit: (id: ListingId) => void;
  onClick: (id: ListingId) => void;
}

const STATUS_STYLES: Record<string, string> = {
  Active: 'bg-primary/10 text-primary border-primary/20',
  Sold: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  Paused: 'bg-muted text-muted-foreground border-border',
};

export default function MyListingCard({ listing, onEdit, onClick }: MyListingCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const deleteListing = useDeleteListing();

  const photoUrl = listing.photos.length > 0 ? listing.photos[0].getDirectURL() : null;
  const statusStyle = STATUS_STYLES[listing.status] || STATUS_STYLES['Paused'];

  const handleDelete = async () => {
    try {
      await deleteListing.mutateAsync(listing.id);
      toast.success('Listing deleted');
    } catch {
      toast.error('Failed to delete listing');
    }
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className={`flex gap-3 p-3 bg-card rounded-xl border ${listing.isBoosted ? 'border-accent' : 'border-border'} shadow-xs`}>
        {/* Thumbnail */}
        <button onClick={() => onClick(listing.id)} className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
          {photoUrl ? (
            <img src={photoUrl} alt={listing.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
          )}
          {/* Status badge on thumbnail */}
          <div className={`absolute top-0.5 left-0.5 text-[8px] font-bold px-1 py-0.5 rounded border ${statusStyle}`}>
            {listing.status}
          </div>
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <button onClick={() => onClick(listing.id)} className="text-left w-full">
            <p className="font-heading font-semibold text-sm text-foreground line-clamp-1">{listing.title}</p>
            <p className="font-heading font-bold text-primary text-sm">D {Number(listing.price).toLocaleString()}</p>
            <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3" />
              <span className="text-xs font-body truncate">{listing.location}</span>
            </div>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1.5 mt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(listing.id)}
              className="h-7 px-2 text-xs gap-1"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowBoostModal(true)}
              className={`h-7 px-2 text-xs gap-1 ${listing.isBoosted ? 'border-accent text-accent' : ''}`}
            >
              <Zap className="w-3 h-3" />
              {listing.isBoosted ? 'Boosted' : 'Boost'}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowDeleteDialog(true)}
              className="h-7 px-2 text-xs gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="max-w-sm mx-4">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-heading">Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription className="font-body">
              This will permanently delete "{listing.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteListing.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BoostModal
        open={showBoostModal}
        onClose={() => setShowBoostModal(false)}
        listingId={listing.id}
      />
    </>
  );
}
