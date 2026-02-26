import React from 'react';

export default function SkeletonListingCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-card">
      <div className="aspect-[4/3] shimmer" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 rounded-lg shimmer w-full" />
        <div className="h-3 rounded-lg shimmer w-3/4" />
        <div className="flex items-center justify-between mt-1">
          <div className="h-4 rounded-lg shimmer w-20" />
          <div className="h-3.5 rounded-md shimmer w-14" />
        </div>
        <div className="h-3 rounded-md shimmer w-24" />
      </div>
    </div>
  );
}
