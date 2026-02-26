import React, { useEffect, useState } from 'react';
import { ShoppingBag, Star, MessageSquare, Users } from 'lucide-react';

interface ProfileStatsRowProps {
  listingCount: number;
  reviewCount: number;
  avgRating: number;
  followerCount?: number;
}

function AnimatedCount({ target, duration = 800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, duration]);

  return <span>{count}</span>;
}

export default function ProfileStatsRow({ listingCount, reviewCount, avgRating, followerCount = 0 }: ProfileStatsRowProps) {
  const stats = [
    { icon: <ShoppingBag className="w-4 h-4" />, value: listingCount, label: 'Listings', isRating: false },
    { icon: <Star className="w-4 h-4" />, value: avgRating, label: 'Avg Rating', isRating: true },
    { icon: <MessageSquare className="w-4 h-4" />, value: reviewCount, label: 'Reviews', isRating: false },
    { icon: <Users className="w-4 h-4" />, value: followerCount, label: 'Followers', isRating: false },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 px-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-card rounded-2xl border border-border p-3 text-center shadow-card"
        >
          <div className="w-8 h-8 rounded-xl mx-auto mb-2 flex items-center justify-center"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            {stat.icon}
          </div>
          <div className="font-display font-bold text-lg text-foreground leading-none mb-0.5">
            {stat.isRating
              ? stat.value > 0 ? stat.value.toFixed(1) : '—'
              : <AnimatedCount target={stat.value} />
            }
          </div>
          <div className="text-[10px] font-body text-muted-foreground leading-none">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
