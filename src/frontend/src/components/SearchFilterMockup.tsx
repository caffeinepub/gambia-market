import { Search, ChevronDown, Check } from 'lucide-react';
import { FilterOptions } from '../types/blueprint';

interface SearchFilterMockupProps {
  filterOptions: FilterOptions;
}

export default function SearchFilterMockup({ filterOptions }: SearchFilterMockupProps) {
  return (
    <div className="mt-5 bg-card border border-border rounded-2xl p-5 shadow-card space-y-4">
      {/* Search bar */}
      <div className="flex items-center gap-3 bg-muted/50 border border-border rounded-xl px-4 py-3">
        <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
        <span className="text-sm font-body text-muted-foreground flex-1">{filterOptions.searchPlaceholder}</span>
        <div className="bg-primary rounded-lg px-3 py-1">
          <span className="text-primary-foreground text-xs font-heading font-bold">Search</span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Category */}
        <div className="space-y-1.5">
          <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Category</label>
          <div className="bg-muted/50 border border-primary/30 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-sm font-body text-foreground">{filterOptions.activeFilters?.category ?? filterOptions.categories[0]}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="flex flex-wrap gap-1">
            {filterOptions.categories.slice(0, 4).map((cat) => (
              <span
                key={cat}
                className={`text-xs font-body px-2 py-0.5 rounded-full border ${cat === filterOptions.activeFilters?.category ? 'bg-primary/10 text-primary border-primary/30' : 'bg-muted text-muted-foreground border-border'}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div className="space-y-1.5">
          <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Price Range (GMD)</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2">
              <span className="text-xs text-muted-foreground block">Min</span>
              <span className="text-sm font-body text-foreground">{filterOptions.priceRange.min.toLocaleString()}</span>
            </div>
            <span className="text-muted-foreground text-sm">–</span>
            <div className="flex-1 bg-muted/50 border border-border rounded-xl px-3 py-2">
              <span className="text-xs text-muted-foreground block">Max</span>
              <span className="text-sm font-body text-foreground">{filterOptions.priceRange.max.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Condition */}
        <div className="space-y-1.5">
          <label className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">Condition</label>
          <div className="space-y-1.5">
            {filterOptions.conditions.map((cond) => {
              const isActive = cond === filterOptions.activeFilters?.condition;
              return (
                <div key={cond} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-primary border-primary' : 'border-border bg-card'}`}>
                    {isActive && <Check className="w-2.5 h-2.5 text-primary-foreground" />}
                  </div>
                  <span className={`text-sm font-body ${isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'}`}>{cond}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
