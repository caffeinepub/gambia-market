import { CheckCircle, Clock, Circle, Star, ShieldCheck } from 'lucide-react';
import { VerificationStep, SellerProfile } from '../types/blueprint';

const statusConfig = {
  complete: { icon: CheckCircle, color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/30', label: 'Complete' },
  'in-progress': { icon: Clock, color: 'text-accent-foreground', bg: 'bg-accent/20', border: 'border-accent/30', label: 'In Progress' },
  pending: { icon: Circle, color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border', label: 'Pending' },
};

interface VerifiedBadgeMockupProps {
  verificationProcess: VerificationStep[];
  sampleProfile: SellerProfile;
}

export default function VerifiedBadgeMockup({ verificationProcess, sampleProfile }: VerifiedBadgeMockupProps) {
  return (
    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Verification process stepper */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h4 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Verification Process
        </h4>
        <div className="space-y-3">
          {verificationProcess.map((step, idx) => {
            const cfg = statusConfig[step.status];
            const StatusIcon = cfg.icon;
            return (
              <div key={step.stepNumber} className="relative flex gap-3">
                {idx < verificationProcess.length - 1 && (
                  <div className="absolute left-4 top-9 w-0.5 h-6 bg-border" />
                )}
                <div className={`w-8 h-8 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center flex-shrink-0 z-10`}>
                  <StatusIcon className={`w-4 h-4 ${cfg.color}`} />
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-heading font-bold text-sm text-foreground">{step.title}</span>
                    <span className={`text-xs font-body px-1.5 py-0.5 rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                      {cfg.label}
                    </span>
                  </div>
                  <p className="text-xs font-body text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sample seller profile card */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-card">
        <h4 className="font-heading font-bold text-sm text-foreground mb-4 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Verified Seller Profile
        </h4>
        <div className="flex flex-col items-center text-center gap-3">
          {/* Avatar */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
              <span className="font-heading font-black text-2xl text-primary">
                {sampleProfile.name.charAt(0)}
              </span>
            </div>
            {sampleProfile.verified && (
              <div className="absolute -bottom-1 -right-1">
                <img
                  src={sampleProfile.badgeImage}
                  alt="Verified Badge"
                  className="w-7 h-7 object-contain drop-shadow-sm"
                />
              </div>
            )}
          </div>

          {/* Name + badge */}
          <div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="font-heading font-bold text-base text-foreground">{sampleProfile.name}</span>
              {sampleProfile.verified && (
                <img src={sampleProfile.badgeImage} alt="Verified" className="w-5 h-5 object-contain" />
              )}
            </div>
            <span className="text-xs font-body text-muted-foreground">Member since {sampleProfile.memberSince}</span>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-4 h-4 ${star <= Math.floor(sampleProfile.rating) ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
              />
            ))}
            <span className="text-sm font-heading font-bold text-foreground ml-1">{sampleProfile.rating}</span>
          </div>

          <div className="bg-muted/50 rounded-xl px-4 py-2 w-full">
            <span className="text-2xl font-heading font-black text-primary">{sampleProfile.transactionCount}</span>
            <p className="text-xs font-body text-muted-foreground">Completed Transactions</p>
          </div>
        </div>
      </div>
    </div>
  );
}
