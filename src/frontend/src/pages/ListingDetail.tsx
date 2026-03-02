import type { Principal } from "@dfinity/principal";
import {
  ArrowLeft,
  BedDouble,
  Calendar,
  ChevronDown,
  ChevronUp,
  Flag,
  Heart,
  MapPin,
  MessageCircle,
  Move,
  Share2,
  Sofa,
  Tag,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import type { ListingId } from "../backend";
import PhotoCarousel from "../components/PhotoCarousel";
import ReportModal from "../components/ReportModal";
import ReviewForm from "../components/ReviewForm";
import ReviewsList from "../components/ReviewsList";
import SellerInfo from "../components/SellerInfo";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useListing } from "../hooks/useQueries";

interface ListingDetailProps {
  listingId: ListingId;
  onBack: () => void;
  onMessageSeller: (sellerId: Principal, listingId: ListingId) => void;
  onSellerClick: (userId: Principal) => void;
}

export default function ListingDetail({
  listingId,
  onBack,
  onMessageSeller,
  onSellerClick,
}: ListingDetailProps) {
  const [showReport, setShowReport] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);
  const { data: listing, isLoading } = useListing(listingId);
  const { identity } = useInternetIdentity();

  const timeAgo = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const diff = Date.now() - ms;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    return new Date(ms).toLocaleDateString();
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title ?? "Gambia Market Listing",
          text: listing?.description ?? "",
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Could not copy link");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="aspect-[4/3] bg-muted animate-pulse" />
          <div className="px-4 space-y-3">
            <div className="h-6 rounded-xl bg-muted animate-pulse w-3/4" />
            <div className="h-8 rounded-xl bg-muted animate-pulse w-1/3" />
            <div className="h-4 rounded-lg bg-muted animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-muted-foreground">Listing not found</p>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 text-primary font-body font-medium"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const isOwner =
    identity &&
    listing.sellerId.toString() === identity.getPrincipal().toString();

  const DESC_LIMIT = 120;
  const longDesc =
    listing.description && listing.description.length > DESC_LIMIT;

  return (
    <div
      className="min-h-screen bg-background"
      style={{ paddingBottom: "calc(80px + 80px + 24px)" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          data-ocid="listing_detail.back.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-1">
          {/* Save/heart button */}
          <button
            type="button"
            data-ocid="listing_detail.save.toggle"
            onClick={() => setIsSaved((v) => !v)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isSaved
                ? "text-red-500 bg-red-50 dark:bg-red-950"
                : "text-muted-foreground hover:text-red-400 hover:bg-muted"
            }`}
            title={isSaved ? "Unsave" : "Save listing"}
          >
            <Heart
              className="w-4 h-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
          {/* Share button */}
          <button
            type="button"
            data-ocid="listing_detail.share.button"
            onClick={handleShare}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            title="Share listing"
          >
            <Share2 className="w-4 h-4" />
          </button>
          {/* Report button */}
          <button
            type="button"
            data-ocid="listing_detail.report.button"
            onClick={() => setShowReport(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-all"
            title="Report listing"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photos — full width, no horizontal padding */}
      <div className="w-full">
        <PhotoCarousel
          photos={listing.photos}
          title={listing.title}
          fullBleed
        />
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-5">
        {/* Title & Price */}
        <div>
          <h1 className="font-display font-bold text-xl text-foreground mb-3 leading-snug">
            {listing.title}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="font-display font-bold text-3xl px-3 py-1 rounded-full inline-block"
              style={{
                color: "var(--brand-green)",
                background: "oklch(0.58 0.16 155 / 0.1)",
              }}
            >
              D {Number(listing.price).toLocaleString()}
            </span>
            {listing.isBoosted && (
              <span
                className="px-2 py-0.5 rounded-lg text-xs font-body font-bold text-accent-foreground"
                style={{ background: "var(--accent)" }}
              >
                ⚡ Boosted
              </span>
            )}
          </div>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-body font-medium">
            <Tag className="w-3.5 h-3.5 text-primary" />
            {listing.condition}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-body font-medium">
            <MapPin className="w-3.5 h-3.5 text-primary" />
            {listing.location}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-foreground text-xs font-body font-medium">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            {timeAgo(listing.createdAt)}
          </span>
        </div>

        {/* Real Estate details */}
        {listing.category === "realEstate" && (
          <div className="grid grid-cols-3 gap-2">
            {listing.numBedrooms !== undefined &&
              listing.numBedrooms !== null && (
                <div className="flex flex-col items-center gap-1.5 p-3 bg-muted/60 rounded-2xl border border-border">
                  <BedDouble className="w-5 h-5 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground">
                    {Number(listing.numBedrooms)}
                  </span>
                  <span className="text-[10px] font-body text-muted-foreground">
                    Bedrooms
                  </span>
                </div>
              )}
            {listing.propertySize !== undefined &&
              listing.propertySize !== null && (
                <div className="flex flex-col items-center gap-1.5 p-3 bg-muted/60 rounded-2xl border border-border">
                  <Move className="w-5 h-5 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground">
                    {Number(listing.propertySize)} m²
                  </span>
                  <span className="text-[10px] font-body text-muted-foreground">
                    Size
                  </span>
                </div>
              )}
            {listing.isFurnished !== undefined &&
              listing.isFurnished !== null && (
                <div className="flex flex-col items-center gap-1.5 p-3 bg-muted/60 rounded-2xl border border-border">
                  <Sofa className="w-5 h-5 text-primary" />
                  <span className="text-xs font-body font-semibold text-foreground">
                    {listing.isFurnished ? "Yes" : "No"}
                  </span>
                  <span className="text-[10px] font-body text-muted-foreground">
                    Furnished
                  </span>
                </div>
              )}
            {listing.subCategory && (
              <div className="flex flex-col items-center gap-1.5 p-3 bg-muted/60 rounded-2xl border border-border">
                <Sofa className="w-5 h-5 text-primary" />
                <span className="text-[10px] font-body font-semibold text-foreground capitalize text-center leading-tight">
                  {String(listing.subCategory)
                    .replace(/([A-Z])/g, " $1")
                    .trim()}
                </span>
                <span className="text-[10px] font-body text-muted-foreground">
                  Sub-type
                </span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div>
            <h3 className="font-body font-semibold text-sm text-foreground mb-2">
              Description
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {longDesc && !descExpanded
                ? `${listing.description.slice(0, DESC_LIMIT)}…`
                : listing.description}
            </p>
            {longDesc && (
              <button
                type="button"
                data-ocid="listing_detail.description.toggle"
                onClick={() => setDescExpanded((v) => !v)}
                className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary font-body font-semibold"
              >
                {descExpanded ? (
                  <>
                    Show less <ChevronUp className="w-3.5 h-3.5" />
                  </>
                ) : (
                  <>
                    Read more <ChevronDown className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Seller Info — with green top border accent */}
        <div>
          <h3 className="font-body font-semibold text-sm text-foreground mb-2">
            Seller
          </h3>
          <div
            className="rounded-2xl overflow-hidden border border-border"
            style={{ borderTop: "3px solid var(--brand-green)" }}
          >
            <SellerInfo
              sellerId={listing.sellerId}
              onSellerClick={onSellerClick}
            />
            <div className="px-4 pb-3 border-t border-border/50">
              <button
                type="button"
                data-ocid="listing_detail.visit_profile.button"
                onClick={() => onSellerClick(listing.sellerId)}
                className="text-xs font-body font-semibold text-primary hover:underline"
              >
                Visit Profile →
              </button>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div>
          <h3 className="font-body font-semibold text-sm text-foreground mb-3">
            Reviews
          </h3>
          <ReviewsList userId={listing.sellerId} />
        </div>

        {/* Review Form (only for non-owners) */}
        {identity && !isOwner && (
          <ReviewForm revieweeId={listing.sellerId} listingId={listing.id} />
        )}
      </div>

      {/* Message Seller CTA — sits above the bottom nav */}
      {!isOwner && (
        <div
          className="fixed left-0 right-0 px-4 py-3 bg-background/97 backdrop-blur-md border-t border-border"
          style={{
            bottom: "calc(env(safe-area-inset-bottom, 0px) + 64px)",
            zIndex: 40,
          }}
        >
          <button
            type="button"
            data-ocid="listing_detail.message_seller.primary_button"
            onClick={() => onMessageSeller(listing.sellerId, listing.id)}
            className="w-full flex flex-col items-center justify-center gap-0.5 py-4 rounded-2xl font-body font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
            style={{
              background: "linear-gradient(135deg, #16a34a 0%, #0d9488 100%)",
            }}
          >
            <span className="flex items-center gap-2 text-base font-bold leading-tight">
              <MessageCircle className="w-6 h-6" />
              Message Seller
            </span>
            <span
              className="text-xs font-normal"
              style={{ color: "rgba(255,255,255,0.75)" }}
            >
              Tap to chat with seller
            </span>
          </button>
        </div>
      )}

      {showReport && (
        <ReportModal
          reportedId={listing.sellerId}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
