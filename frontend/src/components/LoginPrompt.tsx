import React from 'react';
import { ShieldCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface LoginPromptProps {
  message?: string;
  variant?: 'modal' | 'fullpage' | 'inline';
  onCancel?: () => void;
}

export default function LoginPrompt({ message = 'Sign in to continue', variant = 'inline', onCancel }: LoginPromptProps) {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  if (variant === 'fullpage') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-3xl gradient-primary flex items-center justify-center mx-auto mb-6 shadow-button">
            <ShoppingBag className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">Welcome Back</h2>
          <p className="font-body text-muted-foreground mb-8">{message}</p>
          <button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl font-body font-semibold text-primary-foreground transition-all duration-200 shadow-button disabled:opacity-60"
            style={{ background: 'var(--primary)' }}
          >
            <ShieldCheck className="w-5 h-5" />
            {isLoggingIn ? 'Signing in…' : 'Sign In Securely'}
            {!isLoggingIn && <ArrowRight className="w-4 h-4" />}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="mt-4 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          )}
          <p className="text-xs font-body text-muted-foreground mt-4">
            Powered by Internet Identity — no passwords needed
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border p-6 text-center shadow-card">
      <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 shadow-button">
        <ShieldCheck className="w-7 h-7 text-primary-foreground" />
      </div>
      <h3 className="font-display font-bold text-lg text-foreground mb-1.5">{message}</h3>
      <p className="text-sm font-body text-muted-foreground mb-5">
        Create a free account to buy, sell, and connect with sellers across The Gambia.
      </p>
      <button
        onClick={login}
        disabled={isLoggingIn}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-body font-semibold text-sm text-primary-foreground transition-all duration-200 shadow-button disabled:opacity-60"
        style={{ background: 'var(--primary)' }}
      >
        <ShieldCheck className="w-4 h-4" />
        {isLoggingIn ? 'Signing in…' : 'Sign In to Continue'}
      </button>
      {onCancel && (
        <button
          onClick={onCancel}
          className="mt-3 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
        >
          Cancel
        </button>
      )}
    </div>
  );
}
