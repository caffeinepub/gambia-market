import React from 'react';
import { Search, X } from 'lucide-react';

interface ZeroResultsStateProps {
  query: string;
  onClearSearch: () => void;
  suggestedCategories?: string[];
  onCategoryClick?: (category: string) => void;
}

export default function ZeroResultsState({ query, onClearSearch, suggestedCategories, onCategoryClick }: ZeroResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-2">
        No results for "{query}"
      </h3>
      <p className="text-sm font-body text-muted-foreground mb-6 max-w-xs">
        Try different keywords or browse by category to find what you're looking for.
      </p>
      <button
        onClick={onClearSearch}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card text-foreground font-body font-medium text-sm hover:bg-muted transition-all duration-200 mb-6"
      >
        <X className="w-4 h-4" />
        Clear Search
      </button>
      {suggestedCategories && suggestedCategories.length > 0 && (
        <div>
          <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Browse Categories
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {suggestedCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategoryClick?.(cat)}
                className="px-3.5 py-1.5 rounded-xl border border-border bg-card text-foreground font-body text-sm hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
