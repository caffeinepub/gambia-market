import { TechStackItem } from '../types/blueprint';

export const techStackItems: TechStackItem[] = [
  {
    id: 'ts1',
    category: 'Frontend / Mobile',
    technology: 'React Native (Expo)',
    rationale: 'Single codebase for Android and iOS. Expo simplifies builds and OTA updates. React Native performs well on low-end Android devices common in The Gambia.',
    categoryColor: 'green',
  },
  {
    id: 'ts2',
    category: 'Styling',
    technology: 'NativeWind (Tailwind for RN)',
    rationale: 'Utility-first styling that keeps the UI lightweight and consistent. Minimal CSS overhead means faster rendering on budget phones.',
    categoryColor: 'green',
  },
  {
    id: 'ts3',
    category: 'Backend',
    technology: 'Node.js + Express',
    rationale: 'Fast, lightweight REST API server. Large ecosystem of packages for OTP, payments, and file uploads. Easy to deploy on affordable VPS hosting.',
    categoryColor: 'gold',
  },
  {
    id: 'ts4',
    category: 'Database',
    technology: 'PostgreSQL + Redis',
    rationale: 'PostgreSQL for reliable relational data storage. Redis for caching frequently accessed listings and sessions, reducing database load and improving speed.',
    categoryColor: 'gold',
  },
  {
    id: 'ts5',
    category: 'Authentication',
    technology: "Africa's Talking SMS OTP",
    rationale: "Africa's Talking has direct carrier integrations in The Gambia, ensuring reliable SMS delivery for OTP verification at low cost.",
    categoryColor: 'terra',
  },
  {
    id: 'ts6',
    category: 'Image Storage',
    technology: 'Cloudinary',
    rationale: 'Automatic image compression and CDN delivery. Reduces image sizes by up to 70%, critical for users on slow 2G/3G connections in rural Gambia.',
    categoryColor: 'terra',
  },
  {
    id: 'ts7',
    category: 'Payments',
    technology: 'Afrimoney API + QMoney API',
    rationale: 'Direct integration with the two leading mobile money providers in The Gambia. Enables secure in-app payment confirmation without leaving the app.',
    categoryColor: 'gold',
  },
  {
    id: 'ts8',
    category: 'Real-time Chat',
    technology: 'Socket.io',
    rationale: 'Lightweight WebSocket library for real-time messaging. Falls back to long-polling on unstable connections, ensuring chat works even on slow networks.',
    categoryColor: 'green',
  },
  {
    id: 'ts9',
    category: 'Hosting',
    technology: 'DigitalOcean / Hetzner VPS',
    rationale: 'Affordable cloud VPS with data centers in Europe (low latency to West Africa). Scalable as user base grows. ~$10–20/month for MVP.',
    categoryColor: 'terra',
  },
  {
    id: 'ts10',
    category: 'Offline Cache',
    technology: 'WatermelonDB',
    rationale: 'Local database for React Native that caches listings and messages. Users can browse recently loaded content even without an active internet connection.',
    categoryColor: 'green',
  },
];
