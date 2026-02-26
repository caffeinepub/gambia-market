import React, { useState } from 'react';
import { Edit2, Trash2, Check } from 'lucide-react';
import { Message } from '../backend';
import { useEditMessage, useDeleteMessage } from '../hooks/useQueries';

interface MessageBubbleProps {
  message: Message;
  isSent: boolean;
}

export default function MessageBubble({ message, isSent }: MessageBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const editMessage = useEditMessage();
  const deleteMessage = useDeleteMessage();

  const timeStr = new Date(Number(message.timestamp) / 1_000_000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await editMessage.mutateAsync({
        messageId: message.id,
        newContent: editContent.trim(),
        listingId: message.listingId,
      });
    }
    setIsEditing(false);
  };

  if (message.isDeleted) {
    return (
      <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2`}>
        <div className="px-4 py-2 rounded-2xl bg-muted border border-border max-w-xs">
          <p className="text-xs font-body text-muted-foreground italic">Message deleted</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-2 group`}>
      <div className={`max-w-[75%] ${isSent ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border bg-card text-foreground text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary/30"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEdit();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              autoFocus
            />
            <button
              onClick={handleEdit}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-primary-foreground"
              style={{ background: 'var(--primary)' }}
            >
              <Check className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className={`px-4 py-2.5 rounded-2xl text-sm font-body leading-relaxed ${
              isSent
                ? 'rounded-br-md text-primary-foreground'
                : 'rounded-bl-md bg-card border border-border text-foreground'
            }`}
            style={isSent ? { background: 'var(--primary)' } : {}}
          >
            {message.content}
            {message.isEdited && (
              <span className={`text-[10px] ml-1.5 ${isSent ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                (edited)
              </span>
            )}
          </div>
        )}

        <div className={`flex items-center gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] font-body text-muted-foreground">{timeStr}</span>
          {isSent && !isEditing && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => setIsEditing(true)}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all"
              >
                <Edit2 className="w-3 h-3" />
              </button>
              <button
                onClick={() => deleteMessage.mutate({ messageId: message.id, listingId: message.listingId })}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-all"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
