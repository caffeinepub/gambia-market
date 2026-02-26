import { MVPFeature, MVPTimelineWeek } from '../types/blueprint';

export const mvpFeatures: MVPFeature[] = [
  { id: 'mvp1', title: 'Phone number registration with SMS OTP', priority: 'must-have', featureRef: 'F1' },
  { id: 'mvp2', title: 'Listing creation (photos, category, price, condition, location)', priority: 'must-have', featureRef: 'F2' },
  { id: 'mvp3', title: 'Home feed with nearby listings', priority: 'must-have', featureRef: 'F3' },
  { id: 'mvp4', title: 'Search bar and category/price filters', priority: 'must-have', featureRef: 'F4' },
  { id: 'mvp5', title: 'In-app text chat between buyer and seller', priority: 'must-have', featureRef: 'F5' },
  { id: 'mvp6', title: 'Basic report button for suspicious listings', priority: 'must-have', featureRef: 'F10' },
  { id: 'mvp7', title: 'Verified seller badge system', priority: 'nice-to-have', featureRef: 'F6' },
  { id: 'mvp8', title: 'Delivery request and meet-up arrangement', priority: 'nice-to-have', featureRef: 'F7' },
  { id: 'mvp9', title: 'Mobile money integration (Afrimoney, QMoney)', priority: 'nice-to-have', featureRef: 'F8' },
  { id: 'mvp10', title: 'Star ratings and written reviews', priority: 'nice-to-have', featureRef: 'F9' },
];

export const mvpTimeline: MVPTimelineWeek[] = [
  {
    weeks: 'Week 1–2',
    milestone: 'Auth & Onboarding',
    tasks: ['Phone OTP registration', 'User profile setup', 'Region selection', 'Basic navigation shell'],
  },
  {
    weeks: 'Week 3–4',
    milestone: 'Listings & Feed',
    tasks: ['Listing creation with photo upload', 'Home feed with regional filter', 'Category browsing', 'Search functionality'],
  },
  {
    weeks: 'Week 5–6',
    milestone: 'Chat & Payments',
    tasks: ['In-app real-time chat', 'Push notifications', 'Cash on delivery flow', 'Basic mobile money integration'],
  },
  {
    weeks: 'Week 7–8',
    milestone: 'Testing & Launch',
    tasks: ['QA testing on low-end Android devices', 'Performance optimization', 'Report system', 'Beta launch in Serrekunda & Banjul'],
  },
];
