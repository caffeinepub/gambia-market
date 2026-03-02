import React from "react";

export default function SkeletonListingCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-md">
      <div className="aspect-square shimmer" />
      <div className="p-2.5 space-y-2">
        <div className="h-3 rounded-lg shimmer w-full" />
        <div className="flex items-center justify-between">
          <div className="h-2.5 rounded-md shimmer w-16" />
          <div className="h-2.5 rounded-md shimmer w-10" />
        </div>
      </div>
    </div>
  );
}
