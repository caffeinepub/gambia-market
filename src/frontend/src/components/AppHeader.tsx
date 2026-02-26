import React from 'react';
import { Search, Plus, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';

interface AppHeaderProps {
  onSearch?: () => void;
  onSell?: () => void;
  onProfile?: () => void;
  onLogin?: () => void;
}

export default function AppHeader({ onSearch, onSell, onProfile, onLogin }: AppHeaderProps) {
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const queryClient = useQueryClient();

  const { data: userProfile } = useGetCallerUserProfile();

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      if (onLogin) {
        onLogin();
      } else {
        try {
          await login();
        } catch (error: unknown) {
          const err = error as Error;
          if (err?.message === 'User is already authenticated') {
            await clear();
            setTimeout(() => login(), 300);
          }
        }
      }
    }
  };

  const profilePicUrl = userProfile?.profilePic ? userProfile.profilePic.getDirectURL() : null;
  const initials = userProfile?.name
    ? userProfile.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-3">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-green rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">GM</span>
          </div>
          <span className="font-bold text-foreground text-base hidden sm:block">Gambia Market</span>
        </div>

        {/* Search bar */}
        <button
          type="button"
          onClick={onSearch}
          className="flex-1 flex items-center gap-2 bg-muted rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-muted/80 transition-colors min-w-0"
        >
          <Search className="w-4 h-4 shrink-0" />
          <span className="truncate">Search listings...</span>
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isAuthenticated && (
            <Button
              onClick={onSell}
              size="sm"
              className="bg-brand-green hover:bg-brand-green/90 text-white gap-1.5 hidden sm:flex"
            >
              <Plus className="w-4 h-4" />
              Sell
            </Button>
          )}

          {isAuthenticated ? (
            <button
              type="button"
              onClick={onProfile}
              className="w-9 h-9 rounded-full overflow-hidden border-2 border-brand-green/30 hover:border-brand-green transition-colors"
              title="My Profile"
            >
              <Avatar className="w-full h-full">
                {profilePicUrl ? (
                  <AvatarImage src={profilePicUrl} alt={userProfile?.name || 'Profile'} />
                ) : null}
                <AvatarFallback className="bg-brand-green text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : (
            <Button
              onClick={handleAuth}
              variant="outline"
              size="sm"
              disabled={loginStatus === 'logging-in'}
              className="gap-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden sm:inline">
                {loginStatus === 'logging-in' ? 'Logging in...' : 'Login'}
              </span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
