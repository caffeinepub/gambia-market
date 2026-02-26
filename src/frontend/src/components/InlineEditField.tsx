import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';

interface InlineEditFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  type?: 'text' | 'tel';
}

export default function InlineEditField({ label, value, onSave, placeholder, type = 'text' }: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editValue.trim() === value) {
      setIsEditing(false);
      return;
    }
    setIsSaving(true);
    try {
      await onSave(editValue.trim());
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-body font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
        {isEditing ? (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
            className="w-full px-3 py-1.5 rounded-lg border border-border bg-muted text-foreground font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
          />
        ) : (
          <p className="font-body text-sm text-foreground truncate">
            {value || <span className="text-muted-foreground italic">{placeholder ?? 'Not set'}</span>}
          </p>
        )}
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-primary-foreground transition-all disabled:opacity-60"
              style={{ background: 'var(--primary)' }}
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </button>
            <button
              onClick={handleCancel}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted transition-all"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
