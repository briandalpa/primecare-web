import { useState } from 'react';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MessageSquareWarning } from 'lucide-react';
import { useCreateComplaint } from '@/hooks/useCreateComplaint';

const schema = z.object({
  description: z
    .string()
    .trim()
    .min(10, 'Please describe the issue (min 10 characters)')
    .max(1000, 'Max 1000 characters'),
});

interface Props {
  orderId: string;
  trigger?: React.ReactNode;
  onFiled?: (complaintId: string) => void;
}

export function FileComplaintDialog({ orderId, trigger, onFiled }: Props) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [fieldError, setFieldError] = useState<string | null>(null);

  const { mutate, isPending } = useCreateComplaint((id) => {
    setOpen(false);
    setDescription('');
    onFiled?.(id);
  });

  const handleSubmit = () => {
    const parsed = schema.safeParse({ description });
    if (!parsed.success) {
      setFieldError(parsed.error.issues[0].message);
      return;
    }
    setFieldError(null);
    mutate({ orderId, description: parsed.data.description });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline">
            <MessageSquareWarning className="h-4 w-4 mr-2" /> File Complaint
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File a Complaint</DialogTitle>
          <DialogDescription>
            Describe the issue with order <strong>#{orderId.slice(0, 8)}</strong>. Our outlet team
            will review and respond.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="complaint-desc">Description</Label>
          <Textarea
            id="complaint-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Two shirts are missing and one jacket has a stain..."
            rows={5}
            maxLength={1000}
          />
          {fieldError && <p className="text-sm text-destructive">{fieldError}</p>}
          <p className="text-xs text-muted-foreground text-right">{description.length}/1000</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Complaint'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
