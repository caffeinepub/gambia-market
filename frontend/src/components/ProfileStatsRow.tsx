import { useEffect, useState } from 'react';
import { ShoppingBag, Star, MessageCircle } from 'lucide-react';

interface ProfileStatsRowProps {
  listingCount: number;
  reviewCount: number;
  avgRating: number;
}

function useCountUp(target: number, duration = 800): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target === 0) { setValue(0); return; }
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.round(progress * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

export default function ProfileStatsRow({ listingCount, reviewCount, avgRating }: ProfileStatsRowProps) {
  const animatedListings = useCountUp(listingCount);
  const animatedReviews = useCountUp(reviewCount);
  const animatedRating = useCountUp(Math.round(avgRating * 10)) / 10;

  const stats = [
    { icon: ShoppingBag, label: 'Listings', value: animatedListings.toString() },
    { icon: Star, label: 'Avg Rating', value: avgRating > 0 ? animatedRating.toFixed(1) : '—' },
    { icon: MessageCircle, label: 'Reviews', value: animatedReviews.toString() },
  ];

  return (
    <div className="flex items-stretch gap-0 bg-muted/50 rounded-xl overflow-hidden border border-border">
      {stats.map(({ icon: Icon, label, value }, i) => (
        <div
          key={label}
          className={`flex-1 flex flex-col items-center justify-center py-3 px-2 ${
            i < stats.length - 1 ? 'border-r border-border' : ''
          }`}
        >
          <Icon className="w-4 h-4 text-primary mb-1" />
          <span className="font-heading font-black text-lg text-foreground leading-none">{value}</span>
          <span className="text-[10px] font-body text-muted-foreground mt-0.5">{label}</span>
        </div>
      ))}
    </div>
  );
}
