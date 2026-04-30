import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Outlet } from '@/types/outlet';

type OutletTableProps = {
  outlets: Outlet[];
  canManage: boolean;
  onDeactivate: (outlet: Outlet) => void;
};

export function OutletTable({
  outlets,
  canManage,
  onDeactivate,
}: OutletTableProps) {
  return (
    <div className="rounded-lg border bg-background">
      <div className="space-y-3 p-4 md:hidden">
        {outlets.length === 0 ? (
          <div className="rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground">
            No outlets found.
          </div>
        ) : (
          outlets.map((outlet) => (
            <div key={outlet.id} className="rounded-xl border bg-card p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{outlet.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{outlet.city}</p>
                </div>

                <Badge variant={outlet.isActive ? 'default' : 'secondary'}>
                  {outlet.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>

              <div className="mt-4 grid gap-3 text-sm">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Service Radius
                  </p>
                  <p className="mt-1">{outlet.maxServiceRadiusKm} km</p>
                </div>
              </div>

              {canManage && (
                <div className="mt-4 flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link to={`/admin/outlets/${outlet.id}/edit`}>Edit Outlet</Link>
                  </Button>

                  {outlet.isActive && (
                    <Button variant="destructive" onClick={() => onDeactivate(outlet)}>
                      Deactivate
                    </Button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Radius</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outlets.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  No outlets found.
                </TableCell>
              </TableRow>
            ) : (
              outlets.map((outlet) => (
                <TableRow key={outlet.id}>
                  <TableCell className="font-medium">{outlet.name}</TableCell>
                  <TableCell>{outlet.city}</TableCell>
                  <TableCell>{outlet.maxServiceRadiusKm} km</TableCell>
                  <TableCell>
                    <Badge variant={outlet.isActive ? 'default' : 'secondary'}>
                      {outlet.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {canManage && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/admin/outlets/${outlet.id}/edit`}>Edit</Link>
                        </Button>
                      )}
                      {canManage && outlet.isActive && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => onDeactivate(outlet)}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
