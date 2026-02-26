import React, { useState } from 'react';
import { Lock, X, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const ADMIN_USERNAME = 'Bigalfu';
const ADMIN_PASSWORD = '*2FF01d6140@07118559454';

interface AdminLoginModalProps {
  onLoginSuccess: () => void;
  onClose: () => void;
}

export default function AdminLoginModal({ onLoginSuccess, onClose }: AdminLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    // Simulate slight delay for UX
    await new Promise((r) => setTimeout(r, 400));

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      onLoginSuccess();
    } else {
      setError('Invalid credentials. Please try again.');
    }

    setIsSubmitting(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="relative w-full max-w-sm rounded-2xl border border-border shadow-2xl overflow-hidden animate-fade-in"
        style={{ background: 'var(--card)' }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
      >
        {/* Header gradient strip */}
        <div
          className="px-6 pt-6 pb-5"
          style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)' }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Admin Login</h2>
                <p className="text-xs text-white/60">Restricted access only</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-username" className="text-sm font-medium text-foreground">
              Username
            </Label>
            <Input
              id="admin-username"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Enter admin username"
              autoComplete="username"
              className="h-11 rounded-xl text-sm"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <Label htmlFor="admin-password" className="text-sm font-medium text-foreground">
              Password
            </Label>
            <div className="relative">
              <Input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Enter admin password"
                autoComplete="current-password"
                className="h-11 rounded-xl text-sm pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
              <Lock className="w-4 h-4 text-destructive shrink-0" />
              <span className="text-sm text-destructive font-medium">{error}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || !username || !password}
            className="w-full h-11 rounded-xl font-bold text-white"
            style={{
              background: isSubmitting || !username || !password
                ? undefined
                : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            }}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Log In
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
