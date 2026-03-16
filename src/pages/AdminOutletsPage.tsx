import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export default function AdminOutletsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Outlets" />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Store className="h-5 w-5 text-primary" />
            Outlet Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">
            Outlet management coming soon. View, create, and manage laundry
            outlets here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
