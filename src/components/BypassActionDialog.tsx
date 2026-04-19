import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { z } from 'zod';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { password: string; problemDescription: string }) => void;
  title: string;
  isLoading?: boolean;
};

const actionSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required'),
  problemDescription: z
    .string()
    .min(1, 'Problem description is required'),
});

export default function BypassActionDialog({
  open,
  onClose,
  onSubmit,
  title,
  isLoading,
}: Props) {
  const [password, setPassword] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [passwordError, setPasswordError] = useState<
    string | null
  >(null);
  const [problemError, setProblemError] = useState<
    string | null
  >(null);

  const handleSubmit = () => {
    const parsed = actionSchema.safeParse({
      password,
      problemDescription,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setPasswordError(fieldErrors.password?.[0] ?? null);
      setProblemError(
        fieldErrors.problemDescription?.[0] ?? null
      );
      return;
    }

    setPasswordError(null);
    setProblemError(null);
    onSubmit(parsed.data);

    setPassword('');
    setProblemDescription('');
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
        </AlertDialogHeader>

        <div className="space-y-4">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            aria-invalid={!!passwordError}
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && (
            <p className="text-sm text-destructive">
              {passwordError}
            </p>
          )}

          <Textarea
            rows={4}
            placeholder="Problem description"
            value={problemDescription}
            aria-invalid={!!problemError}
            onChange={(e) => setProblemDescription(e.target.value)}
          />
          {problemError && (
            <p className="text-sm text-destructive">
              {problemError}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Submit'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
