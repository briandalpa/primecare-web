import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/types/user';
import { CreateUserForm } from './CreateUserForm';
import { EditUserForm } from './EditUserForm';

type CreateProps = {
  mode: 'create';
  user?: never;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type EditProps = {
  mode: 'edit';
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function UserFormModal({
  mode,
  user,
  open,
  onClose,
  onSuccess,
}: CreateProps | EditProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="container mx-auto">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Create User' : 'Edit User'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a staff account with a password so the employee can login immediately.'
              : 'Update the selected staff account.'}
          </DialogDescription>
        </DialogHeader>
        {mode === 'create' ? (
          <CreateUserForm onClose={onClose} onSuccess={onSuccess} />
        ) : (
          <EditUserForm user={user} onClose={onClose} onSuccess={onSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
}
