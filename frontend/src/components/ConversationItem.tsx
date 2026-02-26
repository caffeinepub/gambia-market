import React from 'react';
import { Clock } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { useGetUserProfile } from '../hooks/useQueries';

interface ConversationItemProps {
  otherUserId: Principal;
  listingId: bigint;
  lastMessage: string;
  timestamp: bigint;
  isUnread?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  otherUserId,
  listingId,
  lastMessage,
  timestamp,
  isUnread,
  onClick,
}: ConversationItemProps) {
  const { data: profile } = useGetUserProfile(otherUserId.toString());

  const timeAgo = (ts: bigint) => {
    const ms = Number(ts) / 1_000_000;
    const diff = Date.now() - ms;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'now';
    if (mins < 60) return `${mins}m`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h`;
    return `${Math.floor(hrs / 24)}d`;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-3 px-4 py-3.5 border-b border-border transition-all duration-200 hover:bg-muted/50 ${
        isUnread ? 'bg-primary/5' : 'bg-card'
      }`}
    >
      {/* Avatar */}
      <div className="w-11 h-11 rounded-2xl shrink-0 overflow-hidden border border-border">
        {profile?.profilePicUrl ? (
          <img src={profile.profilePicUrl} alt={profile.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-primary flex items-center justify-center">
            <span className="font-display font-bold text-base text-primary-foreground">
              {profile?.name?.charAt(0)?.toUpperCase() ?? '?'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className={`font-body text-sm truncate ${isUnread ? 'font-bold text-foreground' : 'font-semibold text-foreground'}`}>
            {profile?.name ?? otherUserId.toString().slice(0, 8) + '…'}
          </span>
          <span className="text-[10px] font-body text-muted-foreground shrink-0 ml-2 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            {timeAgo(timestamp)}
          </span>
        </div>
        <p className={`text-xs font-body truncate ${isUnread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
          {lastMessage}
        </p>
      </div>

      {isUnread && (
        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--primary)' }} />
      )}
    </button>
  );
}
