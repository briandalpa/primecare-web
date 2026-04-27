import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { UserFilters } from '@/features/admin/UserFilters';
import { UserTable } from '@/features/admin/UserTable';
import { UserFormModal } from '@/features/admin/UserFormModal';
import { useUsers } from '@/hooks/useUsers';
import { useDeleteUser } from '@/hooks/useDeleteUser';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { User } from '@/types/user';

export default function UserManagementPage() {
  const queryClient = useQueryClient();
  const { effectiveRole, isPending: rolePending } = useCurrentUser();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('ALL');
  const [outletId, setOutletId] = useState('');

  const params = {
    page,
    limit: 10,
    search: search || undefined,
    role: role !== 'ALL' ? role : undefined,
    outletId: outletId || undefined,
  };

  const { data, isPending } = useUsers(params, isSuperAdmin);
  const users = data?.data ?? [];
  const meta = data?.meta;

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });

  const [modalState, setModalState] = useState<
    { mode: 'create'; user?: never } | { mode: 'edit'; user: User } | null
  >(null);

  const {
    deleteTarget,
    isPending: deleting,
    confirmDelete,
    cancelDelete,
    handleDelete,
  } = useDeleteUser(invalidate);

  if (rolePending) {
    return <p className="py-8 text-center text-muted-foreground">Loading...</p>;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/forbidden" replace />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        action={
          <Button onClick={() => setModalState({ mode: 'create' })} className="gap-2">
            <Plus className="h-4 w-4" /> Add User
          </Button>
        }
      />

      <UserFilters
        search={search}
        role={role}
        outletId={outletId}
        onSearchChange={(v) => {
          setSearch(v);
          setPage(1);
        }}
        onRoleChange={(v) => {
          setRole(v);
          setPage(1);
        }}
        onOutletChange={(v) => {
          setOutletId(v);
          setPage(1);
        }}
      />

      {isPending ? (
        <p className="text-center text-muted-foreground py-8">Loading...</p>
      ) : (
        <UserTable
          users={users}
          onEdit={(u) => setModalState({ mode: 'edit', user: u })}
          onDelete={confirmDelete}
          canDelete={isSuperAdmin}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={
                  page === 1
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => setPage(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                className={
                  page === meta.totalPages
                    ? 'pointer-events-none opacity-50'
                    : 'cursor-pointer'
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {modalState?.mode === 'create' && (
        <UserFormModal
          mode="create"
          open
          onClose={() => setModalState(null)}
          onSuccess={invalidate}
        />
      )}
      {modalState?.mode === 'edit' && (
        <UserFormModal
          mode="edit"
          user={modalState.user}
          open
          onClose={() => setModalState(null)}
          onSuccess={invalidate}
        />
      )}

      <AlertDialog open={!!deleteTarget} onOpenChange={() => cancelDelete()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
