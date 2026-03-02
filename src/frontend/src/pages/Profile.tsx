import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  Camera,
  Edit2,
  Loader2,
  LogOut,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  Star,
  Users,
  X,
} from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { ExternalBlob, type UserProfile } from "../backend";
import EditProfileForm from "../components/EditProfileForm";
import LoginPrompt from "../components/LoginPrompt";
import ProfileSetup from "../components/ProfileSetup";
import ProfileTabs from "../components/ProfileTabs";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetCallerUserProfile,
  useGetMyListings,
  useGetReviewsForUser,
  useUpdateProfilePicture,
} from "../hooks/useQueries";

interface ProfileProps {
  onCreateListing?: () => void;
  onEditListing?: (listingId: bigint) => void;
  onListingClick?: (listingId: bigint) => void;
  onLogout?: () => void;
  onAdminClick?: () => void;
}

export default function Profile({
  onCreateListing,
  onEditListing,
  onListingClick,
  onLogout,
  onAdminClick,
}: ProfileProps) {
  const { identity, clear } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
    isError,
  } = useGetCallerUserProfile();
  const { data: myListings = [] } = useGetMyListings();
  const { data: reviews = [] } = useGetReviewsForUser(
    userProfile ? userProfile.id : null,
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
      <div className="min-h-screen bg-background">
        <Skeleton className="h-52 w-full rounded-none" />
        <div className="px-4 space-y-3 mt-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  // Error fallback
  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <p className="text-muted-foreground">
            Failed to load profile. Please try again.
          </p>
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

  // No profile yet — show setup
  if (isFetched && !userProfile) {
    return <ProfileSetup onComplete={() => {}} />;
  }

  // Still waiting for the first fetch result
  if (!isFetched || !userProfile) {
    return (
      <div className="min-h-screen bg-background">
        <Skeleton className="h-52 w-full rounded-none" />
        <div className="px-4 space-y-3 mt-4">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

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
      if (fileInputRef.current) fileInputRef.current.value = "";
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

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.stars), 0) / reviews.length
      : 0;

  const profilePicUrl = profile.profilePic
    ? profile.profilePic.getDirectURL()
    : null;
  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const joinDate = profile.createdAt
    ? new Date(Number(profile.createdAt) / 1_000_000).toLocaleDateString(
        "en-GB",
        {
          year: "numeric",
          month: "long",
        },
      )
    : null;

  return (
    <div className="min-h-screen bg-background pb-28">
      {/* ── Hero Banner ── */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.32 0.18 160) 0%, oklch(0.38 0.2 185) 45%, oklch(0.42 0.16 210) 100%)",
          minHeight: "180px",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-20"
          style={{ background: "oklch(0.85 0.08 155)" }}
        />
        <div
          className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full opacity-15"
          style={{ background: "oklch(0.9 0.1 185)" }}
        />

        {/* Top-right edit button */}
        <button
          type="button"
          data-ocid="profile.edit_button"
          onClick={() => setIsEditingProfile(!isEditingProfile)}
          className="absolute top-4 right-4 w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 z-10"
          style={{ background: "oklch(1 0 0 / 0.15)" }}
          title={isEditingProfile ? "Cancel editing" : "Edit profile"}
        >
          {isEditingProfile ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <Edit2 className="w-4 h-4 text-white" />
          )}
        </button>

        {/* Avatar + name row */}
        <div className="relative z-10 px-5 pt-8 pb-6">
          <div className="flex items-end gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar
                className="border-4 border-white shadow-xl"
                style={{ width: "88px", height: "88px" }}
              >
                {profilePicUrl ? (
                  <AvatarImage src={profilePicUrl} alt={profile.name} />
                ) : null}
                <AvatarFallback
                  className="text-2xl font-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.44 0.16 185))",
                    color: "white",
                  }}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Camera button */}
              <button
                type="button"
                data-ocid="profile.avatar_upload_button"
                onClick={handleAvatarClick}
                disabled={updateProfilePicture.isPending}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 disabled:opacity-60 border-2 border-white"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.44 0.16 185))",
                }}
                title="Change profile picture"
              >
                {updateProfilePicture.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
                ) : (
                  <Camera className="w-3.5 h-3.5 text-white" />
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

            {/* Name + badges */}
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-white leading-tight truncate">
                  {profile.name}
                </h1>
                {profile.verified && (
                  <span
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={{
                      background: "oklch(1 0 0 / 0.2)",
                      color: "white",
                    }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                )}
              </div>

              {/* Meta info */}
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {profile.location && (
                  <span className="flex items-center gap-1 text-xs text-white/80">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {profile.location}
                  </span>
                )}
                {profile.phone && (
                  <span className="flex items-center gap-1 text-xs text-white/80">
                    <Phone className="w-3 h-3 shrink-0" />
                    {profile.phone}
                  </span>
                )}
                {joinDate && (
                  <span className="flex items-center gap-1 text-xs text-white/70">
                    <Calendar className="w-3 h-3 shrink-0" />
                    Joined {joinDate}
                  </span>
                )}
              </div>

              {/* Star rating */}
              {reviews.length > 0 && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="w-3.5 h-3.5"
                        style={{
                          fill:
                            star <= Math.round(avgRating)
                              ? "oklch(0.85 0.18 75)"
                              : "transparent",
                          color:
                            star <= Math.round(avgRating)
                              ? "oklch(0.85 0.18 75)"
                              : "oklch(1 0 0 / 0.4)",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-white/90">
                    {avgRating.toFixed(1)}
                  </span>
                  <span className="text-xs text-white/60">
                    ({reviews.length})
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                <span>Uploading photo…</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                    background: "white",
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Edit Profile Form ── */}
      {isEditingProfile && (
        <div className="mx-4 mt-3 rounded-2xl border border-border bg-card shadow-card overflow-hidden animate-fade-in">
          <div
            className="px-4 py-3 border-b border-border flex items-center justify-between"
            style={{ background: "var(--muted)" }}
          >
            <div className="flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-primary" />
              <span className="font-display font-bold text-sm text-foreground">
                Edit Profile
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="p-4">
            <EditProfileForm
              currentName={profile.name}
              currentLocation={profile.location}
              currentPhone={profile.phone}
              onSaved={() => setIsEditingProfile(false)}
            />
          </div>
        </div>
      )}

      {/* ── Stats Cards ── */}
      <div className="px-4 mt-3 grid grid-cols-3 gap-3">
        {/* Listings */}
        <div
          className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-card border border-border"
          style={{ background: "var(--card)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.44 0.16 185))",
            }}
          >
            <Package className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-2xl text-foreground leading-none">
            {myListings.length}
          </span>
          <span className="text-xs font-body text-muted-foreground text-center leading-tight">
            Listings
          </span>
        </div>

        {/* Reviews */}
        <div
          className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-card border border-border"
          style={{ background: "var(--card)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 75), oklch(0.65 0.2 55))",
            }}
          >
            <Star className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-2xl text-foreground leading-none">
            {reviews.length}
          </span>
          <span className="text-xs font-body text-muted-foreground text-center leading-tight">
            Reviews
          </span>
        </div>

        {/* Followers */}
        <div
          className="rounded-2xl p-3 flex flex-col items-center gap-1 shadow-card border border-border"
          style={{ background: "var(--card)" }}
        >
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center mb-0.5"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.2 280), oklch(0.48 0.22 300))",
            }}
          >
            <Users className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-black text-2xl text-foreground leading-none">
            {Number(profile.followers)}
          </span>
          <span className="text-xs font-body text-muted-foreground text-center leading-tight">
            Followers
          </span>
        </div>
      </div>

      {/* ── Logout Button ── */}
      <div className="px-4 mt-3">
        <Button
          variant="outline"
          onClick={handleLogout}
          disabled={isLoggingOut}
          data-ocid="profile.logout_button"
          className="w-full gap-2 h-11 rounded-xl border-destructive/40 text-destructive hover:bg-destructive/8 hover:text-destructive hover:border-destructive font-semibold transition-all active:scale-[0.98]"
        >
          {isLoggingOut ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LogOut className="w-4 h-4" />
          )}
          {isLoggingOut ? "Logging out…" : "Log Out"}
        </Button>
      </div>

      {/* ── Profile Tabs ── */}
      <div className="px-4 mt-4">
        <ProfileTabs
          userId={profile.id}
          onCreateListing={onCreateListing}
          onEditListing={onEditListing}
          onListingClick={onListingClick}
        />
      </div>

      {/* ── Admin link ── */}
      {onAdminClick && (
        <div className="px-4 mt-6 flex justify-center">
          <button
            type="button"
            data-ocid="profile.admin_button"
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
