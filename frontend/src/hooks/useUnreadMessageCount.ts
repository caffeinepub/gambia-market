import { useMemo } from 'react';
import { useMyConversations } from './useQueries';
import { useInternetIdentity } from './useInternetIdentity';

const LAST_VIEWED_KEY = 'lastViewedMessageTimestamps';

function getLastViewed(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(LAST_VIEWED_KEY) || '{}');
  } catch {
    return {};
  }
}

export function markConversationViewed(conversationKey: string) {
  const data = getLastViewed();
  data[conversationKey] = Date.now();
  localStorage.setItem(LAST_VIEWED_KEY, JSON.stringify(data));
}

export function useUnreadMessageCount(): number {
  const { identity } = useInternetIdentity();
  const { data: conversations } = useMyConversations();

  return useMemo(() => {
    if (!identity || !conversations) return 0;
    const currentUserId = identity.getPrincipal().toString();
    const lastViewed = getLastViewed();

    let count = 0;
    for (const msg of conversations) {
      if (msg.receiverId.toString() !== currentUserId) continue;
      const key = `${msg.listingId.toString()}-${msg.senderId.toString()}`;
      const lastViewedTime = lastViewed[key] ?? 0;
      const msgTime = Number(msg.timestamp) / 1_000_000;
      if (msgTime > lastViewedTime) {
        count++;
      }
    }
    return count;
  }, [identity, conversations]);
}
