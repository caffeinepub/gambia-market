import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSearchListings } from '../hooks/useQueries';
import { ListingId } from '../backend';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import RecentSearchChips from '../components/RecentSearchChips';
import ZeroResultsState from '../components/ZeroResultsState';

interface SearchProps {
  onListingClick?: (id: ListingId) => void;
  onBack?: () => void;
}

const POPULAR_CATEGORIES = ['Cars', 'Phones', 'Electronics', 'Real Estate', 'Furniture', 'Clothing'];
const STORAGE_KEY = 'gm-recent-searches';

export default function Search({ onListingClick, onBack }: SearchProps) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const { data: results, isLoading } = useSearchListings(submittedQuery);

  const handleSearch = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setSubmittedQuery(trimmed);
    setRecentSearches((prev) => {
      const updated = [trimmed, ...prev.filter((s) => s !== trimmed)].slice(0, 8);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleListingClick = (id: ListingId) => {
    onListingClick?.(id);
  };

  const handleClearSearch = () => {
    setQuery('');
    setSubmittedQuery('');
  };

  const handleRemoveRecent = (search: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== search);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const hasResults = results && results.length > 0;
  const hasSearched = submittedQuery.length > 0;

  return (
    <div className="pb-24 min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-14 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="flex-1">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              placeholder="Search listings…"
              autoFocus
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-5">
        {/* Recent searches */}
        {!hasSearched && (
          <RecentSearchChips
            searches={recentSearches}
            onSearchClick={(s) => { setQuery(s); setSubmittedQuery(s); }}
            onRemove={handleRemoveRecent}
            onClearAll={handleClearAllRecent}
          />
        )}

        {/* Popular categories */}
        {!hasSearched && (
          <div>
            <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Popular Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CATEGORIES.map((cat) => (
                <button
                  type="button"
                  key={cat}
                  onClick={() => { setQuery(cat); setSubmittedQuery(cat); }}
                  className="px-3.5 py-2 rounded-xl border border-border bg-card text-foreground font-body text-sm hover:border-primary/40 hover:bg-muted/50 transition-all duration-200"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {hasSearched && (
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {['s1','s2','s3','s4','s5','s6'].map((k) => (
                  <SkeletonListingCard key={k} />
                ))}
              </div>
            ) : hasResults ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: 'var(--primary)' }} />
                    <h2 className="font-display font-bold text-base text-foreground">
                      Results for "{submittedQuery}"
                    </h2>
                  </div>
                  <span className="text-xs font-body text-muted-foreground">
                    {results.length} found
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {results.map((listing) => (
                    <ListingCard
                      key={listing.id.toString()}
                      listing={listing}
                      onClick={handleListingClick}
                    />
                  ))}
                </div>
              </>
            ) : (
              <ZeroResultsState
                query={submittedQuery}
                onClearSearch={handleClearSearch}
                suggestedCategories={POPULAR_CATEGORIES}
                onCategoryClick={(cat) => { setQuery(cat); setSubmittedQuery(cat); }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
