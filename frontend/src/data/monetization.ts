import { RevenueStream } from '../types/blueprint';

export const revenueStreams: RevenueStream[] = [
  {
    id: 'rev1',
    title: 'Boosted & Promoted Listings',
    revenueType: 'Pay-per-use',
    description: 'Sellers pay a small fee (e.g., D50–D200) to have their listing appear at the top of the home feed and search results for 3–7 days. Simple, high-demand, and easy to understand.',
    projectedImpact: 'Primary revenue driver. Even 5% of active sellers boosting one listing per month generates significant recurring income.',
    isPrimary: true,
    comparisonDemo: {
      standard: { title: 'Used Laptop – Dell Inspiron', price: 18000, location: 'Serrekunda', category: 'Electronics' },
      boosted: { title: 'Used Laptop – Dell Inspiron', price: 18000, location: 'Serrekunda', category: 'Electronics' },
    },
    pricingTiers: [
      {
        duration: '3 Days',
        price: 150,
        currency: 'GMD',
        expectedReach: '~500 views',
        features: ['Top of feed for 3 days', 'Highlighted border', 'Sponsored badge'],
      },
      {
        duration: '7 Days',
        price: 300,
        currency: 'GMD',
        expectedReach: '~1,200 views',
        features: ['Top of feed for 7 days', 'Highlighted border', 'Sponsored badge', 'Category page boost'],
      },
      {
        duration: '30 Days',
        price: 1000,
        currency: 'GMD',
        expectedReach: '~5,000 views',
        features: ['Top of feed for 30 days', 'Gold highlighted border', 'Sponsored badge', 'Category page boost', 'Search result priority'],
      },
    ],
  },
  {
    id: 'rev2',
    title: 'Featured Seller Badge',
    revenueType: 'Subscription',
    description: 'Monthly subscription (e.g., D150/month) for a premium verified seller badge with priority placement in search results and a "Top Seller" label on their profile.',
    projectedImpact: 'Predictable monthly recurring revenue. Targets serious sellers and small business owners.',
    isPrimary: false,
  },
  {
    id: 'rev3',
    title: 'Transaction Fee',
    revenueType: 'Commission',
    description: 'A small percentage fee (1–2%) on completed mobile money transactions processed through the app. Only charged on successful payments.',
    projectedImpact: 'Scales directly with transaction volume. Becomes significant as mobile money adoption grows.',
    isPrimary: false,
  },
  {
    id: 'rev4',
    title: 'Category Sponsorship',
    revenueType: 'Sponsorship',
    description: 'Businesses pay to sponsor a category page (e.g., a phone shop sponsors the "Electronics" category). Their banner and listings appear prominently within that category.',
    projectedImpact: 'High-value deals with established businesses. One sponsorship deal can cover months of server costs.',
    isPrimary: false,
  },
  {
    id: 'rev5',
    title: 'Premium Seller Tools',
    revenueType: 'Subscription',
    description: 'Advanced tools for power sellers: listing analytics, bulk listing upload, scheduled posting, and priority customer support. Priced at D300–D500/month.',
    projectedImpact: 'Targets market traders and small businesses who list frequently. High retention once adopted.',
    isPrimary: false,
  },
  {
    id: 'rev6',
    title: 'Delivery Partner Referrals',
    revenueType: 'Partnership',
    description: 'Earn referral fees from partnered delivery services when buyers request delivery through the app. No upfront cost — pure revenue share model.',
    projectedImpact: 'Low-effort passive income stream that grows with delivery feature adoption in Phase 3.',
    isPrimary: false,
  },
];
