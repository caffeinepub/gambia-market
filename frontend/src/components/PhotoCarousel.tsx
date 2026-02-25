import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import type { ExternalBlob } from '../backend';

interface PhotoCarouselProps {
  photos: ExternalBlob[];
  categoryIcon?: string;
  alt?: string;
}

export default function PhotoCarousel({ photos, categoryIcon = '📦', alt = 'Listing photo' }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  if (photos.length === 0) {
    return (
      <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-xl">
        <span className="text-6xl">{categoryIcon}</span>
      </div>
    );
  }

  const prev = () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIndex((i) => (i + 1) % photos.length);

  return (
    <>
      <div className="relative w-full aspect-square bg-muted rounded-xl overflow-hidden">
        <img
          src={photos[currentIndex].getDirectURL()}
          alt={`${alt} ${currentIndex + 1}`}
          className="w-full h-full object-cover cursor-pointer"
          onClick={() => setFullscreen(true)}
        />

        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
          onClick={() => setFullscreen(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center"
            onClick={() => setFullscreen(false)}
            aria-label="Close fullscreen"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={photos[currentIndex].getDirectURL()}
            alt={`${alt} ${currentIndex + 1} fullscreen`}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
