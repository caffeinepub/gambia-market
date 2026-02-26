import React from 'react';
import { Star } from 'lucide-react';
import { useReviews, useGetUserProfile } from '../hooks/useQueries';
import { Principal } from '@dfinity/principal';
import StarRating from './StarRating';

interface ReviewsListProps {
  userId: Principal;
}

function ReviewItem({ review }: { review: any }) {
  const { data: reviewer } = useGetUserProfile(review.reviewerId.toString());

  const timeAgo = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const diff = Date.now() - ms;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return new Date(ms).toLocaleDateString();
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl shrink-0 overflow-hidden border border-border">
          {reviewer?.profilePicUrl ? (
            <img src={reviewer.profilePicUrl} alt={reviewer.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full gradient-primary flex items-center justify-center">
              <span className="font-display font-bold text-sm text-primary-foreground">
                {reviewer?.name?.charAt(0)?.toUpperCase() ?? '?'}
              </span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-body font-semibold text-sm text-foreground truncate">
              {reviewer?.name ?? 'Anonymous'}
            </span>
            <span className="text-[10px] font-body text-muted-foreground shrink-0">
              {timeAgo(review.createdAt)}
            </span>
          </div>
          <StarRating value={Number(review.stars)} readonly size="sm" />
          {review.comment && (
            <p className="text-sm font-body text-muted-foreground mt-2 leading-relaxed">
              {review.comment}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ReviewsList({ userId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useReviews(userId);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card rounded-2xl border border-border p-4 shadow-card">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded-lg shimmer w-28" />
                <div className="h-3 rounded-md shimmer w-20" />
                <div className="h-3 rounded-md shimmer w-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
          <Star className="w-7 h-7 text-muted-foreground" />
        </div>
        <p className="font-body font-semibold text-foreground mb-1">No reviews yet</p>
        <p className="text-sm font-body text-muted-foreground">Be the first to leave a review</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => (
        <ReviewItem key={review.id.toString()} review={review} />
      ))}
    </div>
  );
}
