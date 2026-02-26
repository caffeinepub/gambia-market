import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { ExternalBlob } from '../backend';

interface PhotoCarouselProps {
  photos: ExternalBlob[];
  title?: string;
}

export default function PhotoCarousel({ photos, title }: PhotoCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!photos || photos.length === 0) {
    return (
      <div className="aspect-[4/3] bg-muted rounded-2xl flex items-center justify-center border border-border">
        <span className="text-5xl opacity-30">📷</span>
      </div>
    );
  }

  const prev = () => setCurrentIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIndex((i) => (i + 1) % photos.length);

  return (
    <>
      <div className="relative aspect-[4/3] bg-muted rounded-2xl overflow-hidden border border-border">
        <img
          src={photos[currentIndex].getDirectURL()}
          alt={`${title ?? 'Photo'} ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />

        {/* Controls */}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-all shadow-card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-all shadow-card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          onClick={() => setIsFullscreen(true)}
          className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-card/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-card transition-all shadow-card"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Dots */}
        {photos.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`rounded-full transition-all duration-200 ${
                  i === currentIndex
                    ? 'w-5 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/75'
                }`}
              />
            ))}
          </div>
        )}

        {/* Counter */}
        {photos.length > 1 && (
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-card/80 backdrop-blur-sm border border-border text-xs font-body font-semibold text-foreground">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-foreground/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-card/20 border border-white/20 flex items-center justify-center text-white hover:bg-card/30 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={photos[currentIndex].getDirectURL()}
            alt={`${title ?? 'Photo'} ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
          {photos.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-card/20 border border-white/20 flex items-center justify-center text-white hover:bg-card/30 transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-card/20 border border-white/20 flex items-center justify-center text-white hover:bg-card/30 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
