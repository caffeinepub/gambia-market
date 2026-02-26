import React from 'react';
import { Home, Search, PlusCircle, MessageCircle, User } from 'lucide-react';
import { useMyConversations } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const { identity } = useInternetIdentity();
  const { data: conversations } = useMyConversations();

  const unreadCount = React.useMemo(() => {
    if (!conversations || !identity) return 0;
    const myPrincipal = identity.getPrincipal().toString();
    const seen = new Set<string>();
    let count = 0;
    for (const msg of conversations) {
      if (msg.receiverId.toString() === myPrincipal) {
        const key = `${msg.senderId.toString()}-${msg.listingId.toString()}`;
        if (!seen.has(key)) {
          seen.add(key);
          count++;
        }
      }
    }
    return count;
  }, [conversations, identity]);

  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'sell', label: 'Sell', icon: PlusCircle },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-2xl mx-auto flex items-stretch">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors relative
                ${isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${tab.id === 'sell' ? 'w-6 h-6' : ''}`} />
                {tab.id === 'chat' && unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </div>
              <span className={`text-xs font-medium ${tab.id === 'sell' ? 'text-primary font-bold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
