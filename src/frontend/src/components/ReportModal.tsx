import React, { useState } from 'react';
import { Flag, X } from 'lucide-react';
import { Principal } from '@dfinity/principal';
import { useCreateReport } from '../hooks/useQueries';

interface ReportModalProps {
  reportedId: Principal;
  onClose: () => void;
}

const reasons = [
  'Spam or misleading',
  'Inappropriate content',
  'Fraudulent listing',
  'Wrong category',
  'Duplicate listing',
  'Other',
];

export default function ReportModal({ reportedId, onClose }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const createReport = useCreateReport();

  const handleSubmit = async () => {
    if (!selectedReason) return;
    await createReport.mutateAsync({ reportedId, reason: selectedReason });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
      <div className="w-full max-w-sm bg-card rounded-3xl border border-border shadow-modal p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-destructive/10 text-destructive">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-foreground">Report Listing</h3>
              <p className="text-xs font-body text-muted-foreground">Help keep the marketplace safe</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reasons */}
        <div className="space-y-2 mb-5">
          {reasons.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelectedReason(reason)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                selectedReason === reason
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/30 hover:border-primary/30'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 shrink-0 transition-all ${
                selectedReason === reason ? 'border-primary bg-primary' : 'border-border'
              }`} />
              <span className="font-body text-sm text-foreground">{reason}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border bg-muted text-foreground font-body font-medium text-sm hover:bg-muted/80 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedReason || createReport.isPending}
            className="flex-1 py-3 rounded-xl font-body font-semibold text-sm text-destructive-foreground bg-destructive hover:bg-destructive/90 transition-all disabled:opacity-50"
          >
            {createReport.isPending ? 'Reporting…' : 'Submit Report'}
          </button>
        </div>
      </div>
    </div>
  );
}
