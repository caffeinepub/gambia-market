import { ArrowLeft, Star, MapPin, Flag } from 'lucide-react';
import { useState } from 'react';
import { useGetUserProfile, useReviews } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ReviewsList from '../components/ReviewsList';
import ReportModal from '../components/ReportModal';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import PatternDivider from '../components/PatternDivider';
import type { Principal } from '@icp-sdk/core/principal';

interface PublicProfileProps {
  userId: Principal;
  onBack: () => void;
}

export default function PublicProfile({ userId, onBack }: PublicProfileProps) {
  // Convert Principal to string for hooks that accept string
  const userIdStr = userId.toString();
  const { data: profile, isLoading } = useGetUserProfile(userIdStr);
  const { data: reviews } = useReviews(userIdStr);
  const { identity } = useInternetIdentity();
  const [showReport, setShowReport] = useState(false);

  const isAuthenticated = !!identity;
  const isOwnProfile = identity?.getPrincipal().toString() === userIdStr;

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
      : 0;

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="p-4 flex flex-col gap-4">
          <Skeleton className="h-20 w-full rounded-xl" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="font-heading font-semibold text-foreground mb-2">User not found</p>
        <Button onClick={onBack} variant="outline">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-14 bg-card z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body font-medium text-sm">Back</span>
        </button>
        {isAuthenticated && !isOwnProfile && (
          <button
            onClick={() => setShowReport(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Report user"
          >
            <Flag className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Profile info */}
      <div className="px-4 pt-5 pb-4">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="font-heading font-black text-primary text-3xl">
              {profile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-heading font-bold text-xl text-foreground">{profile.name}</h1>
              {profile.verified && (
                <img
                  src="/assets/generated/verified-badge.dim_256x256.png"
                  alt="Verified seller"
                  className="w-5 h-5"
                />
              )}
            </div>

            {/* Rating */}
            {avgRating > 0 && (
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3.5 h-3.5 ${
                        s <= Math.round(avgRating)
                          ? 'fill-accent text-accent'
                          : 'fill-transparent text-muted-foreground'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-body text-muted-foreground">
                  {avgRating.toFixed(1)} ({reviews?.length} review{reviews?.length !== 1 ? 's' : ''})
                </span>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                <span className="text-sm font-body">{profile.location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Verified badge callout */}
        {profile.verified && (
          <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-primary/20 mb-4">
            <img
              src="/assets/generated/verified-badge.dim_256x256.png"
              alt="Verified"
              className="w-6 h-6"
            />
            <p className="text-sm font-body text-primary font-medium">
              Verified Seller — identity confirmed
            </p>
          </div>
        )}
      </div>

      <PatternDivider thin className="mx-4" />

      {/* Reviews */}
      <div className="px-4 pt-4">
        <h2 className="font-heading font-bold text-base text-foreground mb-3">
          Reviews ({reviews?.length ?? 0})
        </h2>
        <ReviewsList userId={userId} />
      </div>

      {/* Report modal */}
      {isAuthenticated && !isOwnProfile && (
        <ReportModal
          open={showReport}
          onClose={() => setShowReport(false)}
          reportedId={userId}
        />
      )}
    </div>
  );
}
