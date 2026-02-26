import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ShoppingBag, Star, Activity, Users } from 'lucide-react';
import MyListingCard from './MyListingCard';
import ReviewsList from './ReviewsList';
import { Skeleton } from './ui/skeleton';
import { MapPin } from 'lucide-react';
import type { PublicListing, ListingId, UserProfile } from '../backend';
import { useGetFollowing, useGetUserProfile } from '../hooks/useQueries';

interface ProfileTabsProps {
  profile: UserProfile;
  myListings?: PublicListing[];
  listingsLoading?: boolean;
  onListingClick: (id: ListingId) => void;
  onEditListing: (id: ListingId) => void;
  onSellerClick?: (userId: string) => void;
}

function FollowingTab({ onSellerClick }: { onSellerClick?: (userId: string) => void }) {
  const { data: following, isLoading } = useGetFollowing();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!following || following.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/30 rounded-xl border border-dashed border-border">
        <Users className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Not following anyone yet</p>
        <p className="text-xs text-muted-foreground mt-1">
          Browse listings and follow sellers you like
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {following.map((principal) => (
        <FollowingSellerCard
          key={principal.toString()}
          sellerId={principal.toString()}
          onSellerClick={onSellerClick}
        />
      ))}
    </div>
  );
}

function FollowingSellerCard({
  sellerId,
  onSellerClick,
}: {
  sellerId: string;
  onSellerClick?: (userId: string) => void;
}) {
  const { data: profile, isLoading } = useGetUserProfile(sellerId);

  if (isLoading) {
    return <Skeleton className="h-16 w-full rounded-xl" />;
  }

  if (!profile) return null;

  return (
    <button
      onClick={() => onSellerClick?.(sellerId)}
      className="flex items-center gap-3 p-3 bg-card rounded-xl border border-border hover:border-primary/30 hover:bg-muted/30 transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 overflow-hidden">
        {profile.profilePicUrl ? (
          <img
            src={profile.profilePicUrl}
            alt={profile.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-bold text-primary text-base">
            {profile.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm text-foreground truncate">{profile.name}</span>
          {profile.verified && (
            <img
              src="/assets/generated/verified-badge.dim_256x256.png"
              alt="Verified"
              className="w-4 h-4 shrink-0"
            />
          )}
        </div>
        {profile.location && (
          <div className="flex items-center gap-1 text-muted-foreground mt-0.5">
            <MapPin className="w-3 h-3" />
            <span className="text-xs truncate">{profile.location}</span>
          </div>
        )}
      </div>
      <span className="text-xs text-muted-foreground">View →</span>
    </button>
  );
}

export default function ProfileTabs({
  profile,
  myListings,
  listingsLoading,
  onListingClick,
  onEditListing,
  onSellerClick,
}: ProfileTabsProps) {
  return (
    <Tabs defaultValue="listings" className="w-full">
      <TabsList className="w-full grid grid-cols-4 mx-0 rounded-none border-b border-border bg-transparent h-auto p-0">
        <TabsTrigger
          value="listings"
          className="flex items-center gap-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-xs"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          Listings
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className="flex items-center gap-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-xs"
        >
          <Star className="w-3.5 h-3.5" />
          Reviews
        </TabsTrigger>
        <TabsTrigger
          value="following"
          className="flex items-center gap-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-xs"
        >
          <Users className="w-3.5 h-3.5" />
          Following
        </TabsTrigger>
        <TabsTrigger
          value="activity"
          className="flex items-center gap-1 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent text-muted-foreground text-xs"
        >
          <Activity className="w-3.5 h-3.5" />
          Activity
        </TabsTrigger>
      </TabsList>

      <TabsContent value="listings" className="px-4 pt-4 mt-0">
        {listingsLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : !myListings || myListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/30 rounded-xl border border-dashed border-border">
            <ShoppingBag className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No listings yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Tap the Sell tab to create your first listing
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myListings.map((listing) => (
              <MyListingCard
                key={listing.id.toString()}
                listing={listing}
                onEdit={() => onEditListing(listing.id)}
                onClick={onListingClick}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="reviews" className="px-4 pt-4 mt-0">
        <ReviewsList userId={profile.id} />
      </TabsContent>

      <TabsContent value="following" className="px-4 pt-4 mt-0">
        <FollowingTab onSellerClick={onSellerClick} />
      </TabsContent>

      <TabsContent value="activity" className="px-4 pt-4 mt-0">
        <div className="flex flex-col items-center justify-center py-10 text-center bg-muted/30 rounded-xl border border-dashed border-border">
          <Activity className="w-8 h-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Activity history coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">
            Member since{' '}
            {new Date(Number(profile.createdAt) / 1_000_000).toLocaleDateString()}
          </p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
