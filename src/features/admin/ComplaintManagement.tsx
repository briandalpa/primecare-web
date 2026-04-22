import { useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { useComplaints } from '@/hooks/useComplaints';
import { useUpdateComplaintStatus } from '@/hooks/useUpdateComplaintStatus';
import { useAdminOutlets } from '@/hooks/useAdminOutlets';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { ComplaintStatus } from '@/types/enums';
import { COMPLAINT_STATUS_LABEL, COMPLAINT_STATUS_COLOR } from '@/utils/complaint';
import { ComplaintActions } from '@/features/admin/ComplaintActions';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

export default function ComplaintManagement() {
  const { effectiveRole } = useCurrentUser();
  const isSuperAdmin = effectiveRole === 'SUPER_ADMIN';

  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<ComplaintStatus | 'ALL'>('ALL');
  const [outletId, setOutletId] = useState<string>('ALL');

  const { data, isLoading, isError } = useComplaints({
    page,
    limit: PAGE_SIZE,
    status: status === 'ALL' ? undefined : status,
    outletId: outletId === 'ALL' ? undefined : outletId,
  });

  const { data: outletsData } = useAdminOutlets({ limit: 999 });
  const outlets = outletsData?.data ?? [];

  const { mutate: updateStatus } = useUpdateComplaintStatus();

  const complaints = data?.data ?? [];
  const total = data?.meta?.total ?? 0;
  const totalPages = Math.max(1, data?.meta?.totalPages ?? 1);

  const handleUpdate = (id: string, next: ComplaintStatus) => updateStatus({ id, status: next });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Complaints</h1>
        <p className="text-sm text-muted-foreground">Review and resolve customer complaints.</p>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-3 gap-3 flex-wrap">
          <CardTitle className="text-base">All Complaints ({total})</CardTitle>
          <div className="flex gap-2 flex-wrap">
            {isSuperAdmin && (
              <Select
                value={outletId}
                onValueChange={(v) => { setPage(1); setOutletId(v); }}
              >
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="All outlets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Outlets</SelectItem>
                  {outlets.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select
              value={status}
              onValueChange={(v) => { setPage(1); setStatus(v as ComplaintStatus | 'ALL'); }}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value={ComplaintStatus.OPEN}>Open</SelectItem>
                <SelectItem value={ComplaintStatus.IN_REVIEW}>In Review</SelectItem>
                <SelectItem value={ComplaintStatus.RESOLVED}>Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3 py-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded" />
              ))}
            </div>
          ) : isError ? (
            <p className="text-sm text-destructive py-8 text-center">
              Failed to load complaints. Please try again.
            </p>
          ) : complaints.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">No complaints found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Filed</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">#{c.orderId.slice(0, 8)}</TableCell>
                    <TableCell className="text-sm">{c.customerName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{c.outletName}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                      {c.description}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-xs', COMPLAINT_STATUS_COLOR[c.status])}
                      >
                        {COMPLAINT_STATUS_LABEL[c.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(c.createdAt), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <ComplaintActions complaint={c} onUpdate={handleUpdate} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && totalPages > 1 && (
            <Pagination className="mt-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className={page === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, i) => (
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
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className={
                      page === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
