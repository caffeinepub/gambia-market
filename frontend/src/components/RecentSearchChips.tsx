import { X, Clock } from 'lucide-react';

interface RecentSearchChipsProps {
  searches: string[];
  onSelect: (term: string) => void;
  onRemove: (term: string) => void;
  onClear: () => void;
}

export default function RecentSearchChips({ searches, onSelect, onRemove, onClear }: RecentSearchChipsProps) {
  if (searches.length === 0) return null;

  return (
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          <span className="text-xs font-body font-medium">Recent Searches</span>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-muted-foreground hover:text-foreground font-body transition-colors"
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {searches.map((term) => (
          <div
            key={term}
            className="flex items-center gap-1 bg-muted rounded-full pl-3 pr-1.5 py-1 group"
          >
            <button
              onClick={() => onSelect(term)}
              className="text-sm font-body text-foreground hover:text-primary transition-colors"
            >
              {term}
            </button>
            <button
              onClick={() => onRemove(term)}
              className="w-4 h-4 flex items-center justify-center rounded-full hover:bg-muted-foreground/20 transition-colors"
              aria-label={`Remove ${term}`}
            >
              <X className="w-2.5 h-2.5 text-muted-foreground" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
