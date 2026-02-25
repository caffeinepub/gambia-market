import type { PublicListing } from '../backend';

const DEFAULT_CATEGORIES = [
  'Electronics', 'Clothing', 'Food', 'Vehicles',
  'Services', 'Furniture', 'Agriculture', 'Other',
];

const CATEGORY_ICONS: Record<string, string> = {
  All: '🏪', Electronics: '📱', Clothing: '👗', Food: '🥘',
  Vehicles: '🚗', Services: '🔧', Furniture: '🛋️', Agriculture: '🌾', Other: '📦',
};

interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
  categories?: string[];
  listings?: PublicListing[];
}

export default function CategoryFilter({ selected, onSelect, categories, listings }: CategoryFilterProps) {
  const allCategories = ['All', ...(categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES)];

  const getCount = (cat: string): number => {
    if (!listings) return 0;
    if (cat === 'All') return listings.length;
    return listings.filter((l) => l.category === cat).length;
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-2 px-4 py-2 min-w-max">
        {allCategories.map((cat) => {
          const isActive = selected === cat;
          const count = getCount(cat);
          return (
            <button
              key={cat}
              onClick={() => onSelect(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium font-body whitespace-nowrap transition-all min-h-[36px] ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
            >
              <span>{CATEGORY_ICONS[cat] || '📦'}</span>
              <span>{cat}</span>
              {listings && count > 0 && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center ${
                  isActive ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-foreground/10 text-foreground/60'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
