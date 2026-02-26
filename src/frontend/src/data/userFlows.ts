import { UserFlow } from '../types/blueprint';

export const userFlows: UserFlow[] = [
  {
    id: 'buyer',
    title: 'Buyer Journey',
    color: 'green',
    steps: [
      {
        id: 1,
        label: 'Discover the App',
        description: 'User hears about Gambia Market via word of mouth, social media, or radio ads.',
        icon: 'Smartphone',
      },
      {
        id: 2,
        label: 'Register with Phone',
        description: 'Enter phone number, receive SMS OTP, set display name and region.',
        icon: 'Phone',
      },
      {
        id: 3,
        label: 'Browse & Search',
        description: 'Explore nearby listings on the home feed or search by keyword and category.',
        icon: 'Search',
      },
      {
        id: 4,
        label: 'Contact Seller via Chat',
        description: 'Tap "Chat with Seller" to open in-app messaging and ask questions about the item.',
        icon: 'MessageCircle',
      },
      {
        id: 5,
        label: 'Arrange Delivery or Meet-Up',
        description: 'Agree on delivery to home address or a safe public meet-up location.',
        icon: 'MapPin',
      },
      {
        id: 6,
        label: 'Make Payment',
        description: 'Pay via Afrimoney, QMoney, or agree on cash on delivery.',
        icon: 'Wallet',
      },
      {
        id: 7,
        label: 'Leave a Rating',
        description: 'Rate the seller and leave a review to help future buyers make informed decisions.',
        icon: 'Star',
      },
    ],
  },
  {
    id: 'seller',
    title: 'Seller Journey',
    color: 'terra',
    steps: [
      {
        id: 1,
        label: 'Register & Set Up Profile',
        description: 'Sign up with phone number, add profile photo, and optionally apply for verified badge.',
        icon: 'UserPlus',
      },
      {
        id: 2,
        label: 'Create a Listing',
        description: 'Upload up to 5 photos, write a description, set price, condition, and category.',
        icon: 'PlusCircle',
      },
      {
        id: 3,
        label: 'Listing Goes Live',
        description: 'Listing appears in the home feed for nearby buyers. Optionally boost for more visibility.',
        icon: 'Zap',
      },
      {
        id: 4,
        label: 'Receive Buyer Inquiry',
        description: 'Get notified when a buyer sends a chat message. Respond quickly to close the deal.',
        icon: 'Bell',
      },
      {
        id: 5,
        label: 'Confirm Delivery or Meet-Up',
        description: 'Agree on logistics — delivery to buyer\'s location or a convenient meet-up spot.',
        icon: 'Truck',
      },
      {
        id: 6,
        label: 'Receive Payment',
        description: 'Collect payment via Afrimoney, QMoney, or cash. Mark listing as sold.',
        icon: 'BadgeDollarSign',
      },
      {
        id: 7,
        label: 'Build Reputation',
        description: 'Earn positive reviews and ratings. Grow your seller profile to attract more buyers.',
        icon: 'TrendingUp',
      },
    ],
  },
];
