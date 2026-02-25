# Specification

## Summary
**Goal:** Enhance Gambia Market with social login, seller profiles, likes/follows, profile pictures, cross-device persistence, and listing persistence improvements.

**Planned changes:**
- Redirect users to the Home Feed (`/`) immediately after logout from any page
- Replace Internet Identity authentication with Google and Apple ID login buttons; remove all Internet Identity UI references
- On first login, prompt new users for profile setup (name, phone, location); return existing users directly to Home Feed
- Show full seller profile info (name, masked phone, location, verified badge, rating, listings, reviews) to authenticated users on Listing Detail and PublicProfile pages; show login prompt to unauthenticated visitors
- Add a "Share My Profile" button on seller Profile and PublicProfile pages that copies a unique shareable URL (`/public-profile?id=<principalId>`) to the clipboard and shows a confirmation toast
- Add a Like (heart) button on listing cards and detail pages with a like count, stored in the backend
- Add a Follow/Unfollow button on seller PublicProfile and Listing Detail pages with a follower count displayed on seller profiles
- Add a "Following" tab on the Profile page listing all sellers the current user follows
- Backend: add `followSeller`, `unfollowSeller`, `likeListing`, `getFollowing`, `getFollowers`, `getLikedListings` functions with stable storage
- Allow users to upload a profile picture (file picker, base64 conversion, max 2 MB client-side validation); add `profilePicUrl` field to `UserProfile` and `updateProfilePic` backend function
- Display profile picture (or initials fallback) in Profile page, PublicProfile, SellerInfo, ConversationItem, BottomNav, and AppHeader
- On app load for authenticated users, fetch profile data from the backend instead of localStorage/sessionStorage to ensure cross-device consistency
- Remove any TTL/expiry/auto-cleanup logic from the backend; listings persist until explicitly deleted by the owner via `deleteListing`
- Show all owner listings (Active/Sold/Paused) with status badges in the "My Listings" tab; only Active listings appear in the public Home Feed

**User-visible outcome:** Users can log in with Google or Apple, follow sellers, like listings, upload a profile picture, share their seller profile link, and access their account with all data intact from any device. Listings remain permanently unless deleted by the owner.
