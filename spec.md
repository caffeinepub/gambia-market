# Specification

## Summary
**Goal:** Fix listing creation so users can successfully submit new listings, and enhance the authenticated user's profile page with comprehensive info, avatar editing, listings management, and reviews.

**Planned changes:**
- Fix the `CreateListing` form submission: resolve mutation errors, field mapping issues (including real-estate-specific fields like bedrooms and furnished status), and ensure successful creation shows a toast and redirects to the new listing or home feed
- Update the backend `UserProfile` type to include an optional avatar field stored as `ExternalBlob`, and extend the `updateProfile` mutation to accept and persist the avatar
- Enhance the Profile page to display all stored user info (name, phone, location, account creation date, avatar) with inline editing or an edit modal
- Add avatar upload functionality on the Profile page that persists to the backend and updates the header/avatar display
- Add a "My Listings" section to the Profile page showing all user listings (active, sold, draft) with thumbnail, title, price, status badge, and Edit/Delete/Boost actions
- Add a "Create New Listing" button on the Profile page
- Add a stats row on the Profile page showing total listings, average rating, review count, and followers count
- Add a "Reviews Received" section on the Profile page showing reviewer avatar, name, star rating, comment, and date, with an empty state when no reviews exist

**User-visible outcome:** Users can successfully create listings without errors, and their profile page becomes a full dashboard where they can view and edit all their info, manage their listings, and see reviews received.
