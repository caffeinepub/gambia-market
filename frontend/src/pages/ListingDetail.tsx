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
        <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center">
          <button onClick={onBack} className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="aspect-[4/3] rounded-2xl shimmer" />
          <div className="space-y-3">
            <div className="h-6 rounded-xl shimmer w-3/4" />
            <div className="h-8 rounded-xl shimmer w-1/3" />
            <div className="h-4 rounded-lg shimmer w-1/2" />
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
          <button onClick={onBack} className="mt-4 text-primary font-body font-medium">Go back</button>
        </div>
      </div>
    );
  }

  const isOwner = identity && listing.sellerId.toString() === identity.getPrincipal().toString();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReport(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
          >
            <Flag className="w-4.5 h-4.5" />
          </button>
          <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <Share2 className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Photos */}
        <PhotoCarousel photos={listing.photos} title={listing.title} />

        {/* Title & Price */}
        <div>
          <h1 className="font-display font-bold text-xl text-foreground mb-2 leading-tight">
            {listing.title}
          </h1>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className="font-display font-bold text-3xl" style={{ color: 'var(--brand-coral)' }}>
              D {Number(listing.price).toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted border border-border text-sm font-body font-medium text-foreground">
                <Tag className="w-3.5 h-3.5" />
                {listing.condition}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-sm font-body font-semibold border ${
                listing.status === 'Active'
                  ? 'text-success bg-success/10 border-success/20'
                  : 'text-muted-foreground bg-muted border-border'
              }`}>
                {listing.status}
              </span>
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-sm font-body text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {listing.location}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {timeAgo(listing.createdAt)}
          </span>
        </div>

        {/* Description */}
        <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
          <h2 className="font-display font-bold text-base text-foreground mb-2">Description</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {listing.description}
          </p>
        </div>

        {/* Real estate details */}
        {listing.category === 'realEstate' && (
          <div className="bg-card rounded-2xl border border-border p-4 shadow-card">
            <h2 className="font-display font-bold text-base text-foreground mb-3">Property Details</h2>
            <div className="grid grid-cols-2 gap-3">
              {listing.propertySize != null && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs font-body text-muted-foreground mb-0.5">Size</p>
                  <p className="font-body font-semibold text-sm text-foreground">{Number(listing.propertySize)} m²</p>
                </div>
              )}
              {listing.numBedrooms != null && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs font-body text-muted-foreground mb-0.5">Bedrooms</p>
                  <p className="font-body font-semibold text-sm text-foreground">{Number(listing.numBedrooms)}</p>
                </div>
              )}
              {listing.isFurnished != null && (
                <div className="bg-muted rounded-xl p-3">
                  <p className="text-xs font-body text-muted-foreground mb-0.5">Furnished</p>
                  <p className="font-body font-semibold text-sm text-foreground">{listing.isFurnished ? 'Yes' : 'No'}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Seller info */}
        <SellerInfo sellerId={listing.sellerId} onSellerClick={onSellerClick} />

        {/* Reviews */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-5 rounded-full" style={{ background: 'var(--brand-gold)' }} />
            <h2 className="font-display font-bold text-base text-foreground">Reviews</h2>
          </div>
          <ReviewsList userId={listing.sellerId} />
        </div>

        {/* Review form */}
        {identity && !isOwner && (
          <ReviewForm revieweeId={listing.sellerId} listingId={listing.id} />
        )}
      </div>

      {/* Bottom CTA */}
      {!isOwner && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border p-4 safe-area-pb">
          <button
            onClick={() => onMessageSeller(listing.sellerId, listing.id)}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-body font-semibold text-primary-foreground transition-all duration-200 shadow-button"
            style={{ background: 'var(--primary)' }}
          >
            <MessageCircle className="w-5 h-5" />
            Message Seller
          </button>
        </div>
      )}

      {/* Report modal */}
      {showReport && (
        <ReportModal
          reportedId={listing.sellerId}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}
