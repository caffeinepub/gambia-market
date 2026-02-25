import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import LoginPrompt from './LoginPrompt';
import ProfileSetup from './ProfileSetup';

interface AuthGuardProps {
  children: React.ReactNode;
  onCancel?: () => void;
}

export default function AuthGuard({ children, onCancel }: AuthGuardProps) {
  const { identity, isInitializing } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-body text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPrompt onCancel={onCancel} />;
  }

  if (profileLoading || !isFetched) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 p-6">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
        <p className="font-body text-sm text-muted-foreground">Setting up your account…</p>
      </div>
    );
  }

  if (isAuthenticated && isFetched && userProfile === null) {
    return <ProfileSetup />;
  }

  return <>{children}</>;
}
