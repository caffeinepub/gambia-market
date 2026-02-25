import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface UserProfile {
    id: Principal;
    profilePicUrl?: string;
    verified: boolean;
    name: string;
    createdAt: Time;
    phone: string;
    followers: bigint;
    location: string;
    highestRating: bigint;
}
export interface BoostOption {
    durationDays: bigint;
    priceGMD: bigint;
}
export type Time = bigint;
export interface AnonMessage {
    id: MessageId;
    content: string;
    listingId: ListingId;
    receiverId: Principal;
    timestamp: Time;
    senderName: string;
    senderId?: Principal;
}
export interface Report {
    id: ReportId;
    status: string;
    reportedId: Principal;
    reporterId: Principal;
    reason: string;
}
export interface Transaction {
    id: TransactionId;
    status: string;
    paymentMethod: string;
    listingId: ListingId;
    buyerId: Principal;
    sellerId: Principal;
    amount: bigint;
}
export type ReportId = bigint;
export type TransactionId = bigint;
export type ListingId = bigint;
export type MessageId = bigint;
export interface Message {
    id: MessageId;
    content: string;
    listingId: ListingId;
    receiverId: Principal;
    timestamp: Time;
    senderId: Principal;
}
export interface PublicListing {
    id: ListingId;
    status: string;
    title: string;
    createdAt: Time;
    description: string;
    isBoosted: boolean;
    category: string;
    boostExpiry?: Time;
    sellerId: Principal;
    price: bigint;
    location: string;
    photos: Array<ExternalBlob>;
    condition: string;
}
export type ReviewId = bigint;
export interface Review {
    id: ReviewId;
    listingId: ListingId;
    createdAt: Time;
    revieweeId: Principal;
    reviewerId: Principal;
    comment: string;
    stars: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAllowedCategory(category: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createListing(title: string, description: string, category: string, price: bigint, condition: string, photos: Array<ExternalBlob>, location: string): Promise<ListingId>;
    createOrUpdateUserProfile(name: string, location: string): Promise<void>;
    createReport(reportedId: Principal, reason: string): Promise<ReportId>;
    createReview(revieweeId: Principal, listingId: ListingId, stars: bigint, comment: string): Promise<ReviewId>;
    createTransaction(listingId: ListingId, sellerId: Principal, paymentMethod: string, amount: bigint): Promise<TransactionId>;
    deleteListing(listingId: ListingId): Promise<void>;
    followSeller(sellerId: Principal): Promise<void>;
    getAllCategories(): Promise<Array<string>>;
    getAllListings(): Promise<Array<PublicListing>>;
    getAllReports(): Promise<Array<Report>>;
    getAnonymousMessageById(messageId: MessageId): Promise<AnonMessage | null>;
    getBoostOptions(): Promise<Array<BoostOption>>;
    getBoostedListings(): Promise<Array<PublicListing>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFollowers(sellerId: Principal): Promise<Array<Principal>>;
    getFollowing(): Promise<Array<Principal>>;
    getLikedListings(): Promise<Array<ListingId>>;
    getListing(listingId: ListingId): Promise<PublicListing | null>;
    getListingsByCategory(category: string): Promise<Array<PublicListing>>;
    getMessagesForListing(listingId: ListingId): Promise<Array<Message>>;
    getMyConversations(): Promise<Array<Message>>;
    getMyListings(): Promise<Array<PublicListing>>;
    getReviewsForUser(userId: Principal): Promise<Array<Review>>;
    getTransaction(txId: TransactionId): Promise<Transaction | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    likeListing(listingId: ListingId): Promise<boolean>;
    likeListingAnon(listingId: ListingId): Promise<boolean>;
    removeAllowedCategory(category: string): Promise<void>;
    saveCallerUserProfile(name: string, phone: string, location: string): Promise<void>;
    searchListings(searchText: string): Promise<Array<PublicListing>>;
    sendMessage(listingId: ListingId, receiverId: Principal, content: string): Promise<MessageId>;
    sendMessageAnon(senderName: string, messageText: string, listingId: ListingId, receiverId: Principal): Promise<MessageId>;
    setListingBoosted(listingId: ListingId, isBoosted: boolean, durationDays: bigint): Promise<void>;
    unfollowSeller(sellerId: Principal): Promise<void>;
    updateAllUserProfilesWithHighestRating(): Promise<void>;
    updateListing(listingId: ListingId, title: string, description: string, category: string, price: bigint, condition: string, photos: Array<ExternalBlob>, location: string): Promise<void>;
    updateListingStatus(listingId: ListingId, status: string): Promise<void>;
    updateProfilePic(url: string): Promise<void>;
    updateReportStatus(reportId: ReportId, status: string): Promise<void>;
    updateTransactionStatus(txId: TransactionId, status: string): Promise<void>;
}
