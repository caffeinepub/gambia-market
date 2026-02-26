export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  // REQ-13: Phone registration flow
  flowSteps?: FlowStep[];
  // REQ-14: Listing creation flow
  creationSteps?: CreationStep[];
  // REQ-15: Home feed mockup
  sampleListings?: SampleListing[];
  // REQ-16: Search & filters
  filterOptions?: FilterOptions;
  // REQ-17: In-app chat
  chatDemo?: ChatDemo;
  // REQ-18: Verified seller badge
  verificationProcess?: VerificationStep[];
  sampleProfile?: SellerProfile;
  // REQ-19: Delivery & meet-up
  fulfillmentOptions?: FulfillmentOption[];
  // REQ-20: Mobile money payments
  paymentMethods?: PaymentMethod[];
  transactionStates?: TransactionState[];
  // REQ-21: Trust & safety
  trustMechanisms?: TrustMechanism[];
}

// REQ-13
export interface FlowStep {
  stepNumber: number;
  stepTitle: string;
  iconName: string;
  fields: FlowField[];
}

export interface FlowField {
  fieldName: string;
  fieldType: string;
  placeholder: string;
  validationState: 'neutral' | 'valid' | 'invalid';
}

// REQ-14
export interface CreationStep {
  stepNumber: number;
  stepTitle: string;
  fieldType: 'upload' | 'dropdown' | 'number' | 'radio' | 'location' | 'text';
  options?: string[];
  hint: string;
  iconName: string;
}

// REQ-15
export interface SampleListing {
  id: string;
  title: string;
  price: number;
  location: string;
  distance: number;
  category: string;
  imagePlaceholder: string;
  condition: string;
}

// REQ-16
export interface FilterOptions {
  searchPlaceholder: string;
  categories: string[];
  priceRange: { min: number; max: number; currency: string };
  conditions: string[];
  activeFilters?: { category?: string; condition?: string };
}

// REQ-17
export interface ChatMessage {
  id: string;
  sender: string;
  role: 'buyer' | 'seller';
  text: string;
  timestamp: string;
}

export interface ChatDemo {
  listingContext: { title: string; price: number; colorPlaceholder: string };
  sampleMessages: ChatMessage[];
  inputPlaceholder: string;
}

// REQ-18
export interface VerificationStep {
  stepNumber: number;
  status: 'complete' | 'in-progress' | 'pending';
  title: string;
  description: string;
}

export interface SellerProfile {
  name: string;
  verified: boolean;
  rating: number;
  transactionCount: number;
  memberSince: string;
  badgeImage: string;
}

// REQ-19
export interface FulfillmentOption {
  type: 'delivery' | 'meetup';
  iconName: string;
  title: string;
  description: string;
  sampleFields: { label: string; placeholder: string }[];
}

// REQ-20
export interface PaymentMethod {
  iconName: string;
  methodName: string;
  description: string;
  available: boolean;
  badgeColor: string;
}

export interface TransactionState {
  status: 'pending' | 'completed' | 'failed';
  label: string;
  color: string;
}

// REQ-21
export interface TrustMechanism {
  mechanismType: 'rating' | 'review' | 'report' | 'block';
  title: string;
  description: string;
  ratingValue?: number;
  sampleReview?: { text: string; reviewer: string; rating: number };
  reportReasons?: string[];
  confirmationText?: string;
}

export interface UserFlowStep {
  id: number;
  label: string;
  description: string;
  icon: string;
}

export interface UserFlow {
  id: string;
  title: string;
  color: 'green' | 'terra';
  steps: UserFlowStep[];
}

export interface DatabaseField {
  name: string;
  type: string;
  description: string;
}

export interface DatabaseEntity {
  id: string;
  name: string;
  description: string;
  fields: DatabaseField[];
  relationships: string[];
}

export interface TechStackItem {
  id: string;
  category: string;
  technology: string;
  rationale: string;
  categoryColor: 'green' | 'gold' | 'terra';
}

export interface MVPFeature {
  id: string;
  title: string;
  priority: 'must-have' | 'nice-to-have';
  featureRef?: string;
}

export interface MVPTimelineWeek {
  weeks: string;
  milestone: string;
  tasks: string[];
}

export interface FutureFeature {
  id: string;
  title: string;
  description: string;
  phase: 'Phase 2' | 'Phase 3';
}

export interface RevenueStream {
  id: string;
  title: string;
  revenueType: 'Subscription' | 'Pay-per-use' | 'Commission' | 'Sponsorship' | 'Partnership';
  description: string;
  projectedImpact: string;
  isPrimary: boolean;
  // REQ-22
  comparisonDemo?: ListingComparison;
  pricingTiers?: BoostTier[];
}

// REQ-22
export interface ListingComparison {
  standard: { title: string; price: number; location: string; category: string };
  boosted: { title: string; price: number; location: string; category: string };
}

export interface BoostTier {
  duration: string;
  price: number;
  currency: string;
  expectedReach: string;
  features: string[];
}

export interface RoadmapPhase {
  phase: number;
  name: string;
  timeframe: string;
  deliverables: string[];
  successMetrics: string[];
}
