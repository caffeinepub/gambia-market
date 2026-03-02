import type { Principal } from "@dfinity/principal";
import { ArrowLeft, Paintbrush, Send, Smile, X } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import type { ListingId } from "../backend";
import GuestNamePrompt from "../components/GuestNamePrompt";
import MessageBubble from "../components/MessageBubble";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useMessages,
  useSendMessage,
  useSendMessageAnon,
} from "../hooks/useQueries";

interface MessageThreadProps {
  listingId: ListingId;
  otherUserId: Principal;
  otherUserName: string;
  onBack: () => void;
}

// Background options for chat customisation
const BG_OPTIONS = [
  {
    key: "default",
    label: "Default",
    preview: "var(--background)",
    style: { background: "var(--background)" },
  },
  {
    key: "light-green",
    label: "Mint",
    preview: "oklch(0.96 0.04 155)",
    style: { background: "oklch(0.96 0.04 155)" },
  },
  {
    key: "light-blue",
    label: "Sky",
    preview: "oklch(0.95 0.04 220)",
    style: { background: "oklch(0.95 0.04 220)" },
  },
  {
    key: "soft-purple",
    label: "Lavender",
    preview: "oklch(0.95 0.04 290)",
    style: { background: "oklch(0.95 0.04 290)" },
  },
  {
    key: "warm-beige",
    label: "Sand",
    preview: "oklch(0.96 0.02 75)",
    style: { background: "oklch(0.96 0.02 75)" },
  },
  {
    key: "peach",
    label: "Peach",
    preview: "oklch(0.95 0.04 40)",
    style: { background: "oklch(0.95 0.04 40)" },
  },
  {
    key: "dark-navy",
    label: "Night",
    preview: "oklch(0.2 0.04 260)",
    style: { background: "oklch(0.2 0.04 260)" },
  },
  {
    key: "dark-forest",
    label: "Forest",
    preview: "oklch(0.18 0.05 155)",
    style: { background: "oklch(0.18 0.05 155)" },
  },
  {
    key: "green-gradient",
    label: "Meadow",
    preview:
      "linear-gradient(160deg, oklch(0.92 0.06 155), oklch(0.88 0.08 175))",
    style: {
      background:
        "linear-gradient(160deg, oklch(0.92 0.06 155) 0%, oklch(0.88 0.08 175) 100%)",
    },
  },
  {
    key: "teal-gradient",
    label: "Ocean",
    preview:
      "linear-gradient(160deg, oklch(0.88 0.07 195), oklch(0.85 0.08 220))",
    style: {
      background:
        "linear-gradient(160deg, oklch(0.88 0.07 195) 0%, oklch(0.85 0.08 220) 100%)",
    },
  },
  {
    key: "sunrise",
    label: "Sunrise",
    preview:
      "linear-gradient(160deg, oklch(0.95 0.06 65), oklch(0.92 0.07 35))",
    style: {
      background:
        "linear-gradient(160deg, oklch(0.95 0.06 65) 0%, oklch(0.92 0.07 35) 100%)",
    },
  },
  {
    key: "aurora",
    label: "Aurora",
    preview:
      "linear-gradient(160deg, oklch(0.88 0.07 220), oklch(0.85 0.08 290))",
    style: {
      background:
        "linear-gradient(160deg, oklch(0.88 0.07 220) 0%, oklch(0.85 0.08 290) 100%)",
    },
  },
] as const;

type BgKey = (typeof BG_OPTIONS)[number]["key"];

const LS_KEY = "gm-chat-bg";

// Emoji quick-pick list
const QUICK_EMOJIS = [
  "😊",
  "😂",
  "❤️",
  "👍",
  "🙏",
  "🔥",
  "😍",
  "🎉",
  "💯",
  "👏",
  "😢",
  "😮",
  "🤝",
  "✅",
  "💰",
  "📦",
];

