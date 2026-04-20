import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DriverActiveTaskCard } from '@/features/driver/DriverActiveTaskCard';
import { DriverPickupRequestList } from '@/features/driver/DriverPickupRequestList';
import { DriverDeliveryList } from '@/features/driver/DriverDeliveryList';
import { DRIVER_COPY, DRIVER_DOCUMENT_TITLE } from '@/utils/driver';

export default function DriverDashboardPage() {
  const [pickupPage, setPickupPage] = useState(1);
  const [deliveryPage, setDeliveryPage] = useState(1);
  const queryClient = useQueryClient();

  useEffect(() => {
    document.title = DRIVER_DOCUMENT_TITLE.dashboard;
  }, []);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['driver', 'pickups'] });
    queryClient.invalidateQueries({ queryKey: ['driver', 'deliveries'] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold">{DRIVER_COPY.dashboardTitle}</h1>
          <p className="text-sm text-muted-foreground">{DRIVER_COPY.dashboardDescription}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          {DRIVER_COPY.refreshButton}
        </Button>
      </div>

      <DriverActiveTaskCard />

      <Tabs defaultValue="pickups">
        <TabsList>
          <TabsTrigger value="pickups">{DRIVER_COPY.pickupTabLabel}</TabsTrigger>
          <TabsTrigger value="deliveries">{DRIVER_COPY.deliveryTabLabel}</TabsTrigger>
        </TabsList>

        <TabsContent value="pickups" className="mt-4">
          <DriverPickupRequestList page={pickupPage} onPageChange={setPickupPage} />
        </TabsContent>

        <TabsContent value="deliveries" className="mt-4">
          <DriverDeliveryList page={deliveryPage} onPageChange={setDeliveryPage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
