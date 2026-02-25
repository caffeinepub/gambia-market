import { useState } from 'react';
import { User, MapPin, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useSaveCallerUserProfile } from '../hooks/useQueries';
import { toast } from 'sonner';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim(), phone: phone.trim(), location: location.trim() });
      toast.success('Welcome to Gambia Market! 🎉');
    } catch {
      toast.error('Failed to create profile. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 py-10">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow-glow">
            <User className="w-8 h-8 text-primary-foreground" />
          </div>
          <h2 className="font-heading font-black text-2xl text-foreground mb-1">
            Almost there! 🎉
          </h2>
          <p className="text-muted-foreground font-body text-sm">
            Just a few details to set up your profile
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-6 h-0.5 bg-primary" />
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-6 h-0.5 bg-muted" />
          <div className="w-2 h-2 rounded-full bg-muted" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name" className="font-body font-medium flex items-center gap-1">
              Full Name <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9 h-12 text-base"
                autoFocus
                required
              />
              {name.trim().length > 1 && (
                <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              )}
            </div>
          </div>

          {/* Phone */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="phone" className="font-body font-medium">
              Phone Number <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+220 XXX XXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="pl-9 h-12 text-base"
              />
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="location" className="font-body font-medium">
              Location <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="location"
                type="text"
                placeholder="e.g. Banjul, Serrekunda"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9 h-12 text-base"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={saveProfile.isPending || !name.trim()}
            className="w-full h-13 text-base font-bold rounded-2xl mt-2 h-14"
          >
            {saveProfile.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Creating Profile…
              </span>
            ) : (
              "Let's Go! 🚀"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
