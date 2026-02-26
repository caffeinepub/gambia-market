import React from 'react';
import { Clock, X } from 'lucide-react';

interface RecentSearchChipsProps {
  searches: string[];
  onSearchClick: (search: string) => void;
  onRemove: (search: string) => void;
  onClearAll: () => void;
}

export default function RecentSearchChips({ searches, onSearchClick, onRemove, onClearAll }: RecentSearchChipsProps) {
  if (searches.length === 0) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          Recent Searches
        </span>
        <button
          onClick={onClearAll}
          className="text-xs font-body font-medium text-primary hover:text-primary/80 transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((search) => (
          <div
            key={search}
            className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-xl border border-border bg-card text-foreground font-body text-sm hover:border-primary/30 transition-all group"
          >
            <button
              onClick={() => onSearchClick(search)}
              className="hover:text-primary transition-colors"
            >
              {search}
            </button>
            <button
              onClick={() => onRemove(search)}
              className="w-4 h-4 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
