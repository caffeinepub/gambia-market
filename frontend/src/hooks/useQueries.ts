import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PublicListing, ListingId, Message, Review, UserProfile, BoostOption } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';
import { ExternalBlob } from '../backend';

// ─── User Profile ─────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useGetUserProfile(userId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserProfile | null>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (!actor || !userId) return null;
      try {
        const { Principal } = await import('@dfinity/principal');
        const principal = Principal.fromText(userId);
        return actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!userId,
    retry: false,
  });
}

export function useUpdateUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, location }: { name: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrUpdateUserProfile(name, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, phone, location }: { name: string; phone: string; location: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(name, phone, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Listings ─────────────────────────────────────────────────────────────────

export function useListings(category?: string, searchText?: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['listings', category, searchText],
    queryFn: async () => {
      if (!actor) return [];
      if (searchText && searchText.trim()) {
        return actor.searchListings(searchText.trim());
      }
      if (category && category !== 'All') {
        return actor.getListingsByCategory(category);
      }
      return actor.getAllListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSearchListings(searchText: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['searchListings', searchText],
    queryFn: async () => {
      if (!actor || !searchText.trim()) return [];
      return actor.searchListings(searchText.trim());
    },
    enabled: !!actor && !actorFetching && searchText.trim().length > 0,
  });
}

export function useBoostedListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['boostedListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBoostedListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useListing(listingId: ListingId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicListing | null>({
    queryKey: ['listing', listingId?.toString()],
    queryFn: async () => {
      if (!actor || listingId === null) return null;
      return actor.getListing(listingId);
    },
    enabled: !!actor && !actorFetching && listingId !== null,
  });
}

export function useMyListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PublicListing[]>({
    queryKey: ['myListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      price,
      condition,
      photos,
      location,
    }: {
      title: string;
      description: string;
      category: string;
      price: bigint;
      condition: string;
      photos: ExternalBlob[];
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createListing(title, description, category, price, condition, photos, location);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['boostedListings'] });
    },
  });
}

export function useUpdateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      title,
      description,
      category,
      price,
      condition,
      photos,
      location,
    }: {
      listingId: ListingId;
      title: string;
      description: string;
      category: string;
      price: bigint;
      condition: string;
      photos: ExternalBlob[];
      location: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListing(listingId, title, description, category, price, condition, photos, location);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['listing', variables.listingId.toString()] });
    },
  });
}

export function useDeleteListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}

export function useBoostListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      isBoosted,
      durationDays,
    }: {
      listingId: ListingId;
      isBoosted: boolean;
      durationDays: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setListingBoosted(listingId, isBoosted, durationDays);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
      queryClient.invalidateQueries({ queryKey: ['boostedListings'] });
    },
  });
}

export function useBoostOptions() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<BoostOption[]>({
    queryKey: ['boostOptions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBoostOptions();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !actorFetching,
  });
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export function useMessages(listingId: ListingId | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['messages', listingId?.toString()],
    queryFn: async () => {
      if (!actor || listingId === null) return [];
      return actor.getMessagesForListing(listingId);
    },
    enabled: !!actor && !actorFetching && listingId !== null,
    refetchInterval: 5000,
  });
}

export function useMyConversations() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Message[]>({
    queryKey: ['myConversations'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyConversations();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      listingId,
      receiverId,
      content,
    }: {
      listingId: ListingId;
      receiverId: Principal;
      content: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessage(listingId, receiverId, content);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['myConversations'] });
    },
  });
}

export function useSendMessageAnon() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      senderName,
      messageText,
      listingId,
      receiverId,
    }: {
      senderName: string;
      messageText: string;
      listingId: ListingId;
      receiverId: Principal;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.sendMessageAnon(senderName, messageText, listingId, receiverId);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.listingId.toString()] });
    },
  });
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export function useReviews(userId: Principal | string | null) {
  const { actor, isFetching: actorFetching } = useActor();
  const userIdStr = userId ? userId.toString() : null;

  return useQuery<Review[]>({
    queryKey: ['reviews', userIdStr],
    queryFn: async () => {
      if (!actor || !userId) return [];
      let principal: Principal;
      if (typeof userId === 'string') {
        const { Principal: P } = await import('@dfinity/principal');
        principal = P.fromText(userId);
      } else {
        principal = userId as Principal;
      }
      return actor.getReviewsForUser(principal);
    },
    enabled: !!actor && !actorFetching && !!userId,
  });
}

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
      listingId: ListingId;
      stars: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReview(revieweeId, listingId, stars, comment);
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', variables.revieweeId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.revieweeId.toString()] });
    },
  });
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export function useCreateReport() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      reportedId,
      reason,
    }: {
      reportedId: Principal;
      reason: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createReport(reportedId, reason);
    },
  });
}

// ─── Like & Follow ────────────────────────────────────────────────────────────

export function useGetLikedListings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ListingId[]>({
    queryKey: ['likedListings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLikedListings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useLikeListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeListing(listingId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['likedListings'] });
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useLikeListingAnon() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (listingId: ListingId) => {
      if (!actor) throw new Error('Actor not available');
      return actor.likeListingAnon(listingId);
    },
  });
}

export function useGetFollowing() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['following'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFollowing();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetFollowers(sellerId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Principal[]>({
    queryKey: ['followers', sellerId],
    queryFn: async () => {
      if (!actor || !sellerId) return [];
      try {
        const { Principal } = await import('@dfinity/principal');
        const principal = Principal.fromText(sellerId);
        return actor.getFollowers(principal);
      } catch {
        return [];
      }
    },
    enabled: !!actor && !actorFetching && !!sellerId,
  });
}

export function useFollowSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.followSeller(sellerId);
    },
    onSuccess: (_data, sellerId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers', sellerId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', sellerId.toString()] });
    },
  });
}

export function useUnfollowSeller() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sellerId: Principal) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unfollowSeller(sellerId);
    },
    onSuccess: (_data, sellerId) => {
      queryClient.invalidateQueries({ queryKey: ['following'] });
      queryClient.invalidateQueries({ queryKey: ['followers', sellerId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProfile', sellerId.toString()] });
    },
  });
}

// ─── Profile Picture ──────────────────────────────────────────────────────────

export function useUpdateProfilePic() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (url: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProfilePic(url);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// ─── Listing Status ───────────────────────────────────────────────────────────

export function useUpdateListingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ listingId, status }: { listingId: ListingId; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateListingStatus(listingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
      queryClient.invalidateQueries({ queryKey: ['myListings'] });
    },
  });
}
