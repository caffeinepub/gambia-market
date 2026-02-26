# Specification

## Summary
**Goal:** Polish the mobile layout and organization of all major pages and components in Gambia Market so the app looks and works correctly on small screens (320px+).

**Planned changes:**
- Fix AppHeader for mobile: prevent logo/brand overflow, enforce 44×44px icon tap targets, add consistent horizontal padding
- Fix BottomNav: evenly distribute all 5 tabs, ensure legible labels, add bottom padding to page content so nav never obscures it, and clearly highlight the active tab
- Fix HomeFeed: single-column grid on mobile, contained horizontal scrolls for categories and featured row, full-width search bar, floating Sell Now button positioned above BottomNav
- Fix Search page: full-width auto-focused search bar, wrapping recent search chips, contained filter panels, single-column results grid on mobile
- Fix ListingDetail: vertically stacked single-column layout, full-width sticky action buttons above BottomNav, contained photo carousel
- Fix CreateListing: single-column full-width form, visible step progress indicator, 3-column photo thumbnail grid, full-width submit button above BottomNav
- Fix Chat list: adequate row padding, truncated text with ellipsis, right-aligned timestamps, correct unauthenticated blur overlay
- Fix MessageThread: fixed full-width input bar above BottomNav, max-width message bubbles (80vw), compact listing context header, correctly sized avatars, sufficient bottom padding
- Fix Profile page: centered avatar/name/stats, horizontally scrollable tab bar, single-column listing cards, minimum 44×44px tap targets on all buttons
- Fix PublicProfile: centered header, full-width sticky "Message This Seller" CTA above BottomNav, consistent review card padding
- Apply global mobile typography and spacing: minimum 14px body text, consistent headings, 44px touch targets on all interactive elements, consistent form input padding, no hardcoded widths causing overflow
- Convert modals (ReportModal, BoostModal, GuestNamePrompt, confirmation dialogs) to bottom-sheet style on mobile with rounded top corners, max 90vh height, and scrollable content

**User-visible outcome:** The app is well-organized and fully usable on mobile devices at 320px and above, with no horizontal scroll, properly sized tap targets, readable text, and modals appearing as bottom sheets.
