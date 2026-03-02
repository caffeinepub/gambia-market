import type { Principal } from "@dfinity/principal";
import { MapPin, MessageCircle, Zap } from "lucide-react";
import React from "react";
import {
  ListingCategory,
  type ListingId,
  type PublicListing,
} from "../backend";

interface ListingCardProps {
  listing: PublicListing;
  onClick: (id: ListingId) => void;
  onMessageSeller?: (sellerId: Principal, listingId: bigint) => void;
}

const categoryEmoji: Record<string, string> = {
  [ListingCategory.carsAndTrucks]: "🚗",
  [ListingCategory.motorcycles]: "🏍️",
  [ListingCategory.bicycles]: "🚲",
  [ListingCategory.spareParts]: "🔧",
  [ListingCategory.electronics]: "💻",
  [ListingCategory.phones]: "📱",
  [ListingCategory.laptops]: "💻",
  [ListingCategory.furniture]: "🛋️",
  [ListingCategory.appliances]: "🏠",
  [ListingCategory.clothing]: "👕",
  [ListingCategory.shoes]: "👟",
  [ListingCategory.fashion]: "👗",
  [ListingCategory.beauty]: "💄",
  [ListingCategory.health]: "💊",
  [ListingCategory.services]: "🛠️",
  [ListingCategory.pets]: "🐾",
  [ListingCategory.realEstate]: "🏡",
  [ListingCategory.other]: "📦",
};

export default function ListingCard({
  listing,
  onClick,
  onMessageSeller,
}: ListingCardProps) {
  const emoji = categoryEmoji[listing.category as string] || "📦";
  const hasPhoto = listing.photos && listing.photos.length > 0;

  return (
    <button
      type="button"
      onClick={() => onClick(listing.id)}
      className="group w-full text-left bg-card rounded-2xl border border-border overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200"
    >
      {/* Square image container */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {hasPhoto ? (
          <img
            src={listing.photos[0].getDirectURL()}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-40">{emoji}</span>
          </div>
        )}

        {/* Bottom gradient overlay */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Price over gradient */}
        <div className="absolute bottom-2 left-2 pointer-events-none">
          <span className="text-white font-bold text-sm drop-shadow-md font-display">
            D {Number(listing.price).toLocaleString()}
          </span>
        </div>

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {listing.isBoosted && (
            <span
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-body text-accent-foreground shadow-sm"
              style={{ background: "var(--accent)" }}
            >
              <Zap className="w-2.5 h-2.5" />
              Featured
            </span>
          )}
        </div>

        {/* Sold/inactive overlay */}
        {listing.status !== "Active" && (
          <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
            <span className="px-3 py-1 rounded-lg bg-card text-foreground text-xs font-bold font-body">
              {listing.status}
            </span>
          </div>
        )}

        {/* Message seller button */}
        {onMessageSeller && (
          <button
            type="button"
            data-ocid="listing_card.message_button"
            onClick={(e) => {
              e.stopPropagation();
              onMessageSeller(listing.sellerId, listing.id);
            }}
            title="Message seller"
            className="absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 active:scale-90 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.44 0.16 185))",
              boxShadow: "0 2px 10px oklch(0.44 0.18 160 / 0.5)",
            }}
          >
            <MessageCircle className="w-4 h-4 text-white fill-white/20" />
          </button>
        )}
      </div>

      {/* Card body: title + location + condition */}
      <div className="p-2.5">
        <h3 className="font-body font-semibold text-xs text-foreground line-clamp-1 leading-snug mb-1.5 group-hover:text-primary transition-colors">
          {listing.title}
        </h3>

        <div className="flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1 min-w-0">
            <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
            <span className="text-[10px] font-body text-muted-foreground truncate">
              {listing.location}
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[9px] font-body font-medium">
            {listing.condition}
          </span>
        </div>
      </div>
    </button>
  );
}
