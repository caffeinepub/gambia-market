import { MapPin, Star } from 'lucide-react';
import type { UserProfile } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

interface SellerInfoProps {
  seller: UserProfile | null | undefined;
  sellerId: Principal;
  onSellerClick?: (userId: Principal) => void;
}

export default function SellerInfo({ seller, sellerId, onSellerClick }: SellerInfoProps) {
  if (!seller) {
    return (
      <div className="flex items-center gap-3 p-3 bg-muted rounded-xl animate-pulse">
        <div className="w-10 h-10 rounded-full bg-muted-foreground/20" />
        <div className="flex-1">
          <div className="h-4 bg-muted-foreground/20 rounded w-24 mb-1" />
          <div className="h-3 bg-muted-foreground/20 rounded w-16" />
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => onSellerClick?.(sellerId)}
      className="w-full flex items-center gap-3 p-3 bg-muted/50 rounded-xl hover:bg-muted transition-colors text-left"
    >
      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
        <span className="font-heading font-bold text-primary text-base">
          {seller.name.charAt(0).toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-heading font-semibold text-foreground text-sm truncate">
            {seller.name}
          </span>
          {seller.verified && (
            <img
              src="/assets/generated/verified-badge.dim_256x256.png"
              alt="Verified"
              className="w-4 h-4 flex-shrink-0"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {seller.location && (
            <div className="flex items-center gap-0.5 text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span className="text-xs font-body truncate">{seller.location}</span>
            </div>
          )}
          {Number(seller.highestRating) > 0 && (
            <div className="flex items-center gap-0.5 text-accent">
              <Star className="w-3 h-3 fill-accent" />
              <span className="text-xs font-body">{Number(seller.highestRating)}/5</span>
            </div>
          )}
        </div>
      </div>
      <span className="text-xs text-muted-foreground font-body">View →</span>
    </button>
  );
}
