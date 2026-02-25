import { LogIn, ShoppingBag, Zap, Shield, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface LoginPromptProps {
  onCancel?: () => void;
  compact?: boolean;
}

export default function LoginPrompt({ onCancel, compact = false }: LoginPromptProps) {
  const { login, isLoggingIn } = useInternetIdentity();

  if (compact) {
    return (
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground mb-1">Join Gambia Market</h3>
          <p className="text-muted-foreground font-body text-sm">Sign in to access all features</p>
        </div>
        <Button onClick={login} disabled={isLoggingIn} className="w-full h-11 text-base font-semibold">
          {isLoggingIn ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              Logging in…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <LogIn className="w-4 h-4" />
              Login
            </span>
          )}
        </Button>
        {onCancel && (
          <button onClick={onCancel} className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            Maybe later
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[70vh] px-6 py-10">
      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-primary flex items-center justify-center shadow-glow">
            <ShoppingBag className="w-10 h-10 text-primary-foreground" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-accent-foreground" />
          </div>
        </div>

        <h1 className="font-heading font-black text-3xl text-foreground mb-2 tracking-tight">
          Gambia Market
        </h1>
        <p className="font-body text-lg text-primary font-semibold mb-2">
          Buy & Sell Locally
        </p>
        <p className="font-body text-muted-foreground text-base mb-8 max-w-xs leading-relaxed">
          Join thousands of buyers and sellers across The Gambia. Join in seconds.
        </p>

        {/* Benefits */}
        <div className="flex flex-col gap-3 w-full max-w-xs mb-8">
          {[
            { icon: Zap, text: 'Post listings in under 2 minutes' },
            { icon: Users, text: 'Chat directly with buyers & sellers' },
            { icon: Shield, text: 'Secure & private with Internet Identity' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3 text-left">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="font-body text-sm text-foreground">{text}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex flex-col gap-3 w-full max-w-xs">
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-14 text-base font-bold rounded-2xl shadow-glow"
          >
            {isLoggingIn ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Logging you in…
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="w-5 h-5" />
                Login with Internet Identity
              </span>
            )}
          </Button>

          {onCancel && (
            <Button variant="ghost" onClick={onCancel} className="w-full h-11 text-base text-muted-foreground">
              Browse without logging in
            </Button>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground font-body mt-6">
        Powered by Internet Identity — no passwords, no tracking
      </p>
    </div>
  );
}
