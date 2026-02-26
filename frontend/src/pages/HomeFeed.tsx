import React, { useState } from 'react';
import { useListings, useBoostedListings } from '../hooks/useQueries';
import { ListingId, ListingCategory } from '../backend';
import HeroSection from '../components/HeroSection';
import FeaturedListingsRow from '../components/FeaturedListingsRow';
import CategoryFilter from '../components/CategoryFilter';
import ListingCard from '../components/ListingCard';
import SkeletonListingCard from '../components/SkeletonListingCard';

interface HomeFeedProps {
  onListingClick: (id: ListingId) => void;
  onSellClick: () => void;
}

export default function HomeFeed({ onListingClick, onSellClick }: HomeFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: allListings, isLoading } = useListings();
  const { data: boostedListings } = useBoostedListings();

  const filteredListings = allListings
    ? selectedCategory
      ? allListings.filter((l) => l.category === selectedCategory && l.status === 'Active')
      : allListings.filter((l) => l.status === 'Active')
    : [];

  return (
    <div className="pb-24">
      {/* Hero */}
      <HeroSection onSellClick={onSellClick} onBrowseClick={() => {}} />

      {/* Featured */}
      {boostedListings && boostedListings.length > 0 && (
        <div className="mt-4">
          <FeaturedListingsRow listings={boostedListings} onListingClick={onListingClick} />
        </div>
      )}

      {/* Category Filter */}
      <div className="mt-4 mb-3">
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
      </div>

      {/* Section header */}
      <div className="px-4 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1 h-5 rounded-full" style={{ background: 'var(--primary)' }} />
          <h2 className="font-display font-bold text-base text-foreground">
            {selectedCategory ? 'Category Listings' : 'Latest Listings'}
          </h2>
        </div>
        {filteredListings.length > 0 && (
          <span className="text-xs font-body text-muted-foreground">
            {filteredListings.length} items
          </span>
        )}
      </div>

      {/* Listings grid */}
      <div className="px-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonListingCard key={i} />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛍️</span>
            </div>
            <p className="font-display font-bold text-lg text-foreground mb-2">No listings yet</p>
            <p className="text-sm font-body text-muted-foreground mb-6">
              Be the first to list something in this category!
            </p>
            <button
              onClick={onSellClick}
              className="px-6 py-3 rounded-xl font-body font-semibold text-sm text-accent-foreground shadow-button-accent transition-all"
              style={{ background: 'var(--accent)' }}
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredListings.map((listing) => (
              <ListingCard
                key={listing.id.toString()}
                listing={listing}
                onClick={onListingClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
