import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ShiftFilters } from '@/features/admin/shifts/ShiftFilters';
import { ShiftTable } from '@/features/admin/shifts/ShiftTable';
import { CreateShiftDialog } from '@/features/admin/shifts/CreateShiftDialog';
import { EndShiftDialog } from '@/features/admin/shifts/EndShiftDialog';
import { useCreateShift } from '@/hooks/useCreateShift';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useEndShift } from '@/hooks/useEndShift';
import { useAdminOutlets } from '@/hooks/useAdminOutlets';
import { useShifts } from '@/hooks/useShifts';
import { useUsers } from '@/hooks/useUsers';
import type { Shift } from '@/types/shift';

export default function AdminShiftsPage() {
  const { effectiveRole, profile } = useCurrentUser();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'ENDED'>('ACTIVE');
  const [selectedOutletId, setSelectedOutletId] = useState('');
  const [selectedWorkerId, setSelectedWorkerId] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

  const managedOutletId = isSuperAdmin ? selectedOutletId : (profile?.staff?.outletId ?? '');
  const shiftQuery = useShifts({
    page,
    limit: 10,
    staffId: selectedWorkerId || undefined,
    outletId: managedOutletId || undefined,
    isActive: status === 'ALL' ? undefined : status === 'ACTIVE',
  });
  const outletQuery = useAdminOutlets({
    page: 1,
    limit: 100,
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const workerQuery = useUsers({
    page: 1,
    limit: 100,
    role: 'WORKER',
    outletId: managedOutletId || undefined,
  });

  const createMutation = useCreateShift(() => setCreateOpen(false));
  const endMutation = useEndShift(() => setSelectedShift(null));
  const shifts = shiftQuery.data?.data ?? [];
  const meta = shiftQuery.data?.meta;
  const workers = useMemo(() => workerQuery.data?.data ?? [], [workerQuery.data?.data]);
  const outlets = outletQuery.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Shifts"
        action={
          <Button className="gap-2" onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" />
            Add Shift
          </Button>
        }
      />

      <ShiftFilters
        isSuperAdmin={isSuperAdmin}
        outletId={selectedOutletId}
        selectedWorkerId={selectedWorkerId}
        status={status}
        workers={workers}
        outlets={outlets}
        onOutletChange={(value) => {
          setSelectedOutletId(value === 'ALL' ? '' : value);
          setSelectedWorkerId('');
          setPage(1);
        }}
        onWorkerChange={(value) => {
          setSelectedWorkerId(value === 'ALL' ? '' : value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {shiftQuery.isPending ? (
        <p className="py-8 text-center text-muted-foreground">Loading shifts...</p>
      ) : (
        <ShiftTable canManage shifts={shifts} onEnd={setSelectedShift} />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage(Math.max(1, page - 1))}
                className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, index) => (
              <PaginationItem key={index}>
                <PaginationLink
                  isActive={page === index + 1}
                  onClick={() => setPage(index + 1)}
                  className="cursor-pointer"
                >
                  {index + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage(Math.min(meta.totalPages, page + 1))}
                className={page === meta.totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <CreateShiftDialog
        open={createOpen}
        workers={workers}
        isPending={createMutation.isPending}
        onOpenChange={setCreateOpen}
        onSubmit={(values) => createMutation.mutate(values)}
      />

      <EndShiftDialog
        open={!!selectedShift}
        shift={selectedShift}
        isPending={endMutation.isPending}
        onClose={() => setSelectedShift(null)}
        onConfirm={() => selectedShift && endMutation.mutate(selectedShift.id)}
      />
    </div>
  );
}
