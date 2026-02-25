import { Star, MessageSquare, Flag, UserX, AlertTriangle, ChevronDown } from 'lucide-react';
import { TrustMechanism } from '../types/blueprint';

interface TrustSafetyMockupProps {
  trustMechanisms: TrustMechanism[];
}

export default function TrustSafetyMockup({ trustMechanisms }: TrustSafetyMockupProps) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {trustMechanisms.map((mechanism) => (
        <div key={mechanism.mechanismType} className="bg-card border border-border rounded-2xl p-4 shadow-card flex flex-col gap-3">
          {/* Header */}
          <div className="flex items-center gap-2">
            {mechanism.mechanismType === 'rating' && <Star className="w-5 h-5 text-accent" />}
            {mechanism.mechanismType === 'review' && <MessageSquare className="w-5 h-5 text-primary" />}
            {mechanism.mechanismType === 'report' && <Flag className="w-5 h-5 text-secondary" />}
            {mechanism.mechanismType === 'block' && <UserX className="w-5 h-5 text-destructive" />}
            <h4 className="font-heading font-bold text-sm text-foreground">{mechanism.title}</h4>
          </div>
          <p className="text-xs font-body text-muted-foreground leading-relaxed">{mechanism.description}</p>

          {/* Rating mockup */}
          {mechanism.mechanismType === 'rating' && mechanism.ratingValue !== undefined && (
            <div className="bg-muted/50 rounded-xl p-3 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 cursor-pointer transition-colors ${
                      star <= mechanism.ratingValue! ? 'text-accent fill-accent' : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-body text-muted-foreground">Tap to rate your experience</span>
            </div>
          )}

          {/* Review mockup */}
          {mechanism.mechanismType === 'review' && mechanism.sampleReview && (
            <div className="bg-muted/50 rounded-xl p-3 space-y-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= mechanism.sampleReview!.rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <p className="text-xs font-body text-foreground leading-relaxed italic">"{mechanism.sampleReview.text}"</p>
              <span className="text-xs font-body font-semibold text-muted-foreground">— {mechanism.sampleReview.reviewer}</span>
            </div>
          )}

          {/* Report mockup */}
          {mechanism.mechanismType === 'report' && mechanism.reportReasons && (
            <div className="space-y-2">
              <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center justify-between">
                <span className="text-sm font-body text-muted-foreground">{mechanism.reportReasons[0]}</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex flex-wrap gap-1">
                {mechanism.reportReasons.slice(1, 4).map((reason) => (
                  <span key={reason} className="text-xs font-body px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    {reason}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Block mockup */}
          {mechanism.mechanismType === 'block' && mechanism.confirmationText && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-xs font-body text-foreground leading-relaxed">{mechanism.confirmationText}</p>
              </div>
              <div className="flex gap-2">
                <button className="flex-1 text-xs font-heading font-bold py-1.5 rounded-lg bg-muted border border-border text-muted-foreground">
                  Cancel
                </button>
                <button className="flex-1 text-xs font-heading font-bold py-1.5 rounded-lg bg-destructive text-destructive-foreground">
                  Block User
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
