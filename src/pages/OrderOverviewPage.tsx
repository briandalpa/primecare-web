import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/PageHeader';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useOrderFilters } from '@/hooks/useOrderFilters';
import OrderFilters from '@/features/orders/OrderFilters';
import OrdersTable from '@/features/orders/OrdersTable';

export default function OrderOverviewPage() {
  const navigate = useNavigate();
  const { effectiveRole } = useCurrentUser();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const { page, filters, params, setPage, setSearch, setStatus, setOutletId, setSortValue } =
    useOrderFilters();

  const { data, isPending } = useAdminOrders(params);
  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Orders"
        action={
          <Button onClick={() => navigate('/admin/orders/create')} className="gap-2">
            <Plus className="h-4 w-4" /> Create Order
          </Button>
        }
      />

      <OrderFilters
        search={filters.search}
        status={filters.status}
        outletId={filters.outletId}
        sortValue={filters.sortValue}
        isSuperAdmin={isSuperAdmin}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onOutletIdChange={setOutletId}
        onSortChange={setSortValue}
      />

      <OrdersTable
        orders={orders}
        isPending={isPending}
        meta={meta}
        page={page}
        onPageChange={setPage}
        onRowClick={(id) => navigate(`/admin/orders/${id}`)}
      />
    </div>
  );
}
