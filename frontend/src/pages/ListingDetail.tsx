import { useState } from 'react';
import { ArrowLeft, MessageCircle, Flag, Share2 } from 'lucide-react';
import { useListing, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import PhotoCarousel from '../components/PhotoCarousel';
import SellerInfo from '../components/SellerInfo';
import ReportModal from '../components/ReportModal';
import ReviewForm from '../components/ReviewForm';
import ReviewsList from '../components/ReviewsList';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import type { ListingId } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';
import PatternDivider from '../components/PatternDivider';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '📱', Clothing: '👗', Food: '🥘', Vehicles: '🚗',
  Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
};

interface ListingDetailProps {
  listingId: ListingId;
  onBack: () => void;
  onMessageSeller: (listingId: ListingId, sellerId: Principal, sellerName: string) => void;
  onSellerClick: (userId: Principal) => void;
}

export default function ListingDetail({ listingId, onBack, onMessageSeller, onSellerClick }: ListingDetailProps) {
  const { data: listing, isLoading } = useListing(listingId);
  const { data: seller } = useGetUserProfile(listing?.sellerId?.toString() ?? '');
  const { identity } = useInternetIdentity();
  const [showReport, setShowReport] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isAuthenticated = !!identity;
  const isOwnListing = identity && listing && listing.sellerId.toString() === identity.getPrincipal().toString();

  const handleMessageSeller = () => {
    if (!listing) return;
    const sellerName = seller?.name ?? 'Seller';
    onMessageSeller(listing.id, listing.sellerId, sellerName);
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // ignore
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-border">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
        <Skeleton className="aspect-square w-full" />
        <div className="p-4 flex flex-col gap-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <p className="font-heading font-semibold text-foreground mb-2">Listing not found</p>
        <Button onClick={onBack} variant="outline">Go Back</Button>
      </div>
    );
  }

  const categoryIcon = CATEGORY_ICONS[listing.category] || '📦';

  return (
    <div className="flex flex-col pb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-14 bg-card z-10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-body font-medium text-sm">Back</span>
        </button>
        <div className="flex items-center gap-1">
          <button
            onClick={handleShare}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Share listing"
          >
            <Share2 className="w-4 h-4 text-muted-foreground" />
          </button>
          {isAuthenticated && !isOwnListing && (
            <button
              onClick={() => setShowReport(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
              aria-label="Report listing"
            >
              <Flag className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>

      {/* Photos */}
      <PhotoCarousel
        photos={listing.photos}
        categoryIcon={categoryIcon}
        alt={listing.title}
      />

      {/* Details */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h1 className="font-heading font-bold text-xl text-foreground leading-tight flex-1">
            {listing.title}
          </h1>
          {listing.isBoosted && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 flex-shrink-0">
              ⚡ Featured
            </Badge>
          )}
        </div>

        <p className="font-heading font-black text-3xl text-primary mb-3">
          D {Number(listing.price).toLocaleString()}
        </p>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="font-body text-xs">
            {categoryIcon} {listing.category}
          </Badge>
          <Badge variant="outline" className="font-body text-xs">
            {listing.condition}
          </Badge>
          <Badge variant="outline" className="font-body text-xs">
            📍 {listing.location}
          </Badge>
        </div>

        {listing.description && (
          <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
            {listing.description}
          </p>
        )}
      </div>

      <PatternDivider thin className="mx-4" />

      {/* Seller info */}
      <div className="px-4 py-4">
        <h2 className="font-heading font-bold text-sm text-foreground mb-3">Seller</h2>
        <SellerInfo
          seller={seller}
          sellerId={listing.sellerId}
          onSellerClick={onSellerClick}
        />
      </div>

      {/* Action buttons */}
      {!isOwnListing && (
        <div className="px-4 pb-4">
          <Button
            onClick={handleMessageSeller}
            className="w-full text-base font-bold gap-2 rounded-xl h-14"
          >
            <MessageCircle className="w-5 h-5" />
            Message Seller
          </Button>
          {!isAuthenticated && (
            <p className="text-center text-xs text-muted-foreground font-body mt-2">
              You can message as a guest — no login required
            </p>
          )}
        </div>
      )}

      <PatternDivider thin className="mx-4" />

      {/* Reviews */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-heading font-bold text-sm text-foreground">Reviews</h2>
          {isAuthenticated && !isOwnListing && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-xs text-primary font-body hover:underline"
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && (
          <div className="mb-4">
            <ReviewForm
              listingId={listing.id}
              revieweeId={listing.sellerId}
              onSuccess={() => setShowReviewForm(false)}
            />
          </div>
        )}

        <ReviewsList userId={listing.sellerId} />
      </div>

      {/* Report modal */}
      {isAuthenticated && !isOwnListing && (
        <ReportModal
          open={showReport}
          onClose={() => setShowReport(false)}
          reportedId={listing.sellerId}
        />
      )}
    </div>
  );
}
