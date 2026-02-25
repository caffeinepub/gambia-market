import { useState } from 'react';
import { LogOut, MapPin, Phone, Share2, CheckCircle2 } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';
import InlineEditField from '../components/InlineEditField';
import ProfileStatsRow from '../components/ProfileStatsRow';
import ProfileTabs from '../components/ProfileTabs';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { useGetCallerUserProfile, useMyListings, useReviews, useUpdateUser } from '../hooks/useQueries';
import PatternDivider from '../components/PatternDivider';
import { toast } from 'sonner';
import type { ListingId } from '../backend';

interface ProfileProps {
  onLogout: () => void;
  onListingClick: (id: ListingId) => void;
  onEditListing: (id: ListingId) => void;
}

function ProfileContent({ onLogout, onListingClick, onEditListing }: ProfileProps) {
  const { data: profile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: myListings, isLoading: listingsLoading } = useMyListings();
  const { data: reviews } = useReviews(profile?.id ?? null);
  const updateUser = useUpdateUser();

  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
      : 0;

  const handleShareProfile = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${profile?.name} on Gambia Market`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Profile link copied!');
      }
    } catch {
      // ignore
    }
  };

  const handleSaveName = async (name: string) => {
    if (!profile) return;
    await updateUser.mutateAsync({ name, location: profile.location });
    toast.success('Name updated!');
  };

  const handleSaveLocation = async (location: string) => {
    if (!profile) return;
    await updateUser.mutateAsync({ name: profile.name, location });
    toast.success('Location updated!');
  };

  if (profileLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="flex flex-col pb-8">
      {/* Profile header */}
      <div className="px-4 pt-5 pb-4">
        {/* Avatar + name row */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-glow">
              <span className="font-heading font-black text-primary-foreground text-3xl">
                {profile.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {profile.verified && (
              <div className="absolute -bottom-1 -right-1">
                <img
                  src="/assets/generated/verified-badge.dim_256x256.png"
                  alt="Verified"
                  className="w-6 h-6"
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <InlineEditField
              value={profile.name}
              placeholder="Your name"
              onSave={handleSaveName}
              className="mb-1"
            />
            <InlineEditField
              value={profile.location}
              placeholder="Add location"
              onSave={handleSaveLocation}
              icon={<MapPin className="w-3.5 h-3.5" />}
            />
            {profile.phone && (
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="text-sm font-body">
                  {profile.phone.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats row */}
        <ProfileStatsRow
          listingCount={myListings?.length ?? 0}
          reviewCount={reviews?.length ?? 0}
          avgRating={avgRating}
        />

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShareProfile}
            className="flex-1 gap-1.5 h-9"
          >
            <Share2 className="w-3.5 h-3.5" />
            Share Profile
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="flex-1 gap-1.5 h-9 text-destructive border-destructive/30 hover:bg-destructive/5 hover:text-destructive"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Button>
        </div>
      </div>

      <PatternDivider thin className="mx-4" />

      {/* Tabbed content */}
      <ProfileTabs
        profile={profile}
        myListings={myListings}
        listingsLoading={listingsLoading}
        onListingClick={onListingClick}
        onEditListing={onEditListing}
      />

      {/* Footer */}
      <footer className="mt-8 px-4 py-4 text-center border-t border-border">
        <p className="text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()} Gambia Market ·{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'gambia-market'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Built with ❤️ using caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}

export default function Profile({ onLogout, onListingClick, onEditListing }: ProfileProps) {
  return (
    <AuthGuard>
      <ProfileContent onLogout={onLogout} onListingClick={onListingClick} onEditListing={onEditListing} />
    </AuthGuard>
  );
}
