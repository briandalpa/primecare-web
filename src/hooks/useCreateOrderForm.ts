import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminPickupRequests } from '@/hooks/useAdminPickupRequests';
import { useCreateAdminOrder } from '@/hooks/useCreateAdminOrder';
import { schema, type FormValues } from '@/features/admin/createOrderSchema';
import type { PickupRequest } from '@/types/order';

export function useCreateOrderForm() {
  const navigate = useNavigate();
  const { data: pickupData, isPending: loadingPickups } =
    useAdminPickupRequests();
  const pickups: PickupRequest[] = pickupData?.data ?? [];
  const { mutate, isPending } = useCreateAdminOrder();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as never,
    defaultValues: {
      pickupRequestId: '',
      totalWeightKg: 0,
      pricePerKg: 10000,
      items: [{ laundryItemId: '', quantity: 1 }],
      manualItems: [],
    },
  });

  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors },
  } = form;
  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const manualItemsArray = useFieldArray({ control, name: 'manualItems' });

  const totalWeightKg = useWatch({ control, name: 'totalWeightKg' }) || 0;
  const pricePerKg = useWatch({ control, name: 'pricePerKg' }) || 0;
  const manualItems = useWatch({ control, name: 'manualItems' }) ?? [];
  const manualTotal = manualItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0,
  );
  const weightTotal = totalWeightKg * pricePerKg;
  const totalPrice = weightTotal + manualTotal;
  const pickupRequestId = useWatch({ control, name: 'pickupRequestId' });
  const selectedPickup = pickups.find((p) => p.id === pickupRequestId);

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
    manualFields: manualItemsArray.fields,
    appendManual: manualItemsArray.append,
    removeManual: manualItemsArray.remove,
    weightTotal,
    manualTotal,
    totalPrice,
    selectedPickup,
    pickups,
    loadingPickups,
    isPending,
    onConfirm,
  };
}
