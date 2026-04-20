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
  );
}
