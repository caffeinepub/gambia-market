import { useMemo } from 'react';
import { MessageCircle, LogIn } from 'lucide-react';
import { useMyConversations, useListing, useGetUserProfile } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import ConversationItem from '../components/ConversationItem';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import type { ListingId } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

interface ChatProps {
  onConversationClick: (listingId: ListingId, otherUserId: Principal, otherUserName: string) => void;
}

// Placeholder conversation items for the blurred preview
const PREVIEW_ITEMS = [
  { name: 'Fatou J.', msg: 'Is this still available?', time: '2m ago' },
  { name: 'Lamin K.', msg: 'Can you do D800?', time: '1h ago' },
  { name: 'Aminata S.', msg: 'Where are you located?', time: '3h ago' },
];

function UnauthenticatedChatView() {
  const { login, isLoggingIn } = useInternetIdentity();

  return (
    <div className="relative flex flex-col min-h-[60vh]">
      {/* Blurred preview */}
      <div className="blur-sm pointer-events-none select-none px-4 pt-4 flex flex-col gap-0">
        {PREVIEW_ITEMS.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4 border-b border-border">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <span className="font-heading font-bold text-primary text-lg">{item.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <span className="font-heading font-semibold text-sm text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">{item.time}</span>
              </div>
              <p className="text-sm text-muted-foreground font-body truncate">{item.msg}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Overlay CTA */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] px-6">
        <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-card max-w-xs w-full">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
            <MessageCircle className="w-6 h-6 text-primary" />
          </div>
          <h3 className="font-heading font-bold text-lg text-foreground mb-1">Your Messages</h3>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Log in to see your conversations and message sellers.
          </p>
          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-11 font-semibold gap-2"
          >
            {isLoggingIn ? (
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? 'Logging in…' : 'Log In to Chat'}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConversationListItem({
  message,
  currentUserId,
  onConversationClick,
}: {
  message: import('../backend').Message;
  currentUserId: Principal;
  onConversationClick: ChatProps['onConversationClick'];
}) {
  const otherUserId =
    message.senderId.toString() === currentUserId.toString()
      ? message.receiverId
      : message.senderId;

  const { data: listing } = useListing(message.listingId);
  const { data: otherUser } = useGetUserProfile(otherUserId.toString());

  const listingPhotoUrl = listing?.photos?.[0]?.getDirectURL();
  const otherUserName = otherUser?.name ?? 'User';

  // Online indicator: last message within 5 minutes
  const isRecent = Date.now() - Number(message.timestamp) / 1_000_000 < 5 * 60 * 1000;

  return (
    <ConversationItem
      message={message}
      otherUserId={otherUserId}
      otherUserName={otherUserName}
      listingTitle={listing?.title}
      listingPhotoUrl={listingPhotoUrl}
      currentUserId={currentUserId}
      isRecent={isRecent}
      onClick={() => onConversationClick(message.listingId, otherUserId, otherUserName)}
    />
  );
}

export default function Chat({ onConversationClick }: ChatProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: conversations, isLoading } = useMyConversations();

  const uniqueConversations = useMemo(() => {
    if (!conversations || !identity) return [];
    const currentUserId = identity.getPrincipal();
    const seen = new Set<string>();
    const result: typeof conversations = [];

    const sorted = [...conversations].sort(
      (a, b) => Number(b.timestamp) - Number(a.timestamp)
    );

    for (const msg of sorted) {
      const otherUserId =
        msg.senderId.toString() === currentUserId.toString()
          ? msg.receiverId
          : msg.senderId;
      const key = `${msg.listingId.toString()}-${otherUserId.toString()}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(msg);
      }
    }
    return result;
  }, [conversations, identity]);

  if (!isAuthenticated) {
    return <UnauthenticatedChatView />;
  }

  const currentUserId = identity.getPrincipal();

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h1 className="font-heading font-bold text-lg text-foreground">Messages</h1>
        {uniqueConversations.length > 0 && (
          <p className="text-xs text-muted-foreground font-body">
            {uniqueConversations.length} conversation{uniqueConversations.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-0">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-4 border-b border-border">
              <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
              <div className="flex-1 flex flex-col gap-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : uniqueConversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-heading font-semibold text-foreground mb-1">No conversations yet</p>
          <p className="font-body text-sm text-muted-foreground">
            Message a seller to start chatting
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {uniqueConversations.map((msg) => (
            <ConversationListItem
              key={`${msg.listingId.toString()}-${msg.senderId.toString()}-${msg.receiverId.toString()}`}
              message={msg}
              currentUserId={currentUserId}
              onConversationClick={onConversationClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