// Avatar gradient colours indexed by first char code
function avatarGradient(name: string) {
  const gradients = [
    "linear-gradient(135deg, oklch(0.55 0.18 155), oklch(0.45 0.16 175))",
    "linear-gradient(135deg, oklch(0.55 0.18 220), oklch(0.45 0.16 240))",
    "linear-gradient(135deg, oklch(0.60 0.18 30), oklch(0.50 0.16 50))",
    "linear-gradient(135deg, oklch(0.55 0.18 290), oklch(0.45 0.16 310))",
    "linear-gradient(135deg, oklch(0.55 0.18 0), oklch(0.45 0.16 20))",
    "linear-gradient(135deg, oklch(0.60 0.16 75), oklch(0.50 0.14 95))",
  ];
  const code = name.charCodeAt(0) || 0;
  return gradients[code % gradients.length];
}

export default function MessageThread({
  listingId,
  otherUserId,
  otherUserName,
  onBack,
}: MessageThreadProps) {
  const [messageText, setMessageText] = useState("");
  const [showGuestPrompt, setShowGuestPrompt] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [showBgPanel, setShowBgPanel] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedBg, setSelectedBg] = useState<BgKey>(() => {
    try {
      return (localStorage.getItem(LS_KEY) as BgKey) || "default";
    } catch {
      return "default";
    }
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { identity } = useInternetIdentity();
  const { data: messages, isLoading } = useMessages(listingId);
  const sendMessage = useSendMessage();
  const sendAnonMessage = useSendMessageAnon();

  const currentUserId = identity?.getPrincipal();

  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const applyBg = (key: BgKey) => {
    setSelectedBg(key);
    try {
      localStorage.setItem(LS_KEY, key);
    } catch {
      // ignore
    }
    setShowBgPanel(false);
  };

  const bgOption =
    BG_OPTIONS.find((o) => o.key === selectedBg) ?? BG_OPTIONS[0];
  const bgStyle = bgOption.style;
  const isDarkBg = selectedBg === "dark-navy" || selectedBg === "dark-forest";

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

    setMessageText("");
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
      setMessageText("");
    }
  };

  const insertEmoji = (emoji: string) => {
    setMessageText((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const isSending = sendMessage.isPending || sendAnonMessage.isPending;
  const displayName = otherUserName || "Conversation";

  return (
    <div
      className="flex flex-col bg-background"
      style={{ height: "calc(100dvh - 56px)" }}
    >
      {/* ─── Thread Header ─── */}
      <div
        className="shrink-0 px-3 h-14 flex items-center gap-3 z-10"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.38 0.18 155) 0%, oklch(0.50 0.16 185) 100%)",
          boxShadow: "0 2px 16px oklch(0.38 0.18 155 / 0.4)",
        }}
      >
        <button
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all shrink-0 active:scale-90"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Avatar with online dot */}
        <div className="relative shrink-0">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-base border-2 border-white/25"
            style={{ background: avatarGradient(displayName) }}
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
          {/* Online dot */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-400 border-2 border-white" />
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-display font-bold text-sm text-white truncate leading-tight">
            {displayName}
          </h1>
          <p className="text-[11px] font-body text-white/65 leading-tight">
            Active now
          </p>
        </div>

        {/* Palette button */}
        <button
          type="button"
          onClick={() => setShowBgPanel(true)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/15 transition-all shrink-0 active:scale-90"
          aria-label="Customize background"
          title="Change background"
        >
          <Paintbrush className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* ─── Messages scrollable area ─── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-1 min-h-0"
        style={bgStyle}
      >
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
                isSent={
                  currentUserId
                    ? message.senderId.toString() === currentUserId.toString()
                    : false
                }
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: isDarkBg
                    ? "oklch(0.28 0.04 260)"
                    : "oklch(0.93 0.04 155)",
                }}
              >
                <Send
                  className="w-8 h-8"
                  style={{
                    color: isDarkBg
                      ? "oklch(0.65 0.14 165)"
                      : "oklch(0.42 0.18 155)",
                  }}
                />
              </div>
              <p
                className="font-display font-bold text-base mb-1"
                style={{
                  color: isDarkBg ? "oklch(0.88 0.01 85)" : "var(--foreground)",
                }}
              >
                Start the conversation
              </p>
              <p
                className="text-sm font-body"
                style={{
                  color: isDarkBg
                    ? "oklch(0.65 0.015 265)"
                    : "var(--muted-foreground)",
                }}
              >
                Send a message to {displayName}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ─── Emoji quick-pick strip ─── */}
      {showEmojiPicker && (
        <div
          className="shrink-0 border-t border-border px-3 py-2"
          style={{ background: "var(--card)" }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-body font-semibold text-muted-foreground">
              Quick reactions
            </span>
            <button
              type="button"
              onClick={() => setShowEmojiPicker(false)}
              className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-8 gap-1">
            {QUICK_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => insertEmoji(emoji)}
                className="text-xl w-9 h-9 flex items-center justify-center rounded-xl hover:bg-muted transition-all active:scale-90"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Input pinned at bottom ─── */}
      <div
        className="shrink-0 border-t border-border px-3 py-2.5"
        style={{ background: "var(--card)" }}
      >
        <div className="flex items-center gap-2">
          {/* Emoji toggle */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker((p) => !p)}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 active:scale-90 ${
              showEmojiPicker
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            aria-label="Emoji picker"
          >
            <Smile className="w-5 h-5" />
          </button>

          <input
            ref={inputRef}
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message…"
            style={{ fontSize: "16px" }}
            className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-muted text-foreground font-body text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            disabled={isSending}
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={!messageText.trim() || isSending}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-90"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.52 0.18 155), oklch(0.48 0.16 175))",
              boxShadow: messageText.trim()
                ? "0 2px 10px oklch(0.42 0.18 155 / 0.45)"
                : "none",
            }}
          >
            {isSending ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* ─── Guest name prompt overlay ─── */}
      {showGuestPrompt && (
        <GuestNamePrompt
          onSubmit={handleGuestNameSubmit}
          onClose={() => setShowGuestPrompt(false)}
        />
      )}

      {/* ─── Background customisation sheet ─── */}
      {showBgPanel && (
        <div
          className="fixed inset-0 z-50 flex items-end"
          style={{ background: "oklch(0.1 0.02 260 / 0.6)" }}
          onClick={() => setShowBgPanel(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowBgPanel(false)}
          role="presentation"
        >
          <dialog
            open
            className="w-full bg-card rounded-t-3xl pb-8 m-0 p-0 border-0 max-w-full"
            style={{ boxShadow: "0 -8px 40px oklch(0.1 0.02 260 / 0.3)" }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>

            <div className="flex items-center justify-between px-5 pt-1 pb-4">
              <div>
                <h2 className="font-display font-bold text-base text-foreground flex items-center gap-2">
                  <Paintbrush
                    className="w-4 h-4"
                    style={{ color: "oklch(0.42 0.18 155)" }}
                  />
                  Chat Background
                </h2>
                <p className="text-xs font-body text-muted-foreground mt-0.5">
                  Pick a style for this conversation
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowBgPanel(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Swatch grid */}
            <div className="px-5 grid grid-cols-4 gap-3 sm:grid-cols-6">
              {BG_OPTIONS.map((opt) => {
                const isSelected = selectedBg === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => applyBg(opt.key)}
                    className="flex flex-col items-center gap-1.5 group"
                  >
                    <div
                      className="w-full aspect-square rounded-2xl border-2 transition-all relative overflow-hidden"
                      style={{
                        background: opt.preview,
                        borderColor: isSelected
                          ? "oklch(0.42 0.18 155)"
                          : "transparent",
                        boxShadow: isSelected
                          ? "0 0 0 3px oklch(0.42 0.18 155 / 0.3)"
                          : "0 1px 4px oklch(0.18 0.025 260 / 0.15)",
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute inset-0 flex items-center justify-center"
                          style={{ background: "oklch(0.42 0.18 155 / 0.2)" }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{ background: "oklch(0.42 0.18 155)" }}
                          >
                            <span className="text-white text-[10px] font-bold">
                              ✓
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <span
                      className="text-[10px] font-body truncate w-full text-center transition-colors"
                      style={{
                        color: isSelected
                          ? "oklch(0.42 0.18 155)"
                          : "var(--muted-foreground)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </dialog>
        </div>
      )}
    </div>
  );
}
