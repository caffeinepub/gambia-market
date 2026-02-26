import React, { useState } from 'react';
import { ArrowLeft, Share2, Flag, MessageCircle, Heart, MapPin, Tag, Calendar } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { ListingId } from '../backend';
import { useListing, useGetUserProfile } from '../hooks/useQueries';
import PhotoCarousel from '../components/PhotoCarousel';
import SellerInfo from '../components/SellerInfo';
import ReviewsList from '../components/ReviewsList';
import ReviewForm from '../components/ReviewForm';
import ReportModal from '../components/ReportModal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface ListingDetailProps {
  listingId: ListingId;
  onBack: () => void;
  onMessageSeller: (sellerId: Principal, listingId: ListingId) => void;
  onSellerClick: (userId: Principal) => void;
}

export default function ListingDetail({ listingId, onBack, onMessageSeller, onSellerClick }: ListingDetailProps) {
  const [showReport, setShowReport] = useState(false);
  const { data: listing, isLoading } = useListing(listingId);
  const { identity } = useInternetIdentity();

  const timeAgo = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const diff = Date.now() - ms;
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 30) return `${days}d ago`;
    return new Date(ms).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-14 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
          <button type="button" onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="aspect-[4/3] rounded-2xl bg-muted animate-pulse" />
          <div className="space-y-3">
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
          <button type="button" onClick={onBack} className="mt-4 text-primary font-body font-medium">Go back</button>
        </div>
      </div>
    );
  }

  const isOwner = identity && listing.sellerId.toString() === identity.getPrincipal().toString();

  return (
    <div className="min-h-screen bg-background" style={{ paddingBottom: 'calc(80px + 80px + 24px)' }}>
      {/* Header */}
      <div className="sticky top-14 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowReport(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-all"
          >
            <Flag className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Photos */}
      <div className="px-4 pt-3">
        <PhotoCarousel photos={listing.photos} />
      </div>

      {/* Content */}
      <div className="px-4 pt-4 space-y-4">
        {/* Title & Price */}
        <div>
          <h1 className="font-display font-bold text-xl text-foreground mb-1">{listing.title}</h1>
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-2xl text-primary">
              D {Number(listing.price).toLocaleString()}
            </span>
            {listing.isBoosted && (
              <span className="px-2 py-0.5 rounded-lg text-xs font-body font-bold text-accent-foreground"
                style={{ background: 'var(--accent)' }}>
                ⚡ Boosted
              </span>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-sm font-body text-muted-foreground">
          <span className="flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            {listing.condition}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {timeAgo(listing.createdAt)}
          </span>
        </div>

        {/* Real Estate details */}
        {listing.category === 'realEstate' && (
          <div className="flex flex-wrap gap-3 p-3 bg-muted/50 rounded-xl text-sm font-body">
            {listing.numBedrooms !== undefined && listing.numBedrooms !== null && (
              <span>🛏 {Number(listing.numBedrooms)} bedrooms</span>
            )}
            {listing.propertySize !== undefined && listing.propertySize !== null && (
              <span>📐 {Number(listing.propertySize)} m²</span>
            )}
            {listing.isFurnished !== undefined && listing.isFurnished !== null && (
              <span>{listing.isFurnished ? '✅ Furnished' : '❌ Unfurnished'}</span>
            )}
          </div>
        )}

        {/* Description */}
        {listing.description && (
          <div>
            <h3 className="font-body font-semibold text-sm text-foreground mb-2">Description</h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {listing.description}
            </p>
          </div>
        )}

        {/* Seller Info */}
        <SellerInfo
          sellerId={listing.sellerId}
          onSellerClick={onSellerClick}
        />

        {/* Reviews */}
        <div>
          <h3 className="font-body font-semibold text-sm text-foreground mb-3">Reviews</h3>
          <ReviewsList userId={listing.sellerId} />
        </div>

        {/* Review Form (only for non-owners) */}
        {identity && !isOwner && (
          <ReviewForm
            revieweeId={listing.sellerId}
            listingId={listing.id}
          />
        )}
      </div>

      {/* Message Seller CTA — sits above the bottom nav */}
      {!isOwner && (
        <div
          className="fixed left-0 right-0 px-4 py-3 bg-background/97 backdrop-blur-md border-t border-border"
          style={{ bottom: '80px', zIndex: 40 }}
        >
          <button
            type="button"
            onClick={() => onMessageSeller(listing.sellerId, listing.id)}
            className="w-full flex flex-col items-center justify-center gap-0.5 py-4 rounded-2xl font-body font-bold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] animate-pulse-glow"
            style={{
              background: 'linear-gradient(135deg, #16a34a 0%, #0d9488 100%)',
            }}
          >
            <span className="flex items-center gap-2 text-base font-bold leading-tight">
              <MessageCircle className="w-6 h-6" />
              Message Seller
            </span>
            <span className="text-xs font-normal" style={{ color: 'rgba(255,255,255,0.75)' }}>
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
