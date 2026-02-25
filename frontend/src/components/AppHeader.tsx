import { Search, User, ShoppingBag } from 'lucide-react';

interface AppHeaderProps {
  onLogoClick: () => void;
  onSearchClick: () => void;
  onProfileClick: () => void;
  isAuthenticated: boolean;
}

export default function AppHeader({ onLogoClick, onSearchClick, onProfileClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 focus:outline-none"
          aria-label="Go to home"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
            <ShoppingBag className="w-4 h-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-heading font-black text-base text-foreground tracking-tight">
              Gambia
            </span>
            <span className="font-heading font-black text-base text-primary leading-none tracking-tight">
              Market
            </span>
          </div>
        </button>

        {/* Kente accent line */}
        <div className="hidden sm:block flex-1 mx-6 h-1 kente-pattern-thin rounded-full opacity-60" />

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={onSearchClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Search listings"
          >
            <Search className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={onProfileClick}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
      {/* Kente strip */}
      <div className="kente-pattern w-full" style={{ height: '3px' }} />
    </header>
  );
}
