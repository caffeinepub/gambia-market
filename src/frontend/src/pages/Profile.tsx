import React, { useRef, useState } from 'react';
import { Camera, Loader2, MapPin, Phone, Calendar, Star, Edit2, X, LogOut, ShieldCheck } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetCallerUserProfile, useGetMyListings, useGetReviewsForUser, useUpdateProfilePicture } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import ProfileTabs from '../components/ProfileTabs';
import ProfileStatsRow from '../components/ProfileStatsRow';
import EditProfileForm from '../components/EditProfileForm';
import { ExternalBlob, UserProfile } from '../backend';
import LoginPrompt from '../components/LoginPrompt';
import ProfileSetup from '../components/ProfileSetup';

interface ProfileProps {
  onCreateListing?: () => void;
  onEditListing?: (listingId: bigint) => void;
  onListingClick?: (listingId: bigint) => void;
  onLogout?: () => void;
  onAdminClick?: () => void;
}

export default function Profile({ onCreateListing, onEditListing, onListingClick, onLogout, onAdminClick }: ProfileProps) {
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();

  const { data: userProfile, isLoading: profileLoading, isFetched, isError } = useGetCallerUserProfile();
  const { data: myListings = [] } = useGetMyListings();
  const { data: reviews = [] } = useGetReviewsForUser(
    userProfile ? userProfile.id : null
  );

  const updateProfilePicture = useUpdateProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Not authenticated — show login prompt
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }

  // Loading profile — show skeleton while waiting
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4 pt-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // Error fallback — prompt retry
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">Failed to load profile. Please try again.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No profile yet — show setup (covers both null and undefined)
  if (isFetched && !userProfile) {
    return <ProfileSetup onComplete={() => {}} />;
  }

  // Still waiting for the first fetch result
  if (!isFetched || !userProfile) {
    return (
      <div className="min-h-screen bg-background p-4 space-y-4 pt-6">
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  // At this point userProfile is guaranteed to be UserProfile (non-null, non-undefined)
  const profile: UserProfile = userProfile;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
      setUploadProgress(pct);
    });

    try {
      await updateProfilePicture.mutateAsync(blob);
    } finally {
      setUploadProgress(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await clear();
      queryClient.clear();
      if (onLogout) onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
    : 0;

  const profilePicUrl = profile.profilePic ? profile.profilePic.getDirectURL() : null;
  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  const joinDate = profile.createdAt
    ? new Date(Number(profile.createdAt) / 1_000_000).toLocaleDateString('en-GB', {
        year: 'numeric', month: 'long'
      })
    : null;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Profile Header Card */}
      <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-4 pt-6 pb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-4">
            {/* Avatar with upload */}
            <div className="relative shrink-0">
              <Avatar className="w-20 h-20 border-4 border-white shadow-lg">
                {profilePicUrl ? (
                  <AvatarImage src={profilePicUrl} alt={profile.name} />
                ) : null}
                <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={updateProfilePicture.isPending}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center shadow-md hover:bg-primary/90 transition-colors disabled:opacity-60"
                title="Change profile picture"
              >
                {updateProfilePicture.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 text-primary-foreground animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-primary-foreground" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-foreground truncate">{profile.name}</h1>
                {profile.verified && (
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium">
                    ✓ Verified
                  </span>
                )}
              </div>

              {profile.location && (
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground truncate">{profile.location}</span>
                </div>
              )}

              {profile.phone && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-sm text-muted-foreground">{profile.phone}</span>
                </div>
              )}

              {joinDate && (
                <div className="flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs text-muted-foreground">Joined {joinDate}</span>
                </div>
              )}

              {reviews.length > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm font-medium text-foreground">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {/* Edit button */}
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="shrink-0 p-2 rounded-full bg-white/80 hover:bg-white shadow-sm transition-colors"
              title={isEditingProfile ? 'Cancel editing' : 'Edit profile'}
            >
              {isEditingProfile ? (
                <X className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>Uploading photo...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Edit Profile Form */}
          {isEditingProfile && (
            <div className="mt-4 bg-white/80 rounded-xl p-4 border border-border">
              <EditProfileForm
                currentName={profile.name}
                currentLocation={profile.location}
                currentPhone={profile.phone}
                onSaved={() => setIsEditingProfile(false)}
              />
            </div>
          )}

          {/* Logout Button */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full gap-2 border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
            >
              {isLoggingOut ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogOut className="w-4 h-4" />
              )}
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <ProfileStatsRow
          listingCount={myListings.length}
          reviewCount={reviews.length}
          avgRating={avgRating}
          followerCount={Number(profile.followers)}
        />
      </div>

      {/* Tabs */}
      <div className="max-w-2xl mx-auto px-4 mt-4">
        <ProfileTabs
          userId={profile.id}
          onCreateListing={onCreateListing}
          onEditListing={onEditListing}
          onListingClick={onListingClick}
        />
      </div>

      {/* Admin entry point — subtle footer link */}
      {onAdminClick && (
        <div className="max-w-2xl mx-auto px-4 mt-6 pb-4 flex justify-center">
          <button
            type="button"
            onClick={onAdminClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin
          </button>
        </div>
      )}
    </div>
  );
}
