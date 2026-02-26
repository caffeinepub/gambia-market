import React, { useState } from 'react';
import { User, MapPin, Phone, ArrowRight, ShoppingBag } from 'lucide-react';
import { useSaveCallerUserProfile } from '../hooks/useQueries';

interface ProfileSetupProps {
  onComplete: () => void;
}

export default function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await saveProfile.mutateAsync({ name: name.trim(), phone: phone.trim(), location: location.trim() });
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-modal p-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-button">
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-1">Set Up Your Profile</h2>
          <p className="text-sm font-body text-muted-foreground">Tell us a bit about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+220 XXX XXXX"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Banjul, Serrekunda"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim() || saveProfile.isPending}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-body font-semibold text-sm text-primary-foreground transition-all duration-200 shadow-button disabled:opacity-60 mt-2"
            style={{ background: 'var(--primary)' }}
          >
            {saveProfile.isPending ? 'Saving…' : 'Get Started'}
            {!saveProfile.isPending && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </div>
    </div>
  );
}
