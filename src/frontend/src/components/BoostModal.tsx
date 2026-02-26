import React, { useState } from 'react';
import { Zap, X, Check } from 'lucide-react';
import { ListingId } from '../backend';
import { useBoostListing, useBoostOptions } from '../hooks/useQueries';

interface BoostModalProps {
  listingId: ListingId;
  onClose: () => void;
  isOpen?: boolean;
}

export default function BoostModal({ listingId, onClose, isOpen }: BoostModalProps) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const { data: options, isLoading } = useBoostOptions();
  const boostListing = useBoostListing();

  if (isOpen === false) return null;

  const handleBoost = async () => {
    if (selectedOption === null || !options) return;
    const option = options[selectedOption];
    await boostListing.mutateAsync({
      listingId,
      durationDays: option.durationDays,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-modal p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-accent-foreground"
              style={{ background: 'var(--accent)' }}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Boost Listing</h3>
              <p className="text-xs font-body text-muted-foreground">Get more visibility</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-2.5 mb-5">
            {options?.map((option, idx) => {
              const isSelected = selectedOption === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedOption(idx)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-muted/30 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected ? 'border-primary bg-primary' : 'border-border'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                    </div>
                    <div className="text-left">
                      <p className="font-body font-semibold text-sm text-foreground">
                        {Number(option.durationDays)} days
                      </p>
                      <p className="text-xs font-body text-muted-foreground">Featured placement</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-base text-primary">
                    D {Number(option.priceGMD)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleBoost}
          disabled={selectedOption === null || boostListing.isPending}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-body font-semibold text-accent-foreground transition-all duration-200 disabled:opacity-50"
          style={{ background: 'var(--accent)' }}
        >
          <Zap className="w-5 h-5" />
          {boostListing.isPending ? 'Boosting…' : 'Boost Now'}
        </button>
      </div>
    </div>
  );
}
