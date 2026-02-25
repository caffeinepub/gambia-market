import { formatDistanceToNow } from 'date-fns';
import StarRating from './StarRating';
import { useReviews } from '../hooks/useQueries';
import { Skeleton } from './ui/skeleton';
import type { Principal } from '@icp-sdk/core/principal';

interface ReviewsListProps {
  userId: Principal;
}

export default function ReviewsList({ userId }: ReviewsListProps) {
  const { data: reviews, isLoading } = useReviews(userId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2].map((i) => (
          <div key={i} className="p-3 bg-muted rounded-xl">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <p className="text-muted-foreground font-body text-sm text-center py-4">
        No reviews yet
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <div key={review.id.toString()} className="p-3 bg-muted/50 rounded-xl border border-border">
          <div className="flex items-center justify-between mb-1">
            <StarRating value={Number(review.stars)} readonly size="sm" />
            <span className="text-xs text-muted-foreground font-body">
              {formatDistanceToNow(new Date(Number(review.createdAt) / 1_000_000), { addSuffix: true })}
            </span>
          </div>
          {review.comment && (
            <p className="text-sm font-body text-foreground mt-1">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}
