import React from 'react';
import { ArrowLeft, MapPin, Star, ShieldCheck, Users } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { ListingId } from '../backend';
import { useGetUserProfile, useListings, useReviews } from '../hooks/useQueries';
import ListingCard from '../components/ListingCard';
import ReviewsList from '../components/ReviewsList';
import SkeletonListingCard from '../components/SkeletonListingCard';

interface PublicProfileProps {
  userId: Principal;
  onBack: () => void;
  onListingClick?: (id: ListingId) => void;
}

export default function PublicProfile({ userId, onBack, onListingClick }: PublicProfileProps) {
  const { data: profile, isLoading: profileLoading } = useGetUserProfile(userId.toString());
  const { data: allListings, isLoading: listingsLoading } = useListings();
  const { data: reviews } = useReviews(userId);

  const userListings = allListings
    ? allListings.filter((l) => l.sellerId.toString() === userId.toString() && l.status === 'Active')
    : [];

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
    : 0;

  const handleListingClick = (id: ListingId) => {
    onListingClick?.(id);
  };

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
          <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-5 rounded-lg shimmer w-40" />
              <div className="h-4 rounded-md shimmer w-28" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-muted-foreground">User not found</p>
          <button onClick={onBack} className="mt-4 text-primary font-body font-medium">Go back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-3">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-bold text-base text-foreground">{profile.name}</h1>
      </div>

      {/* Profile header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border shrink-0">
            {profile.profilePicUrl ? (
              <img src={profile.profilePicUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full gradient-primary flex items-center justify-center">
                <span className="font-display font-bold text-3xl text-primary-foreground">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-display font-bold text-xl text-foreground">{profile.name}</h2>
              {profile.verified && (
                <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--brand-sage)' }} />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-body text-muted-foreground">
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              {avgRating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" style={{ color: 'var(--brand-gold)' }} />
                  {avgRating.toFixed(1)} ({reviews?.length ?? 0} reviews)
                </span>
              )}
              {Number(profile.followers) > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {Number(profile.followers).toLocaleString()} followers
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Listings', value: userListings.length },
            { label: 'Reviews', value: reviews?.length ?? 0 },
            { label: 'Rating', value: avgRating > 0 ? avgRating.toFixed(1) : '—' },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl border border-border p-3 text-center shadow-card">
              <div className="font-display font-bold text-xl text-foreground">{stat.value}</div>
              <div className="text-xs font-body text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Listings */}
      <div className="px-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--primary)' }} />
          <h3 className="font-display font-bold text-base text-foreground">Active Listings</h3>
        </div>
        {listingsLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <SkeletonListingCard key={i} />)}
          </div>
        ) : userListings.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-2xl border border-border">
            <p className="font-body text-muted-foreground text-sm">No active listings</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {userListings.map((listing) => (
              <ListingCard
                key={listing.id.toString()}
                listing={listing}
                onClick={handleListingClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Reviews */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--brand-gold)' }} />
          <h3 className="font-display font-bold text-base text-foreground">Reviews</h3>
        </div>
        <ReviewsList userId={userId} />
      </div>
    </div>
  );
}
