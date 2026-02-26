import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  readonly?: boolean;
}

export default function StarRating({ value, onChange, size = 'md', readonly = false }: StarRatingProps) {
  const [hovered, setHovered] = React.useState(0);

  const sizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readonly && setHovered(star)}
            onMouseLeave={() => !readonly && setHovered(0)}
            className={`transition-transform duration-100 ${!readonly ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
          >
            <Star
              className={`${sizeClasses[size]} transition-colors duration-150 ${
                filled ? 'fill-current' : 'fill-none'
              }`}
              style={{ color: filled ? 'var(--brand-gold)' : 'var(--muted-foreground)' }}
            />
          </button>
        );
      })}
    </div>
  );
}
