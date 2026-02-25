import { formatDistanceToNow } from 'date-fns';
import type { Message } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

interface ConversationItemProps {
  message: Message;
  otherUserId: Principal;
  otherUserName: string;
  listingTitle?: string;
  listingPhotoUrl?: string;
  currentUserId: Principal;
  isRecent?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  message,
  otherUserName,
  listingTitle,
  listingPhotoUrl,
  currentUserId,
  isRecent,
  onClick,
}: ConversationItemProps) {
  const isSent = message.senderId.toString() === currentUserId.toString();
  const timeAgo = formatDistanceToNow(new Date(Number(message.timestamp) / 1_000_000), { addSuffix: true });

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 active:bg-muted transition-colors text-left border-b border-border last:border-0"
    >
      {/* Listing thumbnail or avatar */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
        {listingPhotoUrl ? (
          <img src={listingPhotoUrl} alt={listingTitle} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-xl">📦</span>
          </div>
        )}
        {/* Online indicator */}
        {isRecent && (
          <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="font-heading font-semibold text-sm text-foreground truncate">
            {otherUserName}
          </span>
          <span className="text-xs text-muted-foreground font-body flex-shrink-0 ml-2">
            {timeAgo}
          </span>
        </div>
        {listingTitle && (
          <p className="text-xs text-primary font-body truncate mb-0.5">{listingTitle}</p>
        )}
        <p className="text-sm text-muted-foreground font-body truncate">
          {isSent ? 'You: ' : ''}{message.content.slice(0, 50)}{message.content.length > 50 ? '...' : ''}
        </p>
      </div>
    </button>
  );
}
