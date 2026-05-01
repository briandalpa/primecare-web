import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { OrderStatus } from '@/types/enums';
import { ORDER_STATUS_LABEL, ORDER_STATUS_COLOR } from '@/utils/orderStatus';
import type { AdminOrder } from '@/types/order';
import { cn } from '@/lib/utils';

type Meta = { page: number; limit: number; total: number; totalPages: number };

type Props = {
  orders: AdminOrder[];
  isPending: boolean;
  meta: Meta | undefined;
  page: number;
  onPageChange: (page: number) => void;
  onRowClick: (id: string) => void;
};

function resolveCustomerName(order: AdminOrder): string {
  return (
    order.pickupRequest?.customerUser?.name ??
    order.pickupRequest?.customerUser?.email ??
    '\u2014'
  );
}

export default function OrdersTable({
  orders,
  isPending,
  meta,
  page,
  onPageChange,
  onRowClick,
}: Props) {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Orders {meta ? `(${meta.total})` : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 md:hidden">
            {isPending &&
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="border border-border/60 shadow-none">
                  <CardContent className="space-y-3 p-4">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-28 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </CardContent>
                </Card>
              ))}

            {!isPending && orders.length === 0 && (
              <div className="py-8 text-center text-muted-foreground">
                No orders found.
              </div>
            )}

            {!isPending &&
              orders.map((o) => (
                <Card
                  key={o.id}
                  className="cursor-pointer border border-border/60 shadow-none transition-colors hover:bg-muted/20"
                  onClick={() => onRowClick(o.id)}
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-foreground">
                          {resolveCustomerName(o)}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {o.outlet?.name ?? '—'}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          'shrink-0 text-xs whitespace-nowrap',
                          ORDER_STATUS_COLOR[o.status as OrderStatus],
                        )}
                      >
                        {ORDER_STATUS_LABEL[o.status as OrderStatus] ?? o.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{o.totalWeightKg} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Total</p>
                        <p className="font-semibold text-foreground">
                          Rp {o.totalPrice.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {format(new Date(o.createdAt), 'dd MMM yyyy')}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>

          <Table className="hidden md:table">
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Outlet</TableHead>
                <TableHead className="hidden lg:table-cell">Weight</TableHead>
                <TableHead className="hidden lg:table-cell">Total</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isPending &&
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-32 rounded-full" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                    <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-24" /></TableCell>
                  </TableRow>
                ))}
              {!isPending && orders.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
              {!isPending &&
                orders.map((o) => (
                  <TableRow
                    key={o.id}
                    className="cursor-pointer"
                    onClick={() => onRowClick(o.id)}
                  >
                    <TableCell className="font-medium">
                      {resolveCustomerName(o)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'text-xs whitespace-nowrap',
                          ORDER_STATUS_COLOR[o.status as OrderStatus],
                        )}
                      >
                        {ORDER_STATUS_LABEL[o.status as OrderStatus] ?? o.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {o.outlet?.name}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {o.totalWeightKg} kg
                    </TableCell>
                    <TableCell className="hidden lg:table-cell font-medium">
                      Rp {o.totalPrice.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {format(new Date(o.createdAt), 'dd MMM yyyy')}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {meta && meta.totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => onPageChange(Math.max(1, page - 1))}
                className={
                  page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                }
              />
            </PaginationItem>
            {Array.from({ length: meta.totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => onPageChange(i + 1)}
                  className="cursor-pointer"
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => onPageChange(Math.min(meta.totalPages, page + 1))}
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
  );
}
