# Gambia Market

## Current State
- Full marketplace app with listings, messaging, profiles, and search
- ListingDetail page has a "Message Seller" CTA button fixed above the bottom nav
- The button uses basic primary color styling with MessageCircle icon
- App.tsx manages routing and does not have any admin functionality
- No admin panel or admin authentication exists

## Requested Changes (Diff)

### Add
- Admin button/entry point visible somewhere in the app (e.g. footer or header area on home page, or a small "Admin" link)
- Admin login modal/page with username and password fields (username: Bigalfu, password: *2FF01d6140@07118559454)
- Admin dashboard page showing basic stats: total listings, total users/conversations
- AdminContext or local state managing admin session

### Modify
- Message Seller button in ListingDetail.tsx: make it more visually attractive, prominent, and clean
  - Use a bold gradient background (green-to-teal or brand gradient)
  - Add a pulse/glow animation to draw attention
  - Larger, more tactile button with rounded corners, clear icon, and label
  - Ensure it is always clickable and navigates instantly to the MessageThread

### Remove
- Nothing removed

## Implementation Plan
1. Redesign the Message Seller button in ListingDetail.tsx with a gradient, shadow, and subtle pulse animation
2. Create AdminLogin component — modal with username/password fields, validation against hardcoded credentials
3. Create AdminDashboard component — shows app stats (listing count, placeholder metrics), with logout
4. Add admin state to App.tsx — isAdminLoggedIn, currentPage includes 'admin-login' and 'admin-dashboard'
5. Add a small "Admin" button/link (e.g. in the AppHeader or at the bottom of Profile page) that opens admin login
6. Wire navigation: admin login success → admin dashboard, admin logout → home

## UX Notes
- Message Seller button: vibrant, high-contrast, with a chat icon. Should feel like a clear call-to-action
- Admin entry: subtle, not intrusive to normal users — small text link or icon in profile page footer
- Admin dashboard: clean, simple stats layout, clearly labeled as admin area
- Admin login: simple centered modal/card with secure-looking input fields
