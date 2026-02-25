import { useState } from 'react';
import { User, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface GuestNamePromptProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export default function GuestNamePrompt({ open, onClose, onConfirm }: GuestNamePromptProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, isLoggingIn } = useInternetIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name must be 50 characters or less');
      return;
    }
    sessionStorage.setItem('guestDisplayName', trimmed);
    onConfirm(trimmed);
    onClose();
  };

  const handleLoginInstead = async () => {
    onClose();
    try {
      await login();
    } catch {
      // ignore
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Send a Message
          </DialogTitle>
          <DialogDescription className="font-body text-sm">
            Enter your name so the seller knows who's messaging them.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="guest-name" className="font-body font-medium">Your Name</Label>
            <Input
              id="guest-name"
              type="text"
              placeholder="e.g. Fatou Jallow"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              className="h-12 text-base"
              autoFocus
              maxLength={50}
            />
            {error && <p className="text-xs text-destructive font-body">{error}</p>}
          </div>

          <Button type="submit" className="w-full h-11 font-semibold">
            Continue as Guest
          </Button>

          <div className="relative flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground font-body">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleLoginInstead}
            disabled={isLoggingIn}
            className="w-full h-11 gap-2"
          >
            {isLoggingIn ? (
              <span className="w-4 h-4 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            Login Instead
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
