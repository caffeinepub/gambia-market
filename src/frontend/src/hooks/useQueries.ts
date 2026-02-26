import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { ListingCategory, PublicListing, UserProfile, Review, ListingId, ExternalBlob } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: Principal | null | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return null;
      return actor.getUserProfile(userId);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

export function useUpdateProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phone, location }: { name: string; phone: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(name, phone, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });
}

// Alias for backward compat
export const useUpdateUser = useUpdateProfile;

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phone, location }: { name: string; phone: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(name, phone, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateProfilePicture() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profilePic: ExternalBlob | null) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateProfilePicture(profilePic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile picture updated!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update profile picture: ${error.message}`);
    },
  });
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export function useListings() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['allListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllListings();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias
export const useGetAllListings = useListings;

export function useGetMyListings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<PublicListing[]>({
    queryKey: ['myListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyListings();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

// Alias for backward compat
export const useMyListings = useGetMyListings;

export function useListing(listingId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicListing | null>({
    queryKey: ['listing', listingId?.toString()],
    queryFn: async () => {
      if (!actor || listingId === null) return null;
      return actor.getListing(listingId);
    },
    enabled: !!actor && !isFetching && listingId !== null,
  });
}

// Alias
export const useGetListing = useListing;

export function useGetListingsByCategory(category: ListingCategory | null) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['listingsByCategory', category],
    queryFn: async () => {
      if (!actor || !category) return [];
      return actor.getListingsByCategory(category);
    },
    enabled: !!actor && !isFetching && !!category,
  });
}

export function useSearchListings(searchText: string) {
  const { actor, isFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['searchListings', searchText],
    queryFn: async () => {
      if (!actor || !searchText.trim()) return [];
      return actor.searchListings(searchText);
    },
    enabled: !!actor && !isFetching && !!searchText.trim(),
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      title: string;
      description: string;
      category: ListingCategory;
      subCategory: string | null;
      price: bigint;
      condition: string;
      photos: ExternalBlob[];
      location: string;
      propertySize: bigint | null;
      numBedrooms: bigint | null;
      isFurnished: boolean | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const { RealEstateSubCategory } = await import('../backend');
      const subCat = params.subCategory
        ? (params.subCategory as unknown as import('../backend').RealEstateSubCategory)
        : null;
      const listingId = await actor.createListing(
        params.title,
        params.description,
        params.category,
        subCat,
        params.price,
        params.condition,
        params.photos,
        params.location,
        params.propertySize,
        params.numBedrooms,
        params.isFurnished,
      );
      return listingId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      toast.success('Listing created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create listing: ${error.message}`);
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      listingId: bigint;
      title: string;
      description: string;
      category: ListingCategory;
      subCategory: string | null;
      price: bigint;
      condition: string;
      photos: ExternalBlob[];
      location: string;
      propertySize: bigint | null;
      numBedrooms: bigint | null;
      isFurnished: boolean | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      const subCat = params.subCategory
        ? (params.subCategory as unknown as import('../backend').RealEstateSubCategory)
        : null;
      await actor.updateListing(
        params.listingId,
        params.title,
        params.description,
        params.category,
        subCat,
        params.price,
        params.condition,
        params.photos,
        params.location,
        params.propertySize,
        params.numBedrooms,
        params.isFurnished,
      );
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId.toString()] });
      toast.success('Listing updated successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update listing: ${error.message}`);
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      toast.success('Listing deleted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete listing: ${error.message}`);
    },
  });
}

export function useBoostListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, durationDays }: { listingId: bigint; durationDays: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.setListingBoosted(listingId, true, durationDays);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
      queryClient.invalidateQueries({ queryKey: ['boostedListings'] });
      toast.success('Listing boosted successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to boost listing: ${error.message}`);
    },
  });
}

export function useUpdateListingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, status }: { listingId: bigint; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateListingStatus(listingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['allListings'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update listing status: ${error.message}`);
    },
  });
}

// ─── Boosted Listings ─────────────────────────────────────────────────────────

export function useBoostedListings() {
  const { actor, isFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['boostedListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBoostedListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBoostOptions() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['boostOptions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBoostOptions();
    },
    enabled: !!actor && !isFetching,
  });
}

// Alias
export const useGetBoostOptions = useBoostOptions;

// ─── Reviews ─────────────────────────────────────────────────────────────────

export function useGetReviewsForUser(userId: Principal | null | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Review[]>({
    queryKey: ['reviewsForUser', userId?.toString()],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getReviewsForUser(userId);
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}

// Alias for backward compat
export const useReviews = useGetReviewsForUser;

export function useCreateReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      revieweeId,
      listingId,
      stars,
      comment,
    }: {
      revieweeId: Principal;
      listingId: bigint;
      stars: number;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReview(revieweeId, listingId, BigInt(stars), comment);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviewsForUser', variables.revieweeId.toString()] });
      toast.success('Review submitted!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit review: ${error.message}`);
    },
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export function useMessages(listingId: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery({
    queryKey: ['messages', listingId?.toString()],
    queryFn: async () => {
      if (!actor || listingId === null) return [];
      return actor.getMessagesForListing(listingId);
    },
    enabled: !!actor && !actorFetching && isAuthenticated && listingId !== null,
    refetchInterval: 5000,
  });
}

export function useMyConversations() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery({
    queryKey: ['conversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConversations();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    refetchInterval: 10000,
  });
}

// Alias
export const useConversations = useMyConversations;

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      receiverId,
      content,
    }: {
      listingId: bigint;
      receiverId: Principal;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(listingId, receiverId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useSendMessageAnon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      senderName,
      messageText,
      listingId,
      receiverId,
    }: {
      senderName: string;
      messageText: string;
      listingId: bigint;
      receiverId: Principal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessageAnon(senderName, messageText, listingId, receiverId);
    },
    onError: (error: Error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });
}

export function useEditMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      newContent,
      listingId,
    }: {
      messageId: bigint;
      newContent: string;
      listingId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.editMessage(messageId, newContent);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId.toString()] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to edit message: ${error.message}`);
    },
  });
}

export function useDeleteMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      messageId,
      listingId,
    }: {
      messageId: bigint;
      listingId: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteMessage(messageId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId.toString()] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete message: ${error.message}`);
    },
  });
}

// ─── Follow system ────────────────────────────────────────────────────────────

export function useFollowSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.followSeller(sellerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to follow seller: ${error.message}`);
    },
  });
}

export function useUnfollowSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      await actor.unfollowSeller(sellerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to unfollow seller: ${error.message}`);
    },
  });
}

export function useGetFollowing() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<Principal[]>({
    queryKey: ['following'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFollowing();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

export function useGetFollowers(sellerId: Principal | null | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['followers', sellerId?.toString()],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      return actor.getFollowers(sellerId);
    },
    enabled: !!actor && !actorFetching && !!sellerId,
  });
}

// ─── Likes ────────────────────────────────────────────────────────────────────

export function useLikeListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedListings'] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to like listing: ${error.message}`);
    },
  });
}

export function useLikeListingAnon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (listingId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeListingAnon(listingId);
    },
    onError: (error: Error) => {
      toast.error(`Failed to like listing: ${error.message}`);
    },
  });
}

export function useGetLikedListings() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return useQuery<ListingId[]>({
    queryKey: ['likedListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLikedListings();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function useCreateReport() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ reportedId, reason }: { reportedId: Principal; reason: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReport(reportedId, reason);
    },
    onSuccess: () => {
      toast.success('Report submitted. Thank you for keeping the marketplace safe.');
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit report: ${error.message}`);
    },
  });
}
