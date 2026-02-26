import React from 'react';
import { Home, Search, Plus, MessageCircle, User } from 'lucide-react';
import { useMyConversations } from '../hooks/useQueries';

type Tab = 'home' | 'search' | 'sell' | 'chat' | 'profile';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { data: conversations } = useMyConversations();

  const unreadCount = conversations
    ? conversations.filter((m) => !m.isDeleted).length
    : 0;

  const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
    { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { id: 'search', icon: <Search className="w-5 h-5" />, label: 'Search' },
    { id: 'sell', icon: <Plus className="w-6 h-6" />, label: 'Sell' },
    { id: 'chat', icon: <MessageCircle className="w-5 h-5" />, label: 'Chat' },
    { id: 'profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md shadow-nav border-t border-border safe-area-pb">
      <div className="max-w-lg mx-auto flex items-center">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isSell = tab.id === 'sell';

          if (isSell) {
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-2"
                aria-label="Sell"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-button-accent transition-transform duration-200 active:scale-95"
                  style={{ background: 'var(--accent)' }}
                >
                  <Plus className="w-6 h-6 text-accent-foreground" />
                </div>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-all duration-200 relative ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                {tab.icon}
                {tab.id === 'chat' && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold flex items-center justify-center text-accent-foreground" style={{ background: 'var(--accent)' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-body font-semibold leading-none ${isActive ? 'text-primary' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
