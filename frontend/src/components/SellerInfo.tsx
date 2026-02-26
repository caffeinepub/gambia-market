import React from 'react';
import { MapPin, Star, ShieldCheck, Users } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { useGetUserProfile, useGetReviewsForUser } from '../hooks/useQueries';

interface SellerInfoProps {
  sellerId: Principal;
  onSellerClick?: (userId: Principal) => void;
}

export default function SellerInfo({ sellerId, onSellerClick }: SellerInfoProps) {
  const { data: profile, isLoading } = useGetUserProfile(sellerId);
  const { data: reviews } = useGetReviewsForUser(sellerId);

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
    : 0;

  const profilePicUrl = profile?.profilePic ? profile.profilePic.getDirectURL() : null;

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-muted animate-pulse shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 rounded-lg bg-muted animate-pulse w-32" />
            <div className="h-3 rounded-md bg-muted animate-pulse w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <button
      onClick={() => onSellerClick?.(sellerId)}
      className="w-full text-left bg-card rounded-2xl border border-border p-4 shadow-card hover:shadow-md transition-shadow group"
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-2xl shrink-0 overflow-hidden border-2 border-border">
          {profilePicUrl ? (
            <img src={profilePicUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
              <span className="font-display font-bold text-lg text-primary">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="font-body font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
              {profile.name}
            </span>
            {profile.verified && (
              <ShieldCheck className="w-4 h-4 shrink-0 text-primary" />
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground font-body">
            {profile.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 shrink-0" />
                {profile.location}
              </span>
            )}
            {avgRating > 0 && (
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {avgRating.toFixed(1)}
              </span>
            )}
            {Number(profile.followers) > 0 && (
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {Number(profile.followers).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </button>
  );
}
