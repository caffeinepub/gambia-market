import type { Principal } from "@dfinity/principal";
import React, { useState } from "react";
import type { ListingId } from "../backend";
import CategoryFilter from "../components/CategoryFilter";
import FeaturedListingsRow from "../components/FeaturedListingsRow";
import HeroSection from "../components/HeroSection";
import ListingCard from "../components/ListingCard";
import SkeletonListingCard from "../components/SkeletonListingCard";
import { useBoostedListings, useListings } from "../hooks/useQueries";

interface HomeFeedProps {
  onListingClick: (id: ListingId) => void;
  onSellClick: () => void;
  onMessageSeller?: (sellerId: Principal, listingId: bigint) => void;
}

export default function HomeFeed({
  onListingClick,
  onSellClick,
  onMessageSeller,
}: HomeFeedProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data: allListings, isLoading } = useListings();
  const { data: boostedListings } = useBoostedListings();

  const filteredListings = allListings
    ? selectedCategory
      ? allListings.filter(
          (l) => l.category === selectedCategory && l.status === "Active",
        )
      : allListings.filter((l) => l.status === "Active")
    : [];

  const handleCategorySelect = (cat: string) => {
    setSelectedCategory((prev) => (prev === cat ? null : cat));
    // Scroll past hero to listings
    setTimeout(() => {
      const el = document.getElementById("listings-section");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  return (
    <div className="pb-24">
      {/* Hero */}
      <HeroSection
        onSellClick={onSellClick}
        onBrowseClick={() => handleCategorySelect(selectedCategory ?? "")}
        onCategorySelect={handleCategorySelect}
      />

      {/* Featured */}
      {boostedListings && boostedListings.length > 0 && (
        <div className="mt-4">
          <FeaturedListingsRow
            listings={boostedListings}
            onListingClick={onListingClick}
          />
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
      <div
        id="listings-section"
        className="px-4 mb-3 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-1 h-5 rounded-full"
            style={{ background: "var(--primary)" }}
          />
          <h2 className="font-display font-bold text-base text-foreground">
            {selectedCategory ? "Category Listings" : "Latest Listings"}
          </h2>
        </div>
        {filteredListings.length > 0 && (
          <span className="text-xs font-body text-muted-foreground">
            {filteredListings.length} items
          </span>
        )}
      </div>

      {/* Listings grid */}
      <div className="px-3">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: skeleton placeholders have no identity
              <SkeletonListingCard key={i} />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div data-ocid="listings.empty_state" className="text-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🛍️</span>
            </div>
            <p className="font-display font-bold text-lg text-foreground mb-2">
              No listings yet
            </p>
            <p className="text-sm font-body text-muted-foreground mb-6">
              Be the first to list something in this category!
            </p>
            <button
              type="button"
              onClick={onSellClick}
              data-ocid="listings.empty_state.primary_button"
              className="px-6 py-3 rounded-xl font-body font-semibold text-sm text-accent-foreground transition-all"
              style={{ background: "var(--accent)" }}
            >
              Post a Listing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredListings.map((listing, index) => (
              <div
                key={listing.id.toString()}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <ListingCard
                  listing={listing}
                  onClick={onListingClick}
                  onMessageSeller={onMessageSeller}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
