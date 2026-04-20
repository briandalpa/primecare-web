import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Package, X } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';
import DatePickerButton from '@/features/orders/DatePickerButton';
import OrderPagination from '@/features/orders/OrderPagination';

function useOrderFilters() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();

  function resetPage() { setPage(1); }

  const status = tab === 'completed' ? OrderStatus.COMPLETED : undefined;
  const excludeCompleted = tab === 'active' ? true : undefined;
  const hasDateFilter = !!fromDate || !!toDate;

  return { tab, setTab, search, setSearch, page, setPage,
           fromDate, setFromDate, toDate, setToDate,
           resetPage, status, excludeCompleted, hasDateFilter };
}

export default function OrderListPage() {
  const { tab, setTab, search, setSearch, page, setPage,
          fromDate, setFromDate, toDate, setToDate,
          resetPage, status, excludeCompleted, hasDateFilter } = useOrderFilters();

  const { data, isPending } = useCustomerOrders({
    page,
    limit: 6,
    search: search || undefined,
    status,
    excludeCompleted,
    fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
    toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); resetPage(); }}
            className="pl-9"
          />
        </div>
        <DatePickerButton
          value={fromDate}
          onChange={(d) => { setFromDate(d); resetPage(); }}
          placeholder="From date"
        />
        <DatePickerButton
          value={toDate}
          onChange={(d) => { setToDate(d); resetPage(); }}
          placeholder="To date"
        />
        {hasDateFilter && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => { setFromDate(undefined); setToDate(undefined); resetPage(); }}
            aria-label="Clear date filter"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => { setTab(v as 'active' | 'completed'); resetPage(); }}>
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={tab}>
          {isPending ? (
            <p className="text-center text-muted-foreground py-8">Loading...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>No orders found.</p>
            </div>
          ) : (
            <>
              <div className="grid gap-4">
                {orders.map((order) => (
                  <Link key={order.id} to={`/orders/${order.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="px-6 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">
                              {order.id.slice(0, 8)}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn('text-xs', ORDER_STATUS_COLOR[order.status])}
                            >
                              {ORDER_STATUS_LABEL[order.status]}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{order.outletName}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">
                            Rp {(order.totalPrice ?? 0).toLocaleString('id-ID')}
                          </p>
                          <span className="text-xs text-primary">View</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {meta && meta.totalPages > 1 && (
                <OrderPagination page={page} totalPages={meta.totalPages} onPageChange={setPage} />
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
