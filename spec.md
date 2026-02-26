# Gambia Market

## Current State
A full marketplace web app with 10 pages (HomeFeed, Search, CreateListing, EditListing, ListingDetail, Profile, Chat, MessageThread, PublicProfile, AdminDashboard). The app has a fixed bottom nav, admin login modal, and install banner. The last failed builds attempted to fix: item page layout, message input zoom, search input zoom, message button overlapping nav, and chat badge showing count vs dot.

## Requested Changes (Diff)

### Add
- Nothing new to add

### Modify
1. **ListingDetail page**: Fix the "Message Seller" sticky button so it does NOT overlap the bottom nav bar. The button should sit at `bottom: 80px` (above nav). Make sure all seller info, photos, description, and reviews are fully visible with correct padding below so nothing is hidden behind the fixed button+nav.
2. **MessageThread page**: Ensure tapping the text input does NOT zoom the screen on iOS/Android — set `fontSize: '16px'` on the input (already set, verify it is actually applied). Confirm the input is pinned at the bottom and does not require scrolling.
3. **Search page**: Ensure the search `<input>` (inside SearchBar component) has `fontSize: '16px'` to prevent mobile zoom on focus.
4. **Chat badge (BottomNav)**: Replace numeric badge count on the chat tab with a small red dot indicator that only appears when there are unread messages. No number shown.
5. **Admin dashboard**: Keep the full 5-tab layout (Overview, Listings, Reports, Users, Settings) exactly as currently implemented — do NOT revert to a simpler version.

### Remove
- Nothing to remove

## Implementation Plan
1. Check SearchBar component and ensure the `<input>` inside has `style={{ fontSize: '16px' }}` to prevent iOS auto-zoom.
2. In ListingDetail, verify `style={{ bottom: '80px', zIndex: 40 }}` on the Message Seller button container is correct and the page `paddingBottom` is large enough (`calc(80px + 80px + 16px)`) so content is never hidden.
3. In MessageThread, verify the input `style={{ fontSize: '16px' }}` is applied — it appears to already be set but confirm the className does not override it.
4. In BottomNav, replace the numeric badge on the chat icon with a simple dot (w-2.5 h-2.5 rounded-full bg-red-500) that shows only when unreadCount > 0. Remove any number display.
5. Run typecheck and build to confirm no errors.

## UX Notes
- The bottom nav should always be fixed at the bottom and never move.
- On mobile the Message Seller button must sit visually above the nav bar, not on top of it.
- Input font size 16px is critical on iOS to prevent the entire page from zooming when a user taps a text field.
- The chat badge dot should be subtle — small red dot only, no numbers.
