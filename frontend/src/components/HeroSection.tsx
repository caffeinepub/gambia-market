import { Badge } from '@/components/ui/badge';

const audiences = [
  'Everyday Gambians',
  'Small Businesses',
  'Market Sellers',
  'Youth Entrepreneurs',
];

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: '340px' }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/assets/generated/hero-banner.dim_1400x500.png')" }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/85 via-brand-dark/70 to-brand-green/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-start justify-center px-6 py-14 md:px-12 md:py-20 max-w-4xl mx-auto">
        {/* App name */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-brand-dark font-heading font-black text-lg">G</span>
          </div>
          <h1 className="font-heading font-black text-3xl md:text-5xl text-white tracking-tight leading-none">
            Gambia Market
          </h1>
        </div>

        {/* Kente accent line */}
        <div className="kente-pattern w-32 mb-4 rounded-full" />

        {/* Tagline */}
        <p className="text-white/90 text-lg md:text-2xl font-heading font-semibold mb-2 leading-snug max-w-xl">
          Buy & Sell Locally in The Gambia
        </p>
        <p className="text-brand-gold text-base md:text-lg font-body font-medium mb-6">
          Simple. Safe. Fast.
        </p>

        {/* Audience badges */}
        <div className="flex flex-wrap gap-2">
          {audiences.map((audience) => (
            <span
              key={audience}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs md:text-sm font-body font-semibold bg-white/15 text-white border border-white/30 backdrop-blur-sm"
            >
              {audience}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-6 mt-8">
          {[
            { label: 'Target Users', value: '2M+' },
            { label: 'Gambian Cities', value: '7' },
            { label: 'Categories', value: '6+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="font-heading font-black text-2xl text-brand-gold">{stat.value}</div>
              <div className="text-white/70 text-xs font-body">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
