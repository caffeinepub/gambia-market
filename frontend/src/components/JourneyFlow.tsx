import {
  Phone, Search, MessageCircle, MapPin, Wallet, Star,
  Smartphone, PlusCircle, Zap, Bell, Truck, UserPlus,
  TrendingUp, BadgeDollarSign
} from 'lucide-react';
import { UserFlow } from '../types/blueprint';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone, Search, MessageCircle, MapPin, Wallet, Star,
  Smartphone, PlusCircle, Zap, Bell, Truck, UserPlus,
  TrendingUp, BadgeDollarSign,
};

interface JourneyFlowProps {
  flow: UserFlow;
}

export default function JourneyFlow({ flow }: JourneyFlowProps) {
  const isGreen = flow.color === 'green';
  const accentClass = isGreen ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground';
  const lineClass = isGreen ? 'bg-primary/30' : 'bg-secondary/30';
  const borderClass = isGreen ? 'border-primary/20 bg-primary/5' : 'border-secondary/20 bg-secondary/5';
  const numClass = isGreen ? 'bg-primary/15 text-primary' : 'bg-secondary/15 text-secondary';

  return (
    <div className={`rounded-2xl border ${borderClass} p-5`}>
      <div className="flex items-center gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-sm font-heading font-bold ${accentClass}`}>
          {flow.title}
        </span>
      </div>
      <div className="flex flex-col gap-0">
        {flow.steps.map((step, index) => {
          const Icon = iconMap[step.icon] || Phone;
          const isLast = index === flow.steps.length - 1;
          return (
            <div key={step.id} className="flex gap-3">
              {/* Left column: number + line */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-heading font-bold ${numClass} flex-shrink-0`}>
                  {step.id}
                </div>
                {!isLast && <div className={`w-0.5 flex-1 min-h-4 ${lineClass} my-1`} />}
              </div>
              {/* Right column: content */}
              <div className={`pb-5 ${isLast ? '' : ''}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <Icon className={`w-4 h-4 ${isGreen ? 'text-primary' : 'text-secondary'}`} />
                  <span className="font-heading font-semibold text-sm text-foreground">{step.label}</span>
                </div>
                <p className="text-muted-foreground text-xs font-body leading-relaxed">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
