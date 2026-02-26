import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import HomeFeed from './pages/HomeFeed';
import Search from './pages/Search';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import ListingDetail from './pages/ListingDetail';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import MessageThread from './pages/MessageThread';
import PublicProfile from './pages/PublicProfile';
import InstallBanner from './components/InstallBanner';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Principal } from '@dfinity/principal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      retry: 1,
    },
  },
});

type Page =
  | 'home'
  | 'search'
  | 'create-listing'
  | 'edit-listing'
  | 'listing-detail'
  | 'profile'
  | 'chat'
  | 'message-thread'
  | 'public-profile';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedListingId, setSelectedListingId] = useState<bigint | null>(null);
  const [editListingId, setEditListingId] = useState<bigint | null>(null);
  const [messageThreadData, setMessageThreadData] = useState<{
    listingId: bigint;
    otherUserId: Principal;
    otherUserName: string;
  } | null>(null);
  const [publicProfileId, setPublicProfileId] = useState<Principal | null>(null);

  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const navigate = (page: Page) => setCurrentPage(page);

  const handleListingClick = (listingId: bigint) => {
    setSelectedListingId(listingId);
    navigate('listing-detail');
  };

  const handleEditListing = (listingId: bigint) => {
    setEditListingId(listingId);
    navigate('edit-listing');
  };

  const handleCreateListingSuccess = (listingId: bigint) => {
    setSelectedListingId(listingId);
    navigate('listing-detail');
  };

  // Chat.tsx: onConversationClick(otherUserId: Principal, listingId: bigint)
  const handleConversationClick = (otherUserId: Principal, listingId: bigint) => {
    setMessageThreadData({ listingId, otherUserId, otherUserName: '' });
    navigate('message-thread');
  };

  // ListingDetail.tsx: onMessageSeller(sellerId: Principal, listingId: ListingId)
  const handleMessageSeller = (sellerId: Principal, listingId: bigint) => {
    setMessageThreadData({ listingId, otherUserId: sellerId, otherUserName: '' });
    navigate('message-thread');
  };

  const handleSellerClick = (sellerId: Principal) => {
    setPublicProfileId(sellerId);
    navigate('public-profile');
  };

  const handleSellClick = () => {
    navigate('create-listing');
  };

  const handleProfileClick = () => {
    navigate('profile');
  };

  const handleTabChange = (tab: string) => {
    switch (tab) {
      case 'home': navigate('home'); break;
      case 'search': navigate('search'); break;
      case 'sell': handleSellClick(); break;
      case 'chat': navigate('chat'); break;
      case 'profile': handleProfileClick(); break;
    }
  };

  const getActiveTab = (): string => {
    switch (currentPage) {
      case 'home': return 'home';
      case 'search': return 'search';
      case 'chat': return 'chat';
      case 'profile': return 'profile';
      default: return 'home';
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeFeed
            onListingClick={handleListingClick}
            onSellClick={handleSellClick}
          />
        );

      case 'search':
        return (
          <Search
            onListingClick={handleListingClick}
            onBack={() => navigate('home')}
          />
        );

      case 'create-listing':
        return (
          <CreateListing
            onBack={() => navigate('home')}
            onSuccess={handleCreateListingSuccess}
          />
        );

      case 'edit-listing':
        return editListingId !== null ? (
          <EditListing
            listingId={editListingId}
            onCancel={() => navigate('profile')}
            onSuccess={() => navigate('profile')}
          />
        ) : null;

      case 'listing-detail':
        return selectedListingId !== null ? (
          <ListingDetail
            listingId={selectedListingId}
            onBack={() => navigate('home')}
            onMessageSeller={handleMessageSeller}
            onSellerClick={handleSellerClick}
          />
        ) : null;

      case 'profile':
        return (
          <Profile
            onCreateListing={() => navigate('create-listing')}
            onEditListing={handleEditListing}
            onListingClick={handleListingClick}
          />
        );

      case 'chat':
        return (
          <Chat
            onConversationClick={handleConversationClick}
          />
        );

      case 'message-thread':
        return messageThreadData ? (
          <MessageThread
            listingId={messageThreadData.listingId}
            otherUserId={messageThreadData.otherUserId}
            otherUserName={messageThreadData.otherUserName}
            onBack={() => navigate('chat')}
          />
        ) : null;

      case 'public-profile':
        return publicProfileId ? (
          <PublicProfile
            userId={publicProfileId}
            onBack={() => navigate('home')}
            onListingClick={handleListingClick}
          />
        ) : null;

      default:
        return (
          <HomeFeed
            onListingClick={handleListingClick}
            onSellClick={handleSellClick}
          />
        );
    }
  };

  const showBottomNav = !['message-thread', 'create-listing', 'edit-listing'].includes(currentPage);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        onSearch={() => navigate('search')}
        onSell={handleSellClick}
        onProfile={handleProfileClick}
        onLogin={() => navigate('profile')}
      />
      <main className={showBottomNav ? 'pb-16' : ''}>
        {renderPage()}
      </main>
      {showBottomNav && (
        <BottomNav
          activeTab={getActiveTab()}
          onTabChange={handleTabChange}
        />
      )}
      <InstallBanner />
      <Toaster richColors position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
