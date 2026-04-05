import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ActionType = 'APPROVE' | 'REJECT';

interface Props {
  open: boolean;
  actionType: ActionType | null;
  password: string;
  problemDescription: string;
  submitting: boolean;
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
  onClose,
  onSubmit,
  onChangePassword,
  onChangeProblem,
}: Props) {
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
    
        if (!val) onClose();
      }}
    >
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              onChangePassword(e.target.value)
            }
          />

          <textarea
            className="w-full border rounded-md p-2 text-sm"
            placeholder="Enter problem description"
            value={problemDescription}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onChangeProblem(e.target.value)
            }
          />

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