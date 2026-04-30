import { format } from 'date-fns';
import PageHeader from '@/components/PageHeader';
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
import { useAdminPickupRequests } from '@/hooks/useAdminPickupRequests';
import type { PickupRequest } from '@/types/order';
import { toTitleCase } from '@/utils/string';

function formatPickupStatus(status: string) {
  return toTitleCase(status.replaceAll('_', ' '));
}

function formatPickupDate(date: string) {
  return format(new Date(date), 'dd MMM yyyy, HH:mm');
}

function getCustomerLabel(name?: string | null, email?: string) {
  return name ?? email ?? '\u2014';
}

function getAddressLabel(label?: string, street?: string, city?: string) {
  if (label) return label;
  if (street && city) return `${street}, ${city}`;
  return street ?? city ?? '\u2014';
}

export default function AdminPickupRequestsPage() {
  const { data, isPending } = useAdminPickupRequests();
  const pickupRequests: PickupRequest[] = data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Pickup Requests" />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Pickup Requests ({pickupRequests.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 md:hidden">
            {isPending && (
              <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                Loading pickup requests...
              </div>
            )}

            {!isPending && pickupRequests.length === 0 && (
              <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
                No pickup requests found.
              </div>
            )}

            {pickupRequests.map((pickup) => (
              <div key={pickup.id} className="rounded-xl border bg-card p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">{pickup.id}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {getCustomerLabel(
                        pickup.customerUser?.name,
                        pickup.customerUser?.email,
                      )}
                    </p>
                  </div>

                  <Badge variant="outline">
                    {formatPickupStatus(pickup.status)}
                  </Badge>
                </div>

                <div className="mt-4 grid gap-3 text-sm">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Outlet
                    </p>
                    <p className="mt-1">{pickup.outlet?.name ?? '\u2014'}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Address
                    </p>
                    <p className="mt-1">
                      {getAddressLabel(
                        pickup.address?.label,
                        pickup.address?.street,
                        pickup.address?.city,
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Scheduled
                    </p>
                    <p className="mt-1">{formatPickupDate(pickup.scheduledAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Pickup Request</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Outlet</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Scheduled</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pickupRequests.map((pickup) => (
                  <TableRow key={pickup.id}>
                    <TableCell className="font-medium">{pickup.id}</TableCell>
                    <TableCell>
                      {getCustomerLabel(
                        pickup.customerUser?.name,
                        pickup.customerUser?.email,
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {formatPickupStatus(pickup.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>{pickup.outlet?.name ?? '\u2014'}</TableCell>
                    <TableCell>
                      {getAddressLabel(
                        pickup.address?.label,
                        pickup.address?.street,
                        pickup.address?.city,
                      )}
                    </TableCell>
                    <TableCell>{formatPickupDate(pickup.scheduledAt)}</TableCell>
                  </TableRow>
                ))}
                {isPending && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Loading pickup requests...
                    </TableCell>
                  </TableRow>
                )}
                {!isPending && pickupRequests.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No pickup requests found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
