import { Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
import { Field, FieldLabel, FieldError } from '@/components/ui/field';
import OrderItemRows from '@/features/admin/OrderItemRows';
import OrderSummaryCard from '@/features/admin/OrderSummaryCard';
import { useCreateOrderForm } from '@/hooks/useCreateOrderForm';

export default function CreateOrderPage() {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    errors,
    fields,
    append,
    remove,
    totalPrice,
    selectedPickup,
    pickups,
    loadingPickups,
    isPending,
    onConfirm,
  } = useCreateOrderForm();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-bold text-foreground">Create Order</h1>

      <form className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pickup & Weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Field data-invalid={!!errors.pickupRequestId}>
              <FieldLabel>Pickup Request</FieldLabel>
              <Controller
                control={control}
                name="pickupRequestId"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingPickups ? 'Loading...' : 'Select pickup...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {pickups.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.id.slice(0, 8)} —{' '}
                          {p.customerUser?.name ?? p.customerUser?.email ?? 'Unknown'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={[errors.pickupRequestId]} />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.totalWeightKg}>
                <FieldLabel htmlFor="totalWeightKg">Weight (kg)</FieldLabel>
                <Input
                  id="totalWeightKg"
                  type="number"
                  step="any"
                  placeholder="e.g. 3.5"
                  {...register('totalWeightKg', { valueAsNumber: true })}
                />
                <FieldError errors={[errors.totalWeightKg]} />
              </Field>

              <Field data-invalid={!!errors.pricePerKg}>
                <FieldLabel htmlFor="pricePerKg">Price / kg (Rp)</FieldLabel>
                <Input
                  id="pricePerKg"
                  type="number"
                  placeholder="10000"
                  {...register('pricePerKg', { valueAsNumber: true })}
                />
                <FieldError errors={[errors.pricePerKg]} />
              </Field>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <OrderItemRows
              control={control as never}
              fields={fields}
              append={append}
              remove={remove}
              errors={errors.items as never}
            />
          </CardContent>
        </Card>

        <OrderSummaryCard total={totalPrice} pickup={selectedPickup} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={isPending}
              onClick={() => trigger()}
            >
              {isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Order</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedPickup
                  ? `Create order for ${selectedPickup.customerUser?.name ?? 'customer'} — Rp ${totalPrice.toLocaleString('id-ID')}?`
                  : 'Please select a pickup first.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSubmit(onConfirm)} disabled={isPending}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
  );
}
