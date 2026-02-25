import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Button } from './ui/button';
import { useCreateReport } from '../hooks/useQueries';
import { toast } from 'sonner';
import type { Principal } from '@icp-sdk/core/principal';

const REPORT_REASONS = [
  'Spam',
  'Fraud',
  'Inappropriate Content',
  'Fake Listing',
  'Other',
];

interface ReportModalProps {
  open: boolean;
  onClose: () => void;
  reportedId: Principal;
}

export default function ReportModal({ open, onClose, reportedId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const createReport = useCreateReport();

  const handleSubmit = async () => {
    if (!reason) {
      toast.error('Please select a reason');
      return;
    }
    try {
      await createReport.mutateAsync({ reportedId, reason });
      toast.success('Report submitted. Thank you for keeping Gambia Market safe.');
      setReason('');
      onClose();
    } catch {
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm mx-4">
        <DialogHeader>
          <DialogTitle className="font-heading">Report User</DialogTitle>
          <DialogDescription className="font-body">
            Help us keep Gambia Market safe by reporting suspicious activity.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="h-11 text-base">
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent>
              {REPORT_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1 h-11">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={createReport.isPending || !reason}
            variant="destructive"
            className="flex-1 h-11"
          >
            {createReport.isPending ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-destructive-foreground border-t-transparent rounded-full animate-spin" />
                Reporting...
              </span>
            ) : (
              'Submit Report'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
