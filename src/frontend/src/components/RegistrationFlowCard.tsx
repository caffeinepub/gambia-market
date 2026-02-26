import { Phone, KeyRound, UserCircle, CheckCircle, AlertCircle, Minus } from 'lucide-react';
import { FlowStep } from '../types/blueprint';

const stepIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Phone,
  KeyRound,
  UserCircle,
};

const validationIcon = {
  valid: <CheckCircle className="w-3.5 h-3.5 text-green-600" />,
  invalid: <AlertCircle className="w-3.5 h-3.5 text-red-500" />,
  neutral: <Minus className="w-3.5 h-3.5 text-muted-foreground" />,
};

interface RegistrationFlowCardProps {
  flowSteps: FlowStep[];
}

export default function RegistrationFlowCard({ flowSteps }: RegistrationFlowCardProps) {
  return (
    <div className="mt-5 space-y-3">
      {flowSteps.map((step, idx) => {
        const StepIcon = stepIconMap[step.iconName] || Phone;
        return (
          <div key={step.stepNumber} className="relative">
            {/* Connector line */}
            {idx < flowSteps.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-6 bg-border z-0" />
            )}
            <div className="bg-card border border-border rounded-2xl p-4 shadow-card relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <StepIcon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <span className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide">
                    Step {step.stepNumber}
                  </span>
                  <h4 className="font-heading font-bold text-sm text-foreground leading-tight">{step.stepTitle}</h4>
                </div>
              </div>
              <div className="space-y-2">
                {step.fields.map((field) => (
                  <div key={field.fieldName} className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                    <div className="flex-1">
                      <span className="text-xs font-body text-muted-foreground block leading-none mb-0.5">{field.fieldName}</span>
                      <span className="text-sm font-body text-foreground/70">{field.placeholder}</span>
                    </div>
                    <div className="flex-shrink-0">{validationIcon[field.validationState]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
