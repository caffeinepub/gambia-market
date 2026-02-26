import React, { useEffect, useRef, useState } from 'react';
import { Package, Star, MessageSquare, Users } from 'lucide-react';

interface ProfileStatsRowProps {
  listingCount: number;
  reviewCount: number;
  avgRating: number;
  followerCount: number;
}

function AnimatedCount({ value, decimals = 0 }: { value: number; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const duration = 800;

  useEffect(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(parseFloat((eased * value).toFixed(decimals)));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, decimals]);

  return <span>{decimals > 0 ? display.toFixed(decimals) : Math.round(display)}</span>;
}

export default function ProfileStatsRow({
  listingCount,
  reviewCount,
  avgRating,
  followerCount,
}: ProfileStatsRowProps) {
  const stats = [
    { icon: Package, label: 'Listings', value: listingCount, decimals: 0 },
    { icon: Star, label: 'Rating', value: avgRating, decimals: 1 },
    { icon: MessageSquare, label: 'Reviews', value: reviewCount, decimals: 0 },
    { icon: Users, label: 'Followers', value: followerCount, decimals: 0 },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 bg-card border border-border rounded-xl p-3">
      {stats.map(({ icon: Icon, label, value, decimals }) => (
        <div key={label} className="flex flex-col items-center gap-1">
          <Icon className="w-4 h-4 text-primary" />
          <span className="text-lg font-bold text-foreground leading-none">
            <AnimatedCount value={value} decimals={decimals} />
          </span>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
      ))}
    </div>
  );
}
