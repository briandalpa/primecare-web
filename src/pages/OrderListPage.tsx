import { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { Search, Package } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useCustomerOrders } from '@/hooks/useCustomerOrders';
import { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';

export default function OrderListPage() {
  const [tab, setTab] = useState<'active' | 'completed'>('active');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const status = tab === 'completed' ? OrderStatus.COMPLETED : undefined;

  const { data, isPending } = useCustomerOrders({
    page,
    limit: 6,
    search: search || undefined,
    status,
  });

  const orders = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-foreground mb-6">My Orders</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by order ID..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => {
          setTab(v as 'active' | 'completed');
          setPage(1);
        }}
      >
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
                      <CardContent className="p-4 flex items-center justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-foreground">
                              {order.id.slice(0, 8)}
                            </span>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-xs',
                                ORDER_STATUS_COLOR[order.status as OrderStatus],
                              )}
                            >
                              {ORDER_STATUS_LABEL[
                                order.status as OrderStatus
                              ] ?? order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {order.outlet?.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(
                              new Date(order.createdAt),
                              'dd MMM yyyy, HH:mm',
                            )}
                            {order.items?.length
                              ? ` · ${order.items.reduce(
                                  (s, i) => s + i.quantity,
                                  0,
                                )} items`
                              : ''}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="font-semibold text-foreground">
                            Rp {order.totalPrice.toLocaleString('id-ID')}
                          </p>
                          <span className="text-xs text-primary">View</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <Pagination className="mt-6">
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
                        onClick={() =>
                          setPage(Math.min(meta.totalPages, page + 1))
                        }
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
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
