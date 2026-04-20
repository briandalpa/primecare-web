import { useState } from 'react';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { Address } from '@/types/address';
import { useAddresses, useDeleteAddress, useSetPrimaryAddress } from '@/hooks/useAddresses';
import { AddressFormDialog } from '@/features/customer/AddressFormDialog';
import { AddressEmptyState } from '@/features/customer/AddressEmptyState';
import { AddressList } from '@/features/customer/AddressList';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function AddressManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const { data: addresses = [], isPending } = useAddresses();
  const deleteMutation = useDeleteAddress();
  const setPrimaryMutation = useSetPrimaryAddress();

  const openAdd = () => {
    setEditingAddress(null);
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditingAddress(addr);
    setDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteMutation.mutateAsync(deleteTarget);
      toast.success('Address removed');
    } catch {
      toast.error('Failed to remove address');
    }
    setDeleteTarget(null);
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await setPrimaryMutation.mutateAsync(id);
      toast.success('Primary address updated');
    } catch {
      toast.error('Failed to update primary address');
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold font-heading text-foreground">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your pickup & delivery addresses
          </p>
        </div>
        <Button onClick={openAdd} className="rounded-full gap-2">
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : addresses.length === 0 ? (
        <AddressEmptyState onAdd={openAdd} />
      ) : (
        <AddressList
          addresses={addresses}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
          onSetPrimary={handleSetPrimary}
        />
      )}

      <AddressFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        editingAddress={editingAddress}
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this address?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
