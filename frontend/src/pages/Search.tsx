import { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useSearchListings, useCategories } from '../hooks/useQueries';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';
import ZeroResultsState from '../components/ZeroResultsState';
import RecentSearchChips from '../components/RecentSearchChips';
import type { ListingId } from '../backend';

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT = 8;

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function loadRecentSearches(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_SEARCHES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]) {
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
}

interface SearchPageProps {
  onListingClick: (id: ListingId) => void;
  onCategorySelect?: (category: string) => void;
}

export default function SearchPage({ onListingClick, onCategorySelect }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(loadRecentSearches);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedQuery = useDebounce(query, 300);
  const { data: categories } = useCategories();
  const { data: results, isLoading } = useSearchListings(debouncedQuery);

  // Auto-focus on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Save to recent searches when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length > 1) {
      setRecentSearches((prev) => {
        const updated = [debouncedQuery.trim(), ...prev.filter((s) => s !== debouncedQuery.trim())].slice(0, MAX_RECENT);
        saveRecentSearches(updated);
        return updated;
      });
    }
  }, [debouncedQuery]);

  const handleRemoveRecent = useCallback((term: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== term);
      saveRecentSearches(updated);
      return updated;
    });
  }, []);

  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
    saveRecentSearches([]);
  }, []);

  const handleSelectRecent = useCallback((term: string) => {
    setQuery(term);
    inputRef.current?.focus();
  }, []);

  const handleCategoryClick = (cat: string) => {
    if (onCategorySelect) {
      onCategorySelect(cat);
    }
  };

  // Apply client-side filters
  const filteredResults = (results ?? []).filter((l) => {
    if (selectedCondition && l.condition !== selectedCondition) return false;
    if (maxPrice && Number(l.price) > Number(maxPrice)) return false;
    return true;
  });

  const showResults = debouncedQuery.trim().length > 0;
  const showEmpty = showResults && !isLoading && filteredResults.length === 0;

  return (
    <div className="flex flex-col min-h-full">
      {/* Search bar */}
      <div className="sticky top-14 z-20 bg-background border-b border-border px-4 py-3 flex flex-col gap-2">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search listings…"
            className="w-full h-12 pl-9 pr-20 rounded-xl bg-muted border border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-body"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {query && (
              <button
                onClick={() => setQuery('')}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30 transition-colors"
                aria-label="Clear"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            )}
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                showFilters ? 'bg-primary text-primary-foreground' : 'hover:bg-muted text-muted-foreground'
              }`}
              aria-label="Filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter panel */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            showFilters ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-3 pt-1 pb-2">
            {/* Condition filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-muted-foreground w-16 flex-shrink-0">Condition</span>
              <div className="flex gap-2 flex-wrap">
                {['', 'New', 'Used', 'Refurbished'].map((cond) => (
                  <button
                    key={cond || 'any'}
                    onClick={() => setSelectedCondition(cond)}
                    className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all ${
                      selectedCondition === cond
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {cond || 'Any'}
                  </button>
                ))}
              </div>
            </div>

            {/* Max price */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-muted-foreground w-16 flex-shrink-0">Max Price</span>
              <div className="relative flex-1 max-w-[160px]">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-primary">D</span>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Any"
                  className="w-full h-8 pl-6 pr-3 rounded-lg bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 font-body"
                />
              </div>
              {(selectedCondition || maxPrice) && (
                <button
                  onClick={() => { setSelectedCondition(''); setMaxPrice(''); }}
                  className="text-xs text-destructive font-body hover:underline"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {/* Recent searches (shown when no query) */}
        {!showResults && (
          <div className="pt-2">
            <RecentSearchChips
              searches={recentSearches}
              onSelect={handleSelectRecent}
              onRemove={handleRemoveRecent}
              onClear={handleClearRecent}
            />

            {/* Category quick links */}
            {!recentSearches.length && (
              <div className="px-4 pt-4">
                <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-3">
                  Browse by Category
                </p>
                <div className="grid grid-cols-4 gap-3">
                  {(categories && categories.length > 0
                    ? categories
                    : ['Electronics', 'Clothing', 'Food', 'Vehicles', 'Services', 'Furniture', 'Agriculture', 'Other']
                  ).map((cat) => {
                    const icons: Record<string, string> = {
                      Electronics: '📱', Clothing: '👗', Food: '🥘', Vehicles: '🚗',
                      Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
                    };
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <span className="text-2xl">{icons[cat] || '📦'}</span>
                        <span className="text-[11px] font-body font-medium text-foreground leading-tight text-center">{cat}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading skeletons */}
        {showResults && isLoading && (
          <div className="grid grid-cols-2 gap-3 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonListingCard key={i} />
            ))}
          </div>
        )}

        {/* Zero results */}
        {showEmpty && (
          <ZeroResultsState
            searchTerm={debouncedQuery}
            onCategoryClick={handleCategoryClick}
          />
        )}

        {/* Results */}
        {showResults && !isLoading && filteredResults.length > 0 && (
          <div className="p-4">
            <p className="text-xs text-muted-foreground font-body mb-3">
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} for "{debouncedQuery}"
            </p>
            <div className="grid grid-cols-2 gap-3">
              {filteredResults.map((listing) => (
                <ListingCard
                  key={listing.id.toString()}
                  listing={listing}
                  onClick={onListingClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
