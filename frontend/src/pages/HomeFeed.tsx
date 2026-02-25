import { useState, useMemo } from 'react';
import { useListings, useCategories, useBoostedListings } from '../hooks/useQueries';
import ListingCard from '../components/ListingCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';
import SkeletonListingCard from '../components/SkeletonListingCard';
import FeaturedListingsRow from '../components/FeaturedListingsRow';
import { ShoppingBag, RefreshCw, Plus } from 'lucide-react';
import type { ListingId } from '../backend';
import PatternDivider from '../components/PatternDivider';

interface HomeFeedProps {
  onListingClick: (id: ListingId) => void;
  initialSearchFocus?: boolean;
  onSellClick?: () => void;
}

export default function HomeFeed({ onListingClick, initialSearchFocus, onSellClick }: HomeFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchText, setSearchText] = useState('');

  const { data: categories } = useCategories();
  const { data: listings, isLoading, refetch, isFetching } = useListings(
    searchText ? undefined : selectedCategory,
    searchText || undefined
  );
  const { data: boostedListings } = useBoostedListings();

  const sortedListings = useMemo(() => {
    if (!listings) return [];
    const boosted = listings.filter((l) => l.isBoosted);
    const regular = listings.filter((l) => !l.isBoosted);
    return [...boosted, ...regular];
  }, [listings]);

  const showFeatured = !searchText && selectedCategory === 'All' && boostedListings && boostedListings.length > 0;

  return (
    <div className="flex flex-col pb-4 relative">
      {/* Search bar */}
      <div className="sticky top-14 z-20 bg-background border-b border-border">
        <SearchBar
          value={searchText}
          onChange={setSearchText}
          autoFocus={initialSearchFocus}
        />
        <CategoryFilter
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          categories={categories}
          listings={listings}
        />
      </div>

      {/* Featured row */}
      {showFeatured && (
        <div className="pt-3">
          <FeaturedListingsRow listings={boostedListings} onListingClick={onListingClick} />
          <PatternDivider thin className="mx-4 mb-1" />
        </div>
      )}

      {/* Refresh bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <p className="text-xs text-muted-foreground font-body">
          {isLoading ? 'Loading…' : `${sortedListings.length} listing${sortedListings.length !== 1 ? 's' : ''}`}
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50"
          aria-label="Refresh listings"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Listings grid */}
      <div className="px-4 pt-1">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonListingCard key={i} />
            ))}
          </div>
        ) : sortedListings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="font-heading font-semibold text-foreground mb-1">
              {searchText ? 'No results found' : 'No listings yet'}
            </p>
            <p className="font-body text-sm text-muted-foreground">
              {searchText ? 'Try a different search term' : 'Be the first to post something!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sortedListings.map((listing) => (
              <ListingCard
                key={listing.id.toString()}
                listing={listing}
                onClick={onListingClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Sell Now button */}
      {onSellClick && (
        <button
          onClick={onSellClick}
          className="fixed bottom-20 right-4 z-40 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-glow hover:bg-primary/90 active:scale-95 transition-all font-body font-semibold text-sm"
          aria-label="Sell Now"
        >
          <Plus className="w-4 h-4" />
          Sell Now
        </button>
      )}
    </div>
  );
}
