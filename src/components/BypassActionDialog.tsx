import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { password: string; problemDescription: string }) => void;
  title: string;
  isLoading?: boolean;
};

export default function BypassActionDialog({
  open,
  onClose,
  onSubmit,
  title,
  isLoading,
}: Props) {
  const [password, setPassword] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!password || !problemDescription) {
      setError('All fields are required');
      return;
    }

    setError(null);
    onSubmit({ password, problemDescription });

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
            onChange={(e) => setPassword(e.target.value)}
          />

          <Input
            placeholder="Problem description"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
          />

          {error && (
            <p className="text-sm text-destructive">{error}</p>
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