import type { Principal } from "@dfinity/principal";
import { MessageCircle, Search, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import ConversationItem from "../components/ConversationItem";
import LoginPrompt from "../components/LoginPrompt";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useMyConversations } from "../hooks/useQueries";

interface ChatProps {
  onConversationClick: (otherUserId: Principal, listingId: bigint) => void;
}

export default function Chat({ onConversationClick }: ChatProps) {
  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useMyConversations();
  const [searchQuery, setSearchQuery] = useState("");

  const conversations = useMemo(() => {
    if (!messages || !identity) return [];
    const myId = identity.getPrincipal().toString();
    const seen = new Map<string, (typeof messages)[0]>();

    for (const msg of messages) {
      const otherUserId =
        msg.senderId.toString() === myId
          ? msg.receiverId.toString()
          : msg.senderId.toString();
      const key = `${otherUserId}-${msg.listingId.toString()}`;
      const existing = seen.get(key);
      if (!existing || Number(msg.timestamp) > Number(existing.timestamp)) {
        seen.set(key, msg);
      }
    }

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
      <div className="min-h-screen bg-background pb-24">
        {/* Gradient header */}
        <div
          className="px-4 pt-12 pb-8"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.42 0.18 155), oklch(0.52 0.16 185))",
          }}
        >
          <h1 className="font-display font-bold text-2xl text-white mb-1">
            Messages
          </h1>
          <p className="font-body text-white/70 text-sm">
            Sign in to view your conversations
          </p>
        </div>
        <div className="px-4 pt-6">
          <LoginPrompt message="Sign in to view your messages" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Rich gradient header */}
      <div
        className="relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.42 0.18 155) 0%, oklch(0.52 0.16 185) 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute -top-6 -right-6 w-32 h-32 rounded-full opacity-20"
          style={{ background: "oklch(0.65 0.14 165)" }}
        />
        <div
          className="absolute top-4 right-12 w-16 h-16 rounded-full opacity-15"
          style={{ background: "oklch(0.75 0.12 185)" }}
        />

        <div className="relative px-4 pt-10 pb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/20">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-white">
              Messages
            </h1>
          </div>
          <p className="font-body text-white/75 text-sm ml-12">
            {conversations.length > 0
              ? `${conversations.length} conversation${conversations.length !== 1 ? "s" : ""}`
              : "Your conversations will appear here"}
          </p>
        </div>

        {/* Search bar inside header bottom area */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations…"
              style={{ fontSize: "16px" }}
              className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder:text-white/55 font-body text-sm border border-white/25 focus:outline-none focus:ring-2 focus:ring-white/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Conversations list */}
      {isLoading ? (
        <div className="space-y-0 pt-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-4 py-4 border-b border-border"
            >
              <div className="w-12 h-12 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 rounded-lg bg-muted animate-pulse w-36" />
                <div className="h-3 rounded-md bg-muted animate-pulse w-52" />
              </div>
              <div className="h-3 rounded bg-muted animate-pulse w-8 shrink-0" />
            </div>
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
          {/* Illustrated empty state */}
          <div className="relative mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.92 0.04 155), oklch(0.88 0.05 185))",
              }}
            >
              <MessageCircle
                className="w-10 h-10"
                style={{ color: "oklch(0.42 0.18 155)" }}
              />
            </div>
            {/* Ring decoration */}
            <div
              className="absolute -inset-2 rounded-full border-2 opacity-30"
              style={{ borderColor: "oklch(0.52 0.16 185)" }}
            />
            <div
              className="absolute -inset-4 rounded-full border opacity-15"
              style={{ borderColor: "oklch(0.42 0.18 155)" }}
            />
          </div>
          <h3 className="font-display font-bold text-lg text-foreground mb-2">
            No messages yet
          </h3>
          <p className="text-sm font-body text-muted-foreground max-w-xs leading-relaxed">
            Start a conversation by tapping the message button on any listing.
            Your chats will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {conversations.map(({ key, msg, otherUserId }) => (
            <ConversationItem
              key={key}
              otherUserId={otherUserId}
              listingId={msg.listingId}
              lastMessage={msg.isDeleted ? "Message deleted" : msg.content}
              timestamp={msg.timestamp}
              onClick={() => onConversationClick(otherUserId, msg.listingId)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
