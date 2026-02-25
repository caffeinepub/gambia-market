import { formatDistanceToNow } from 'date-fns';
import type { Message } from '../backend';
import type { Principal } from '@icp-sdk/core/principal';

interface MessageBubbleProps {
  message: Message;
  currentUserId: Principal;
}

export default function MessageBubble({ message, currentUserId }: MessageBubbleProps) {
  const isSent = message.senderId.toString() === currentUserId.toString();
  const timeAgo = formatDistanceToNow(new Date(Number(message.timestamp) / 1_000_000), { addSuffix: true });

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
          isSent
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-muted text-foreground rounded-bl-sm'
        }`}
      >
        <p className="text-sm font-body leading-relaxed">{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${
            isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}
        >
          {timeAgo}
        </p>
      </div>
    </div>
  );
}
