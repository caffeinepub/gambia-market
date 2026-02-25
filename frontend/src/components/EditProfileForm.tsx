import { useState } from 'react';
import { User, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useUpdateUser } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { UserProfile } from '../backend';

interface EditProfileFormProps {
  profile: UserProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function EditProfileForm({ profile, onCancel, onSuccess }: EditProfileFormProps) {
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const updateUser = useUpdateUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    try {
      await updateUser.mutateAsync({ name: name.trim(), location: location.trim() });
      toast.success('Profile updated!');
      onSuccess();
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4 bg-muted/50 rounded-xl border border-border">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-name" className="font-body font-medium text-sm">Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-9 h-11 text-base"
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="edit-location" className="font-body font-medium text-sm">Location</Label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="edit-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Banjul, Serrekunda"
            className="pl-9 h-11 text-base"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={updateUser.isPending} className="flex-1 h-11">
          {updateUser.isPending ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            'Save Changes'
          )}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} className="h-11">
          Cancel
        </Button>
      </div>
    </form>
  );
}
