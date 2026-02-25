# Specification

## Summary
**Goal:** Add PWA support to Gambia Market so mobile users are prompted to install the app to their home screen.

**Planned changes:**
- Create `frontend/public/manifest.json` with app name, short name, start URL, standalone display mode, brand green theme color, background color, and 192×192 / 512×512 icon entries
- Create a minimal `frontend/public/sw.js` service worker that caches the app shell
- Link the manifest and register the service worker in `frontend/index.html`
- Create a reusable `InstallBanner` React component that:
  - On Android/Chrome: listens for `beforeinstallprompt`, shows a dismissible bottom banner with an "Install" button that triggers the native install dialog
  - On iOS Safari: shows a static instructional banner with share icon and "Add to Home Screen" instructions
  - Hides on desktop (max-width 768px only), hides when already in standalone mode, and persists dismissal in localStorage
  - Is styled with the app's West African-inspired green/gold palette
- Integrate `InstallBanner` into `App.tsx` at the root level so it appears on all pages, positioned above the bottom navigation

**User-visible outcome:** Mobile users visiting Gambia Market on Android Chrome or iOS Safari will see a branded install banner prompting them to add the app to their home screen for a faster experience.
