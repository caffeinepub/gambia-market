import { useState, useEffect } from 'react';
import { X, Share, Download, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'installBannerDismissed';

function isIOS(): boolean {
  const ua = window.navigator.userAgent;
  return /iP(hone|ad|od)/.test(ua) && !/CriOS/.test(ua) && !/FxiOS/.test(ua);
}

function isInStandaloneMode(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    if (isInStandaloneMode()) return;

    // Don't show if previously dismissed
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (ios) {
      // On iOS, show the instructional banner immediately
      setShowBanner(true);
      return;
    }

    // On Android/Chrome, wait for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // If app gets installed, hide the banner
    const installedHandler = () => setShowBanner(false);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setShowBanner(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
    } catch {
      // Silently handle errors
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  };

  // Only show on mobile viewports and when conditions are met
  if (!showBanner) return null;

  return (
    <div
      className="
        fixed bottom-0 left-0 right-0 z-50
        md:hidden
        bg-brand-green text-white
        rounded-t-2xl shadow-2xl
        border-t-2 border-brand-gold/40
        animate-slide-up
      "
      role="banner"
      aria-label="Install Gambia Market app"
    >
      {/* Drag handle indicator */}
      <div className="flex justify-center pt-2 pb-1">
        <div className="w-10 h-1 rounded-full bg-white/30" />
      </div>

      <div className="px-4 pb-5 pt-2">
        {isIOSDevice ? (
          /* iOS instructional banner */
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mt-0.5">
              <img
                src="/assets/generated/app-icon-192.dim_192x192.png"
                alt="Gambia Market"
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white leading-tight">
                Add Gambia Market to your Home Screen
              </p>
              <p className="text-xs text-white/80 mt-1 leading-relaxed">
                Tap the{' '}
                <span className="inline-flex items-center gap-0.5 bg-white/20 rounded px-1 py-0.5">
                  <Share className="w-3 h-3" />
                  <span>Share</span>
                </span>{' '}
                button, then tap{' '}
                <strong className="text-brand-gold font-semibold">"Add to Home Screen"</strong>
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              aria-label="Dismiss install banner"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        ) : (
          /* Android/Chrome install banner */
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <img
                src="/assets/generated/app-icon-192.dim_192x192.png"
                alt="Gambia Market"
                className="w-8 h-8 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-white leading-tight">
                Install Gambia Market
              </p>
              <p className="text-xs text-white/75 mt-0.5">
                Add to home screen for a faster experience
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={handleInstall}
                disabled={installing}
                className="
                  flex items-center gap-1.5
                  bg-brand-gold text-brand-dark
                  font-semibold text-sm
                  px-3 py-1.5 rounded-lg
                  hover:bg-brand-gold/90
                  active:scale-95
                  transition-all
                  disabled:opacity-60
                "
                aria-label="Install app"
              >
                {installing ? (
                  <Smartphone className="w-4 h-4 animate-pulse" />
                ) : (
                  <Download className="w-4 h-4" />
                )}
                {installing ? 'Installing…' : 'Install'}
              </button>
              <button
                onClick={handleDismiss}
                className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Dismiss install banner"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
