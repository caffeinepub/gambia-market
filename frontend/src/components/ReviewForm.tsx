import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { ListingId } from '../backend';
import { useCreateReview } from '../hooks/useQueries';
import StarRating from './StarRating';

interface ReviewFormProps {
  revieweeId: Principal;
  listingId: ListingId;
  onSuccess?: () => void;
}

export default function ReviewForm({ revieweeId, listingId, onSuccess }: ReviewFormProps) {
  const [stars, setStars] = useState(0);
  const [comment, setComment] = useState('');
  const createReview = useCreateReview();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stars === 0) return;
    // stars is a number, useCreateReview expects number
    await createReview.mutateAsync({ revieweeId, listingId, stars, comment });
    setStars(0);
    setComment('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-4 shadow-card space-y-4">
      <h3 className="font-display font-bold text-base text-foreground">Leave a Review</h3>

      <div>
        <label className="block text-xs font-body font-semibold text-foreground mb-2 uppercase tracking-wide">
          Rating *
        </label>
        <StarRating value={stars} onChange={setStars} size="lg" />
      </div>

      <div>
        <label className="block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience…"
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={stars === 0 || createReview.isPending}
        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-body font-semibold text-sm text-primary-foreground transition-all duration-200 disabled:opacity-60"
        style={{ background: 'var(--primary)' }}
      >
        <Send className="w-4 h-4" />
        {createReview.isPending ? 'Submitting…' : 'Submit Review'}
      </button>
    </form>
  );
}
