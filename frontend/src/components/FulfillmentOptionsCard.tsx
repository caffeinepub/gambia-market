import { Truck, Handshake, MapPin, Clock, Package } from 'lucide-react';
import { FulfillmentOption } from '../types/blueprint';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Truck,
  Handshake,
  MapPin,
  Clock,
  Package,
};

interface FulfillmentOptionsCardProps {
  fulfillmentOptions: FulfillmentOption[];
}

export default function FulfillmentOptionsCard({ fulfillmentOptions }: FulfillmentOptionsCardProps) {
  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {fulfillmentOptions.map((option) => {
        const OptionIcon = iconMap[option.iconName] || Truck;
        const isDelivery = option.type === 'delivery';
        return (
          <div
            key={option.type}
            className={`bg-card border rounded-2xl p-5 shadow-card flex flex-col gap-4 ${
              isDelivery ? 'border-primary/30' : 'border-secondary/30'
            }`}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDelivery ? 'bg-primary/10' : 'bg-secondary/10'}`}>
                <OptionIcon className={`w-6 h-6 ${isDelivery ? 'text-primary' : 'text-secondary'}`} />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-foreground">{option.title}</h4>
                <span className={`text-xs font-body font-semibold px-2 py-0.5 rounded-full ${isDelivery ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
                  {isDelivery ? 'Delivery' : 'Meet-Up'}
                </span>
              </div>
            </div>

            <p className="text-sm font-body text-muted-foreground leading-relaxed">{option.description}</p>

            {/* Sample fields */}
            <div className="space-y-2">
              {option.sampleFields.map((field) => (
                <div key={field.label} className="bg-muted/50 border border-border rounded-xl px-3 py-2">
                  <span className="text-xs font-body text-muted-foreground block mb-0.5">{field.label}</span>
                  <span className="text-sm font-body text-foreground/70">{field.placeholder}</span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
