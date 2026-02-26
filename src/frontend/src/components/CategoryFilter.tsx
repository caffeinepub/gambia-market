import React from 'react';
import { ListingCategory } from '../backend';

interface CategoryFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories: { id: string | null; label: string; emoji: string }[] = [
  { id: null, label: 'All', emoji: '🌟' },
  { id: ListingCategory.carsAndTrucks, label: 'Cars', emoji: '🚗' },
  { id: ListingCategory.phones, label: 'Phones', emoji: '📱' },
  { id: ListingCategory.electronics, label: 'Electronics', emoji: '💻' },
  { id: ListingCategory.realEstate, label: 'Real Estate', emoji: '🏡' },
  { id: ListingCategory.furniture, label: 'Furniture', emoji: '🛋️' },
  { id: ListingCategory.clothing, label: 'Clothing', emoji: '👕' },
  { id: ListingCategory.motorcycles, label: 'Motorcycles', emoji: '🏍️' },
  { id: ListingCategory.fashion, label: 'Fashion', emoji: '👗' },
  { id: ListingCategory.beauty, label: 'Beauty', emoji: '💄' },
  { id: ListingCategory.services, label: 'Services', emoji: '🛠️' },
  { id: ListingCategory.pets, label: 'Pets', emoji: '🐾' },
  { id: ListingCategory.other, label: 'Other', emoji: '📦' },
];

export default function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-4 scrollbar-hide">
      {categories.map((cat) => {
        const isActive = selectedCategory === cat.id;
        return (
          <button
            key={cat.id ?? 'all'}
            onClick={() => onCategoryChange(cat.id)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-body font-medium transition-all duration-200 border ${
              isActive
                ? 'text-primary-foreground border-transparent shadow-button'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground hover:bg-muted/50'
            }`}
            style={isActive ? { background: 'var(--primary)', borderColor: 'transparent' } : {}}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
