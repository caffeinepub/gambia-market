import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import { Input } from './ui/input';

interface InlineEditFieldProps {
  value: string;
  placeholder?: string;
  onSave: (value: string) => Promise<void> | void;
  icon?: React.ReactNode;
  className?: string;
}

export default function InlineEditField({ value, placeholder, onSave, icon, className }: InlineEditFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (editValue.trim() === value) { setIsEditing(false); return; }
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

  if (isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="h-9 text-sm flex-1"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
        />
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex-shrink-0"
        >
          {isSaving ? (
            <span className="w-3 h-3 border border-primary-foreground border-t-transparent rounded-full animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
        </button>
        <button
          onClick={handleCancel}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-muted transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 group ${className}`}>
      {icon && <span className="text-muted-foreground flex-shrink-0">{icon}</span>}
      <span className="text-sm font-body text-foreground flex-1">
        {value || <span className="text-muted-foreground">{placeholder}</span>}
      </span>
      <button
        onClick={() => setIsEditing(true)}
        className="w-6 h-6 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all flex-shrink-0"
        aria-label="Edit"
      >
        <Pencil className="w-3 h-3 text-muted-foreground" />
      </button>
    </div>
  );
}
