import { ShoppingBag, TrendingUp } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

interface HeroSectionProps {
  onSellClick: () => void;
  onBrowseClick?: () => void;
  onCategorySelect?: (category: string) => void;
}

const quickCategories = [
  { label: "Electronics", emoji: "💻", key: "electronics" },
  { label: "Clothing", emoji: "👕", key: "clothing" },
  { label: "Vehicles", emoji: "🚗", key: "carsAndTrucks" },
  { label: "Real Estate", emoji: "🏡", key: "realEstate" },
  { label: "Services", emoji: "🛠️", key: "services" },
];

export default function HeroSection({
  onSellClick,
  onBrowseClick,
  onCategorySelect,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl mx-3 mt-3 mb-2">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('/assets/generated/hero-banner.dim_1400x500.png')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-transparent" />

      <div className="relative z-10 px-5 py-12 sm:py-16">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full animate-pulse-badge">
            🇬🇲 Made for Gambia
          </span>
          <span className="bg-white/20 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            Free to list
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight font-display">
          Buy & Sell Anything
          <br />
          <span style={{ color: "var(--brand-gold)" }}>in The Gambia</span>
        </h1>
        <p className="text-white/80 text-sm sm:text-base mb-5 max-w-xs font-body">
          The #1 marketplace for Gambians. Find great deals or sell your items
          fast.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2.5 mb-5">
          <Button
            onClick={onSellClick}
            data-ocid="hero.sell.primary_button"
            className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Start Selling
          </Button>
          {onBrowseClick && (
            <Button
              onClick={onBrowseClick}
              data-ocid="hero.browse.secondary_button"
              variant="outline"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Browse
            </Button>
          )}
        </div>

        {/* Stats row */}
        <div className="flex gap-5 mb-5">
          {[
            { label: "Active Listings", value: "2,400+" },
            { label: "Happy Sellers", value: "800+" },
            { label: "Categories", value: "18" },
          ].map(({ label, value }, i) => (
            <React.Fragment key={label}>
              {i > 0 && <div className="w-px bg-white/20 self-stretch" />}
              <div>
                <div
                  className="font-bold text-base leading-none font-display"
                  style={{ color: "var(--brand-gold)" }}
                >
                  {value}
                </div>
                <div className="text-white/60 text-xs mt-0.5 font-body">
                  {label}
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Quick category pills */}
        {onCategorySelect && (
          <div className="flex flex-wrap gap-2">
            {quickCategories.map(({ label, emoji, key }) => (
              <button
                key={key}
                type="button"
                onClick={() => onCategorySelect(key)}
                className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-body font-medium px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/20 transition-all duration-150 active:scale-95"
              >
                <span>{emoji}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
