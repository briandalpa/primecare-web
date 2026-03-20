import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminPickupRequests } from '@/hooks/useAdminPickupRequests';
import { useCreateAdminOrder } from '@/hooks/useCreateAdminOrder';
import { schema, type FormValues } from '@/features/admin/createOrderSchema';
import type { PickupRequest } from '@/types/order';

export function useCreateOrderForm() {
  const navigate = useNavigate();
  const { data: pickupData, isPending: loadingPickups } = useAdminPickupRequests();
  const pickups: PickupRequest[] = pickupData?.data ?? [];
  const { mutate, isPending } = useCreateAdminOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      pickupRequestId: '',
      totalWeightKg: 0,
      pricePerKg: 10000,
      items: [{ laundryItemId: '', quantity: 1 }],
    },
  });

  const { register, handleSubmit, control, watch, trigger, formState: { errors } } = form;
  // Dynamic item rows backed by react-hook-form's useFieldArray — append/remove
  // keep the array in sync with the form state without manual index management.
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });

  // Derived total: recalculates reactively whenever weight or price/kg changes.
  const totalPrice = (watch('totalWeightKg') || 0) * (watch('pricePerKg') || 0);
  // Resolve the full pickup request object so the form can display customer details.
  const selectedPickup = pickups.find((p) => p.id === watch('pickupRequestId'));

  const onConfirm = (values: FormValues) => {
    mutate(values, {
      onSuccess: () => {
        toast.success('Order created successfully');
        navigate('/admin/orders');
      },
      onError: () => {
        toast.error('Failed to create order');
      },
    });
  };

  return {
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
  };
}
