import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import type { ActionType } from '@/types/bypassRequest';
import type { ChangeEvent } from 'react';

interface FieldErrors {
  password?: string;
  problemDescription?: string;
}

interface Props {
  open: boolean;
  actionType: ActionType | null;
  password: string;
  problemDescription: string;
  submitting: boolean;
  error: string | null;
  fieldErrors: FieldErrors;
  onClose: () => void;
  onSubmit: () => void;
  onChangePassword: (value: string) => void;
  onChangeProblem: (value: string) => void;
}

export default function ApproveRejectModal({
  open,
  actionType,
  password,
  problemDescription,
  submitting,
  error,
  fieldErrors,
  onClose,
  onSubmit,
  onChangePassword,
  onChangeProblem,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {actionType === 'APPROVE'
              ? 'Approve Bypass Request'
              : 'Reject Bypass Request'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Enter admin password"
            value={password}
            aria-invalid={!!fieldErrors.password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              onChangePassword(e.target.value)
            }
          />
          {fieldErrors.password && (
            <p className="text-sm text-destructive">
              {fieldErrors.password}
            </p>
          )}

          <Textarea
            rows={4}
            placeholder="Enter problem description"
            value={problemDescription}
            aria-invalid={!!fieldErrors.problemDescription}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              onChangeProblem(e.target.value)
            }
          />
          {fieldErrors.problemDescription && (
            <p className="text-sm text-destructive">
              {fieldErrors.problemDescription}
            </p>
          )}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
