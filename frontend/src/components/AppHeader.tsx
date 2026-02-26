import React from 'react';
import { Search, Sun, Moon, User, Plus, ShoppingBag } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface AppHeaderProps {
  onSearchClick?: () => void;
  onProfileClick?: () => void;
  onSellClick?: () => void;
  onLogoClick?: () => void;
}

export default function AppHeader({
  onSearchClick,
  onProfileClick,
  onSellClick,
  onLogoClick,
}: AppHeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md shadow-header border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-3">
        {/* Logo */}
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2.5 shrink-0 group"
        >
          <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-button">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="hidden sm:block">
            <span className="font-display font-bold text-lg text-foreground leading-none">
              Gambia
            </span>
            <span className="font-display font-bold text-lg leading-none" style={{ color: 'var(--brand-coral)' }}>
              Market
            </span>
          </div>
        </button>

        {/* Search bar — desktop */}
        <button
          onClick={onSearchClick}
          className="hidden md:flex flex-1 max-w-md items-center gap-3 px-4 py-2.5 rounded-xl bg-muted border border-border hover:border-primary/40 hover:bg-muted/80 transition-all duration-200 text-muted-foreground group"
        >
          <Search className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
          <span className="text-sm font-body">Search listings, categories…</span>
        </button>

        <div className="flex-1 md:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          {/* Search — mobile */}
          <button
            onClick={onSearchClick}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Sell button */}
          <button
            onClick={onSellClick}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-body font-semibold text-sm transition-all duration-200 shadow-button-accent text-accent-foreground"
            style={{ background: 'var(--accent)' }}
          >
            <Plus className="w-4 h-4" />
            <span>Sell</span>
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-200"
            aria-label="Profile"
          >
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
