import {
  Camera, Tag, DollarSign, CheckCircle, MapPin,
  Upload, ChevronDown
} from 'lucide-react';
import { CreationStep } from '../types/blueprint';

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Camera, Tag, DollarSign, CheckCircle, MapPin,
};

interface ListingCreationCardProps {
  creationSteps: CreationStep[];
}

export default function ListingCreationCard({ creationSteps }: ListingCreationCardProps) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {creationSteps.map((step) => {
        const StepIcon = stepIconMap[step.iconName] || Camera;
        return (
          <div key={step.stepNumber} className="bg-card border border-border rounded-2xl p-4 shadow-card flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0">
                <StepIcon className="w-4 h-4 text-accent-foreground" />
              </div>
              <div>
                <span className="text-xs font-body text-muted-foreground">Step {step.stepNumber}</span>
                <h4 className="font-heading font-bold text-sm text-foreground leading-tight">{step.stepTitle}</h4>
              </div>
            </div>

            {/* Field mockup */}
            <div className="flex-1">
              {step.fieldType === 'upload' && (
                <div className="border-2 border-dashed border-border rounded-xl p-3 flex flex-col items-center gap-1 bg-muted/30">
                  <Upload className="w-5 h-5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center">Tap to upload photos</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-7 h-7 rounded-md bg-muted border border-border" />
                    ))}
                    <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
                      <span className="text-primary text-xs font-bold">+</span>
                    </div>
                  </div>
                </div>
              )}
              {step.fieldType === 'dropdown' && (
                <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{step.options?.[0] ?? 'Select…'}</span>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </div>
              )}
              {step.fieldType === 'number' && (
                <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">GMD</span>
                  <span className="text-sm text-muted-foreground">0.00</span>
                </div>
              )}
              {step.fieldType === 'radio' && (
                <div className="space-y-1.5">
                  {step.options?.slice(0, 3).map((opt, i) => (
                    <div key={opt} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-body ${i === 0 ? 'border-primary/40 bg-primary/5 text-primary' : 'border-border bg-muted/30 text-muted-foreground'}`}>
                      <div className={`w-3 h-3 rounded-full border-2 flex-shrink-0 ${i === 0 ? 'border-primary bg-primary' : 'border-muted-foreground'}`} />
                      {opt}
                    </div>
                  ))}
                </div>
              )}
              {step.fieldType === 'location' && (
                <div className="bg-muted/50 border border-border rounded-xl px-3 py-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">{step.options?.[0] ?? 'Select region…'}</span>
                </div>
              )}
            </div>

            <p className="text-xs font-body text-muted-foreground leading-relaxed">{step.hint}</p>
          </div>
        );
      })}
    </div>
  );
}
