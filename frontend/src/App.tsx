import { useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import AppHeader from './components/AppHeader';
import BottomNav from './components/BottomNav';
import HomeFeed from './pages/HomeFeed';
import CreateListing from './pages/CreateListing';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ListingDetail from './pages/ListingDetail';
import MessageThread from './pages/MessageThread';
import PublicProfile from './pages/PublicProfile';
import EditListing from './pages/EditListing';
import InstallBanner from './components/InstallBanner';
import { Toaster } from './components/ui/sonner';
import type { ListingId } from './backend';
import type { Principal } from '@icp-sdk/core/principal';

export type AppPage =
  | { name: 'home' }
  | { name: 'search' }
  | { name: 'sell' }
  | { name: 'chat' }
  | { name: 'profile' }
  | { name: 'listing-detail'; listingId: ListingId }
  | { name: 'message-thread'; listingId: ListingId; otherUserId: Principal; otherUserName: string }
  | { name: 'public-profile'; userId: Principal }
  | { name: 'edit-listing'; listingId: ListingId };

export type NavTab = 'home' | 'search' | 'sell' | 'chat' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<AppPage>({ name: 'home' });
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const navigate = (page: AppPage) => {
    setCurrentPage(page);
    if (page.name === 'home' || page.name === 'search') setActiveTab('home');
    else if (page.name === 'sell' || page.name === 'edit-listing') setActiveTab('sell');
    else if (page.name === 'chat' || page.name === 'message-thread') setActiveTab('chat');
    else if (page.name === 'profile' || page.name === 'public-profile') setActiveTab('profile');
  };

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === 'home') setCurrentPage({ name: 'home' });
    else if (tab === 'search') setCurrentPage({ name: 'home' });
    else if (tab === 'sell') setCurrentPage({ name: 'sell' });
    else if (tab === 'chat') setCurrentPage({ name: 'chat' });
    else if (tab === 'profile') setCurrentPage({ name: 'profile' });
  };

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    setCurrentPage({ name: 'home' });
    setActiveTab('home');
  };

  const renderPage = () => {
    switch (currentPage.name) {
      case 'home':
      case 'search':
        return (
          <HomeFeed
            onListingClick={(id) => navigate({ name: 'listing-detail', listingId: id })}
            initialSearchFocus={currentPage.name === 'search'}
          />
        );
      case 'sell':
        return (
          <CreateListing
            onSuccess={(id) => navigate({ name: 'listing-detail', listingId: id })}
            onCancel={() => navigate({ name: 'home' })}
          />
        );
      case 'chat':
        return (
          <Chat
            onConversationClick={(listingId, otherUserId, otherUserName) =>
              navigate({ name: 'message-thread', listingId, otherUserId, otherUserName })
            }
          />
        );
      case 'profile':
        return (
          <Profile
            onLogout={handleLogout}
            onListingClick={(id) => navigate({ name: 'listing-detail', listingId: id })}
            onEditListing={(id) => navigate({ name: 'edit-listing', listingId: id })}
          />
        );
      case 'listing-detail':
        return (
          <ListingDetail
            listingId={currentPage.listingId}
            onBack={() => navigate({ name: 'home' })}
            onMessageSeller={(listingId, sellerId, sellerName) =>
              navigate({ name: 'message-thread', listingId, otherUserId: sellerId, otherUserName: sellerName })
            }
            onSellerClick={(userId) => navigate({ name: 'public-profile', userId })}
          />
        );
      case 'message-thread':
        return (
          <MessageThread
            listingId={currentPage.listingId}
            otherUserId={currentPage.otherUserId}
            otherUserName={currentPage.otherUserName}
            onBack={() => navigate({ name: 'chat' })}
          />
        );
      case 'public-profile':
        return (
          <PublicProfile
            userId={currentPage.userId}
            onBack={() => navigate({ name: 'home' })}
          />
        );
      case 'edit-listing':
        return (
          <EditListing
            listingId={currentPage.listingId}
            onSuccess={(id) => navigate({ name: 'listing-detail', listingId: id })}
            onCancel={() => navigate({ name: 'profile' })}
          />
        );
      default:
        return <HomeFeed onListingClick={(id) => navigate({ name: 'listing-detail', listingId: id })} />;
    }
  };

  const showBottomNav = !['message-thread'].includes(currentPage.name);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader
        onLogoClick={() => navigate({ name: 'home' })}
        onSearchClick={() => handleTabChange('search')}
        onProfileClick={() => handleTabChange('profile')}
        isAuthenticated={!!identity}
      />

      <main className="flex-1 overflow-y-auto pb-20">
        {renderPage()}
      </main>

      {showBottomNav && (
        <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
      )}

      {/* PWA Install Banner — renders above BottomNav via z-50 */}
      <InstallBanner />

      <Toaster richColors position="top-center" />
    </div>
  );
}

export default App;
