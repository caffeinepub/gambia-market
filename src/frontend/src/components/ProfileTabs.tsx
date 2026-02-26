import React, { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyListings, useGetReviewsForUser, useDeleteListing } from '../hooks/useQueries';
import MyListingCard from './MyListingCard';
import ReviewsList from './ReviewsList';
import { Principal } from '@dfinity/principal';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileTabsProps {
  userId: Principal;
  onCreateListing?: () => void;
  onEditListing?: (listingId: bigint) => void;
  onListingClick?: (listingId: bigint) => void;
}

export default function ProfileTabs({ userId, onCreateListing, onEditListing, onListingClick }: ProfileTabsProps) {
  const { data: myListings = [], isLoading: listingsLoading } = useGetMyListings();
  const { data: reviews = [], isLoading: reviewsLoading } = useGetReviewsForUser(userId);
  const deleteListing = useDeleteListing();

  const [deleteTarget, setDeleteTarget] = useState<bigint | null>(null);

  const handleDeleteConfirm = async () => {
    if (deleteTarget === null) return;
    try {
      await deleteListing.mutateAsync(deleteTarget);
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <Tabs defaultValue="listings" className="w-full">
        <TabsList className="w-full grid grid-cols-2 mb-4">
          <TabsTrigger value="listings">
            My Listings ({myListings.length})
          </TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews ({reviews.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-4">
          {/* Create Listing Button */}
          <Button
            onClick={onCreateListing}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Listing
          </Button>

          {listingsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-28 w-full rounded-xl" />
              ))}
            </div>
          ) : myListings.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="text-4xl">📦</div>
              <p className="text-muted-foreground font-medium">No listings yet</p>
              <p className="text-sm text-muted-foreground">
                Create your first listing to start selling!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <MyListingCard
                  key={listing.id.toString()}
                  listing={listing}
                  onEdit={() => onEditListing?.(listing.id)}
                  onClick={(id) => onListingClick?.(id)}
                  onDelete={() => setDeleteTarget(listing.id)}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews">
          {reviewsLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <ReviewsList userId={userId} />
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this listing? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteListing.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteListing.isPending}
              className="bg-destructive hover:bg-destructive/90 text-white"
            >
              {deleteListing.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
