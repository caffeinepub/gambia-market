import React from 'react';
import { LogOut, MapPin, ShieldCheck, Camera } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { ListingId } from '../backend';
import {
  useGetCallerUserProfile,
  useUpdateUser,
  useMyListings,
  useReviews,
} from '../hooks/useQueries';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileTabs from '../components/ProfileTabs';
import InlineEditField from '../components/InlineEditField';
import LoginPrompt from '../components/LoginPrompt';

interface ProfileProps {
  onLogout: () => void;
  onListingClick: (id: ListingId) => void;
  onEditListing: (id: ListingId) => void;
}

export default function Profile({ onLogout, onListingClick, onEditListing }: ProfileProps) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { data: myListings, isLoading: listingsLoading } = useMyListings();
  const updateUser = useUpdateUser();

  const userId = identity?.getPrincipal();
  const { data: reviews } = useReviews(userId ?? null);

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
    : 0;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    onLogout();
  };

  const handleSaveName = async (name: string) => {
    if (!profile) return;
    await updateUser.mutateAsync({ name, location: profile.location });
  };

  const handleSaveLocation = async (location: string) => {
    if (!profile) return;
    await updateUser.mutateAsync({ name: profile.name, location });
  };

  if (!identity) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-8">
        <LoginPrompt message="Sign in to view your profile" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="px-4 pt-6 space-y-4">
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

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile header */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-border">
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
            <button
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center text-primary-foreground shadow-button"
              style={{ background: 'var(--primary)' }}
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Name & info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-display font-bold text-xl text-foreground truncate">{profile.name}</h1>
              {profile.verified && (
                <ShieldCheck className="w-5 h-5 shrink-0" style={{ color: 'var(--brand-sage)' }} />
              )}
            </div>
            {profile.location && (
              <div className="flex items-center gap-1 text-sm font-body text-muted-foreground">
                <MapPin className="w-3.5 h-3.5" />
                {profile.location}
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Stats */}
        <ProfileStatsRow
          listingCount={myListings?.length ?? 0}
          reviewCount={reviews?.length ?? 0}
          avgRating={avgRating}
          followerCount={Number(profile.followers)}
        />
      </div>

      {/* Edit fields */}
      <div className="mx-4 mb-4 bg-card rounded-2xl border border-border shadow-card px-4">
        <InlineEditField
          label="Display Name"
          value={profile.name}
          onSave={handleSaveName}
          placeholder="Your name"
        />
        <InlineEditField
          label="Location"
          value={profile.location}
          onSave={handleSaveLocation}
          placeholder="e.g. Banjul, Serrekunda"
        />
      </div>

      {/* Tabs — pass profile as required by ProfileTabsProps */}
      <ProfileTabs
        profile={profile}
        myListings={myListings}
        listingsLoading={listingsLoading}
        onListingClick={onListingClick}
        onEditListing={onEditListing}
      />
    </div>
  );
}
