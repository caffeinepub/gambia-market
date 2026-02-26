import React, { useState } from 'react';
import { User, X, MessageCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface GuestNamePromptProps {
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function GuestNamePrompt({ onSubmit, onClose }: GuestNamePromptProps) {
  const [name, setName] = useState('');
  const { login, loginStatus } = useInternetIdentity();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-modal p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-button">
              <MessageCircle className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Send a Message</h3>
              <p className="text-xs font-body text-muted-foreground">Enter your name to continue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-body font-semibold text-foreground mb-1.5 uppercase tracking-wide">
              Your Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                autoFocus
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 rounded-xl font-body font-semibold text-sm text-primary-foreground transition-all duration-200 shadow-button disabled:opacity-60"
            style={{ background: 'var(--primary)' }}
          >
            Continue as Guest
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <p className="text-xs font-body text-muted-foreground mb-2">Want to save your conversations?</p>
          <button
            onClick={() => login()}
            disabled={loginStatus === 'logging-in'}
            className="text-sm font-body font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            {loginStatus === 'logging-in' ? 'Signing in…' : 'Sign In Instead'}
          </button>
        </div>
      </div>
    </div>
  );
}
