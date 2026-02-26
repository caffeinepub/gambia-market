import React from 'react';
import { MapPin, TrendingUp, Users, ShoppingBag } from 'lucide-react';

interface HeroSectionProps {
  onSellClick?: () => void;
  onBrowseClick?: () => void;
}

export default function HeroSection({ onSellClick, onBrowseClick }: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-4 mt-4 mb-2">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/hero-banner.dim_1400x500.png"
          alt="Gambia Market"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, oklch(0.18 0.12 270 / 0.88) 0%, oklch(0.28 0.1 280 / 0.75) 50%, oklch(0.38 0.08 295 / 0.55) 100%)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-12">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body"
            style={{ background: 'oklch(0.78 0.16 75 / 0.25)', color: 'oklch(0.92 0.12 75)', border: '1px solid oklch(0.78 0.16 75 / 0.4)' }}>
            <MapPin className="w-3 h-3" />
            The Gambia
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold font-body"
            style={{ background: 'oklch(0.62 0.19 38 / 0.25)', color: 'oklch(0.92 0.1 38)', border: '1px solid oklch(0.62 0.19 38 / 0.4)' }}>
            <TrendingUp className="w-3 h-3" />
            #1 Marketplace
          </span>
        </div>

        <h1 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight mb-3">
          Buy & Sell Anything<br />
          <span style={{ color: 'oklch(0.88 0.14 75)' }}>Across The Gambia</span>
        </h1>

        <p className="text-white/75 font-body text-sm sm:text-base mb-6 max-w-md">
          The trusted marketplace for Gambians. Find great deals on electronics, vehicles, real estate, and more.
        </p>

        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={onBrowseClick}
            className="px-6 py-2.5 rounded-xl font-body font-semibold text-sm text-white border border-white/30 hover:bg-white/15 transition-all duration-200 backdrop-blur-sm"
          >
            Browse Listings
          </button>
          <button
            onClick={onSellClick}
            className="px-6 py-2.5 rounded-xl font-body font-semibold text-sm transition-all duration-200 shadow-button-accent"
            style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
          >
            Start Selling
          </button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 sm:gap-6">
          {[
            { icon: <ShoppingBag className="w-4 h-4" />, value: '10K+', label: 'Listings' },
            { icon: <Users className="w-4 h-4" />, value: '5K+', label: 'Sellers' },
            { icon: <MapPin className="w-4 h-4" />, value: '7', label: 'Regions' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'oklch(1 0 0 / 0.15)' }}>
                <span style={{ color: 'oklch(0.88 0.14 75)' }}>{stat.icon}</span>
              </div>
              <div>
                <div className="font-display font-bold text-white text-sm leading-none">{stat.value}</div>
                <div className="text-white/60 text-xs font-body leading-none mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
