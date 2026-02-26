import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateProfile } from '../hooks/useQueries';

interface EditProfileFormProps {
  currentName: string;
  currentLocation: string;
  currentPhone?: string;
  onSaved?: () => void;
}

export default function EditProfileForm({ currentName, currentLocation, currentPhone = '', onSaved }: EditProfileFormProps) {
  const [name, setName] = useState(currentName);
  const [location, setLocation] = useState(currentLocation);
  const [phone, setPhone] = useState(currentPhone);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateProfile = useUpdateProfile();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        phone: phone.trim(),
        location: location.trim(),
      });
      onSaved?.();
    } catch {
      // Error handled by mutation's onError
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="edit-name" className="text-sm font-medium">
          Display Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-name"
          value={name}
          onChange={(e) => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
          placeholder="Your name"
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-phone" className="text-sm font-medium">
          Phone Number
        </Label>
        <Input
          id="edit-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+220 XXX XXXX"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edit-location" className="text-sm font-medium">
          Location <span className="text-destructive">*</span>
        </Label>
        <Input
          id="edit-location"
          value={location}
          onChange={(e) => { setLocation(e.target.value); setErrors(p => ({ ...p, location: '' })); }}
          placeholder="e.g. Banjul, Gambia"
          className={errors.location ? 'border-destructive' : ''}
        />
        {errors.location && <p className="text-xs text-destructive">{errors.location}</p>}
      </div>

      <div className="flex gap-2 pt-1">
        <Button
          type="submit"
          className="flex-1 bg-brand-green hover:bg-brand-green/90 text-white"
          disabled={updateProfile.isPending}
        >
          {updateProfile.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
