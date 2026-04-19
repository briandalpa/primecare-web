import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { OutletFilters } from '@/features/admin/outlets/OutletFilters';
import { OutletTable } from '@/features/admin/outlets/OutletTable';
import { DeactivateOutletDialog } from '@/features/admin/outlets/DeactivateOutletDialog';
import { useAdminOutlets } from '@/hooks/useAdminOutlets';
import { useDeactivateAdminOutlet } from '@/hooks/useDeactivateAdminOutlet';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import type { Outlet } from '@/types/outlet';

export default function AdminOutletsPage() {
  const { effectiveRole } = useCurrentUser();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [selectedOutlet, setSelectedOutlet] = useState<Outlet | null>(null);

  const { data, isPending } = useAdminOutlets({
    page,
    limit: 10,
    search: search || undefined,
    isActive:
      status === 'ALL' ? undefined : status === 'ACTIVE',
    sortBy: 'name',
    sortOrder: 'asc',
  });
  const deactivateMutation = useDeactivateAdminOutlet(() => setSelectedOutlet(null));

  const outlets = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Outlets"
        action={
          isSuperAdmin ? (
            <Button asChild className="gap-2">
              <Link to="/admin/outlets/new">
                <Plus className="h-4 w-4" />
                Add Outlet
              </Link>
            </Button>
          ) : undefined
        }
      />

      <OutletFilters
        search={search}
        status={status}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        onStatusChange={(value) => {
          setStatus(value);
          setPage(1);
        }}
      />

      {isPending ? (
        <p className="py-8 text-center text-muted-foreground">Loading outlets...</p>
      ) : (
        <OutletTable
          outlets={outlets}
          canManage={isSuperAdmin}
          onDeactivate={setSelectedOutlet}
        />
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

      <DeactivateOutletDialog
        outlet={selectedOutlet}
        isPending={deactivateMutation.isPending}
        onClose={() => setSelectedOutlet(null)}
        onConfirm={() => selectedOutlet && deactivateMutation.mutate(selectedOutlet.id)}
      />
    </div>
  );
}
