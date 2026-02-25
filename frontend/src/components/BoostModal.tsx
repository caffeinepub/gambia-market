import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { useBoostListing, useBoostOptions } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { ListingId } from '../backend';

interface BoostModalProps {
  open: boolean;
  onClose: () => void;
  listingId: ListingId;
}

export default function BoostModal({ open, onClose, listingId }: BoostModalProps) {
  const { data: boostOptions, isLoading } = useBoostOptions();
  const boostListing = useBoostListing();

  const handleBoost = async (durationDays: bigint) => {
    try {
      await boostListing.mutateAsync({ listingId, isBoosted: true, durationDays });
      toast.success('Listing boosted! It will now appear at the top of the feed.');
      onClose();
    } catch {
      toast.error('Failed to boost listing. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            Boost Your Listing
          </DialogTitle>
          <DialogDescription className="font-body">
            Get more visibility by boosting your listing to the top of the feed.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-2">
          {isLoading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            boostOptions?.map((option) => (
              <button
                key={option.durationDays.toString()}
                onClick={() => handleBoost(option.durationDays)}
                disabled={boostListing.isPending}
                className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-accent hover:bg-accent/5 transition-all text-left disabled:opacity-50"
              >
                <div>
                  <p className="font-heading font-semibold text-foreground">
                    {Number(option.durationDays)}-Day Boost
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-0.5">
                    Appear at the top for {Number(option.durationDays)} days
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-heading font-bold text-accent text-lg">
                    D {Number(option.priceGMD)}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">GMD</p>
                </div>
              </button>
            ))
          )}
        </div>

        <Button variant="outline" onClick={onClose} className="w-full h-11">
          Cancel
        </Button>
      </DialogContent>
    </Dialog>
  );
}
