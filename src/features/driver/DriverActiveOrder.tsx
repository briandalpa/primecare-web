import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MapPin, Phone, User } from 'lucide-react';
import { useCompletePickupRequest } from '@/hooks/useCompletePickupRequest';
import { useCompleteDelivery } from '@/hooks/useCompleteDelivery';
import { useDriverDeliveryOrder } from '@/hooks/useDriverDeliveryOrder';
import { useDriverActiveTask } from '@/hooks/useDriverActiveTask';
import { DRIVER_UI_TEXT, DRIVER_ROUTE } from '@/utils/driver';
import { ItemsCard, EmptyState } from './DriverActiveOrderParts';

export default function DriverActiveOrder() {
  const navigate = useNavigate();
  const { data: task } = useDriverActiveTask();
  const completePickup = useCompletePickupRequest();
  const completeDelivery = useCompleteDelivery();
  const { data: orderSummary, isLoading: summaryLoading } =
    useDriverDeliveryOrder(task?.type === 'delivery' ? task.id : undefined);

  if (!task) return <EmptyState />;

  const typeLabel =
    task.type === 'pickup'
      ? DRIVER_UI_TEXT.activeTaskPickupLabel
      : DRIVER_UI_TEXT.activeTaskDeliveryLabel;

  const isPending = completePickup.isPending || completeDelivery.isPending;

  const handleComplete = () => {
    const onSuccess = () => navigate(DRIVER_ROUTE.base);
    if (task.type === 'pickup') {
      completePickup.mutate(task.id, { onSuccess });
    } else {
      completeDelivery.mutate(task.id, { onSuccess });
    }
  };

  const addressLine = [
    task.address.label,
    task.address.street,
    task.address.city,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          {DRIVER_UI_TEXT.activeTaskTitle}
        </h2>
        <Badge variant="outline">{typeLabel}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base -mb-4">Customer Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{task.customerName ?? DRIVER_UI_TEXT.unavailable}</span>
          </div>
          {task.customerPhone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{task.customerPhone}</span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <span>{addressLine}</span>
          </div>
        </CardContent>
      </Card>

      {task.type === 'delivery' &&
        (summaryLoading ? (
          <Card>
            <CardContent className="py-4 text-sm text-muted-foreground">
              Loading summary…
            </CardContent>
          </Card>
        ) : orderSummary ? (
          <ItemsCard order={orderSummary} />
        ) : null)}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button size="lg" className="w-full" disabled={isPending}>
            {isPending
              ? DRIVER_UI_TEXT.activeTaskCompleting
              : DRIVER_UI_TEXT.activeTaskCompleteButton}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {DRIVER_UI_TEXT.activeTaskCompleteButton}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Confirm that you have completed this {task.type} task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
