import { Smartphone, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { PaymentMethod, TransactionState } from '../types/blueprint';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Smartphone,
  CreditCard,
  Banknote,
};

interface PaymentMethodsMockupProps {
  paymentMethods: PaymentMethod[];
  transactionStates: TransactionState[];
}

export default function PaymentMethodsMockup({ paymentMethods, transactionStates }: PaymentMethodsMockupProps) {
  return (
    <div className="mt-5 space-y-4">
      {/* Illustration */}
      <div className="rounded-2xl overflow-hidden border border-border shadow-card">
        <img
          src="/assets/generated/payment-methods-illustration.dim_600x400.png"
          alt="Payment Methods Illustration"
          className="w-full object-cover max-h-48"
        />
      </div>

      {/* Payment method cards */}
      <div className="space-y-2">
        <h4 className="font-heading font-bold text-sm text-foreground">Select Payment Method</h4>
        {paymentMethods.map((method, idx) => {
          const MethodIcon = iconMap[method.iconName] || Smartphone;
          const isSelected = idx === 0;
          return (
            <div
              key={method.methodName}
              className={`flex items-center gap-3 bg-card border rounded-xl p-3 transition-all ${
                isSelected ? 'border-primary/40 shadow-card' : 'border-border'
              }`}
            >
              {/* Radio */}
              <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${isSelected ? 'border-primary' : 'border-muted-foreground'}`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
              </div>

              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${method.badgeColor.split(' ')[0]}`}>
                <MethodIcon className={`w-5 h-5 ${method.badgeColor.split(' ')[1]}`} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-heading font-bold text-sm text-foreground">{method.methodName}</span>
                  <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${method.badgeColor}`}>
                    {method.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                <p className="text-xs font-body text-muted-foreground leading-tight">{method.description}</p>
              </div>

              {isSelected && <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />}
            </div>
          );
        })}
      </div>

      {/* Transaction status badges */}
      <div>
        <h4 className="font-heading font-bold text-sm text-foreground mb-2">Transaction Status</h4>
        <div className="flex flex-wrap gap-2">
          {transactionStates.map((state) => (
            <span
              key={state.status}
              className={`text-xs font-body font-semibold px-3 py-1.5 rounded-full border ${state.color}`}
            >
              {state.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
