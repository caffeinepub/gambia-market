import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import StarRating from './StarRating';
import { useCreateReview } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';
import type { ListingId } from '../backend';

interface ReviewFormProps {
  revieweeId: Principal;
  listingId: ListingId;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ revieweeId, listingId, onSuccess, onCancel }: ReviewFormProps) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) {
      toast.error('Please select a star rating');
      return;
    }
    try {
      await createReview.mutateAsync({
        revieweeId,
        listingId,
        stars: BigInt(stars),
        comment: comment.trim(),
      });
      toast.success('Review submitted! Thank you.');
      onSuccess?.();
    } catch {
      toast.error('Failed to submit review. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="font-body font-medium text-sm text-foreground">Your Rating</p>
        <StarRating value={stars} onChange={setStars} size="lg" />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="font-body font-medium text-sm text-foreground">Comment (optional)</label>
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this seller..."
          className="text-base min-h-[80px] resize-none"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={createReview.isPending || stars === 0}
          className="flex-1 h-11"
        >
          {createReview.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit Review'
          )}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="h-11">
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
