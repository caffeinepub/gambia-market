import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import MessageBubble from '../components/MessageBubble';
import GuestNamePrompt from '../components/GuestNamePrompt';
import { useMessages, useSendMessage, useSendMessageAnon, useListing } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from 'sonner';
import type { ListingId } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

interface MessageThreadProps {
  listingId: ListingId;
  otherUserId: Principal;
  otherUserName: string;
  onBack: () => void;
}

export default function MessageThread({ listingId, otherUserId, otherUserName, onBack }: MessageThreadProps) {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const currentUserId = identity?.getPrincipal();

  const { data: messages, isLoading } = useMessages(listingId);
  const { data: listing } = useListing(listingId);
  const sendMessage = useSendMessage();
  const sendMessageAnon = useSendMessageAnon();

  const [content, setContent] = useState('');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [pendingContent, setPendingContent] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filter messages for this specific conversation thread (authenticated only)
  const threadMessages = (messages ?? []).filter((m) => {
    if (!currentUserId) return false;
    const isSentByMe =
      m.senderId.toString() === currentUserId.toString() &&
      m.receiverId.toString() === otherUserId.toString();
    const isReceivedByMe =
      m.receiverId.toString() === currentUserId.toString() &&
      m.senderId.toString() === otherUserId.toString();
    return isSentByMe || isReceivedByMe;
  });

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [threadMessages.length]);

  const handleSend = async () => {
    const trimmed = content.trim();
    if (!trimmed) return;

    if (isAuthenticated && currentUserId) {
      // Authenticated send
      try {
        await sendMessage.mutateAsync({ listingId, receiverId: otherUserId, content: trimmed });
        setContent('');
      } catch {
        toast.error('Failed to send message');
      }
    } else {
      // Guest send — check for stored name
      const storedName = sessionStorage.getItem('guestDisplayName');
      if (storedName) {
        await sendAsGuest(storedName, trimmed);
      } else {
        setPendingContent(trimmed);
        setShowGuestPrompt(true);
      }
    }
  };

  const sendAsGuest = async (guestName: string, text: string) => {
    try {
      await sendMessageAnon.mutateAsync({
        senderName: guestName,
        messageText: text,
        listingId,
        receiverId: otherUserId,
      });
      setContent('');
      toast.success('Message sent!');
    } catch {
      toast.error('Failed to send message');
    }
  };

  const handleGuestConfirm = async (name: string) => {
    if (pendingContent) {
      await sendAsGuest(name, pendingContent);
      setPendingContent('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const listingPhotoUrl = listing?.photos?.[0]?.getDirectURL();
  const isPending = sendMessage.isPending || sendMessageAnon.isPending;

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Guest name prompt */}
      <GuestNamePrompt
        open={showGuestPrompt}
        onClose={() => setShowGuestPrompt(false)}
        onConfirm={handleGuestConfirm}
      />

      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0 sticky top-14 z-10">
        <button
          onClick={onBack}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted transition-colors flex-shrink-0"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          {listingPhotoUrl ? (
            <img
              src={listingPhotoUrl}
              alt={listing?.title}
              className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
              <span className="text-base">📦</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-heading font-semibold text-sm text-foreground truncate">
              {otherUserName || 'Conversation'}
            </p>
            {listing && (
              <p className="text-xs text-muted-foreground font-body truncate">{listing.title}</p>
            )}
          </div>
        </div>

        {/* Guest indicator */}
        {!isAuthenticated && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full font-body flex-shrink-0">
            Guest
          </span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                <Skeleton className="h-10 w-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : !isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-muted-foreground font-body text-sm mb-1">
              You're messaging as a guest
            </p>
            <p className="text-muted-foreground font-body text-xs">
              Log in to see full conversation history
            </p>
          </div>
        ) : threadMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-muted-foreground font-body text-sm">
              Start the conversation! Say hello 👋
            </p>
          </div>
        ) : (
          <>
            {threadMessages.map((msg) => (
              <MessageBubble
                key={msg.id.toString()}
                message={msg}
                currentUserId={currentUserId!}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 border-t border-border bg-card px-4 py-3">
        {!isAuthenticated && sessionStorage.getItem('guestDisplayName') && (
          <p className="text-xs text-muted-foreground font-body mb-2">
            Messaging as <span className="font-semibold text-foreground">{sessionStorage.getItem('guestDisplayName')}</span>
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isAuthenticated ? 'Type a message…' : 'Type a message as guest…'}
            rows={1}
            className="flex-1 resize-none rounded-xl border border-border bg-muted px-4 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-body min-h-[44px] max-h-[120px]"
            style={{ lineHeight: '1.5' }}
          />
          <button
            onClick={handleSend}
            disabled={!content.trim() || isPending}
            className="w-11 h-11 flex items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
            aria-label="Send message"
          >
            {isPending ? (
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
