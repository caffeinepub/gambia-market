import { Search } from 'lucide-react';

const CATEGORY_ICONS: Record<string, string> = {
  Electronics: '📱', Clothing: '👗', Food: '🥘', Vehicles: '🚗',
  Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
};

const SUGGESTED_CATEGORIES = ['Electronics', 'Clothing', 'Food', 'Vehicles', 'Services', 'Furniture'];

interface ZeroResultsStateProps {
  searchTerm: string;
  onCategoryClick: (category: string) => void;
}

export default function ZeroResultsState({ searchTerm, onCategoryClick }: ZeroResultsStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
        <Search className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-heading font-bold text-lg text-foreground mb-1">
        No results for "{searchTerm}"
      </h3>
      <p className="font-body text-sm text-muted-foreground mb-6 max-w-xs">
        Try a different search term or browse by category below.
      </p>

      <div className="w-full max-w-xs">
        <p className="font-body text-xs text-muted-foreground uppercase tracking-wide mb-3">
          Browse Categories
        </p>
        <div className="grid grid-cols-3 gap-2">
          {SUGGESTED_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryClick(cat)}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-muted hover:bg-primary/10 hover:text-primary transition-all"
            >
              <span className="text-xl">{CATEGORY_ICONS[cat]}</span>
              <span className="text-[11px] font-body font-medium text-foreground">{cat}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
