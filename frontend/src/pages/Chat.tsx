import React, { useMemo } from 'react';
import { MessageCircle } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useMyConversations } from '../hooks/useQueries';
import ConversationItem from '../components/ConversationItem';
import LoginPrompt from '../components/LoginPrompt';

interface ChatProps {
  onConversationClick: (otherUserId: Principal, listingId: bigint) => void;
}

export default function Chat({ onConversationClick }: ChatProps) {
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useMyConversations();

  const conversations = useMemo(() => {
    if (!messages || !identity) return [];
    const myId = identity.getPrincipal().toString();
    const seen = new Map<string, typeof messages[0]>();

    messages.forEach((msg) => {
      const otherUserId =
        msg.senderId.toString() === myId
          ? msg.receiverId.toString()
          : msg.senderId.toString();
      const key = `${otherUserId}-${msg.listingId.toString()}`;
      const existing = seen.get(key);
      if (!existing || Number(msg.timestamp) > Number(existing.timestamp)) {
        seen.set(key, msg);
      }
    });

    return Array.from(seen.entries())
      .map(([key, msg]) => {
        const myId2 = identity.getPrincipal().toString();
        const otherUserId =
          msg.senderId.toString() === myId2 ? msg.receiverId : msg.senderId;
        return { key, msg, otherUserId };
      })
      .sort((a, b) => Number(b.msg.timestamp) - Number(a.msg.timestamp));
  }, [messages, identity]);

  if (!identity) {
    return (
      <div className="min-h-screen bg-background pb-24 px-4 pt-8">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-foreground mb-1">Messages</h1>
          <p className="font-body text-muted-foreground text-sm">
            Sign in to view your conversations
          </p>
        </div>
        <LoginPrompt message="Sign in to view your messages" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 border-b border-border">
        <h1 className="font-display font-bold text-2xl text-foreground mb-0.5">Messages</h1>
        <p className="font-body text-muted-foreground text-sm">
          {conversations.length > 0
            ? `${conversations.length} conversation${conversations.length !== 1 ? 's' : ''}`
            : 'No conversations yet'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-0">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
              <div className="w-11 h-11 rounded-2xl bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded-lg bg-muted animate-pulse w-32" />
                <div className="h-3 rounded-md bg-muted animate-pulse w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">No messages yet</h3>
          <p className="text-sm font-body text-muted-foreground max-w-xs">
            Start a conversation by messaging a seller on any listing.
          </p>
        </div>
      ) : (
        <div>
          {conversations.map(({ key, msg, otherUserId }) => (
            <ConversationItem
              key={key}
              otherUserId={otherUserId}
              listingId={msg.listingId}
              lastMessage={msg.isDeleted ? 'Message deleted' : msg.content}
              timestamp={msg.timestamp}
              onClick={() => onConversationClick(otherUserId, msg.listingId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
