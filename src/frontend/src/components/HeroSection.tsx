import React from 'react';
import { Button } from './ui/button';
import { ShoppingBag, TrendingUp } from 'lucide-react';

interface HeroSectionProps {
  onSellClick: () => void;
  onBrowseClick?: () => void;
}

export default function HeroSection({ onSellClick, onBrowseClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-2">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />

      <div className="relative z-10 px-6 py-10 sm:py-14">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
            🇬🇲 Made for Gambia
          </span>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            Free to list
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          Buy & Sell Anything<br />
          <span className="text-primary">in The Gambia</span>
        </h1>
        <p className="text-white/80 text-sm sm:text-base mb-6 max-w-xs">
          The #1 marketplace for Gambians. Find great deals or sell your items fast.
        </p>

        <div className="flex flex-wrap gap-3">
          <Button
            onClick={onSellClick}
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Start Selling
          </Button>
          {onBrowseClick && (
            <Button
              onClick={onBrowseClick}
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse Listings
            </Button>
          )}
        </div>

        <div className="flex gap-6 mt-6">
          {[
            { label: 'Active Listings', value: '2,400+' },
            { label: 'Happy Sellers', value: '800+' },
            { label: 'Categories', value: '18' },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <div className="text-white font-bold text-lg leading-none">{value}</div>
              <div className="text-white/60 text-xs mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
