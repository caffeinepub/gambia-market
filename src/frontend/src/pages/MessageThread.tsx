import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { ListingId } from '../backend';
import { useMessages, useSendMessage, useSendMessageAnon } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import MessageBubble from '../components/MessageBubble';
import GuestNamePrompt from '../components/GuestNamePrompt';

interface MessageThreadProps {
  listingId: ListingId;
  otherUserId: Principal;
  otherUserName: string;
  onBack: () => void;
}

export default function MessageThread({ listingId, otherUserId, otherUserName, onBack }: MessageThreadProps) {
  const [messageText, setMessageText] = useState('');
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [guestName, setGuestName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useMessages(listingId);
  const sendMessage = useSendMessage();
  const sendAnonMessage = useSendMessageAnon();

  const currentUserId = identity?.getPrincipal();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSend = async () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    if (identity) {
      await sendMessage.mutateAsync({
        listingId,
        receiverId: otherUserId,
        content: trimmed,
      });
    } else if (guestName) {
      await sendAnonMessage.mutateAsync({
        senderName: guestName,
        messageText: trimmed,
        listingId,
        receiverId: otherUserId,
      });
    } else {
      setShowGuestPrompt(true);
      return;
    }

    setMessageText('');
  };

  const handleGuestNameSubmit = async (name: string) => {
    setGuestName(name);
    setShowGuestPrompt(false);
    if (messageText.trim()) {
      await sendAnonMessage.mutateAsync({
        senderName: name,
        messageText: messageText.trim(),
        listingId,
        receiverId: otherUserId,
      });
      setMessageText('');
    }
  };

  const isSending = sendMessage.isPending || sendAnonMessage.isPending;

  return (
    <div className="flex flex-col bg-background" style={{ height: 'calc(100dvh - 56px)' }}>
      {/* Thread Header */}
      <div className="bg-card/95 backdrop-blur-md border-b border-border px-4 h-14 flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-base text-foreground truncate">
            {otherUserName || 'Conversation'}
          </h1>
          <p className="text-xs font-body text-muted-foreground">Listing conversation</p>
        </div>
      </div>

      {/* Messages — independently scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : messages && messages.length > 0 ? (
          <>
            {messages.map((message) => (
              <MessageBubble
                key={message.id.toString()}
                message={message}
                isSent={currentUserId ? message.senderId.toString() === currentUserId.toString() : false}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
                <Send className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-body font-semibold text-foreground mb-1">Start the conversation</p>
              <p className="text-sm font-body text-muted-foreground">Send a message to the seller</p>
            </div>
          </div>
        )}
      </div>

      {/* Input — pinned at bottom */}
      <div className="shrink-0 bg-card/95 backdrop-blur-md border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Type a message…"
            style={{ fontSize: '16px' }}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            disabled={isSending}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Guest name prompt — rendered as overlay when needed */}
      {showGuestPrompt && (
        <GuestNamePrompt
          onSubmit={handleGuestNameSubmit}
          onClose={() => setShowGuestPrompt(false)}
        />
      )}
    </div>
  );
}
