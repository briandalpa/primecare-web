import { z } from 'zod';

export const schema = z.object({
  pickupRequestId: z.string().min(1, 'Select a pickup request'),
  totalWeightKg: z.coerce.number().min(0.1, 'Min 0.1 kg').max(100, 'Max 100 kg'),
  pricePerKg: z.coerce.number().min(1, 'Required'),
  items: z
    .array(
      z.object({
        laundryItemId: z.string().uuid('Select an item'),
        quantity: z.coerce.number().int().min(1, 'Min 1'),
      }),
    )
    .min(1, 'At least one item required'),
  manualItems: z
    .array(
      z.object({
        name: z.string().trim().min(2, 'Min 2 characters').max(80, 'Max 80 characters'),
        quantity: z.coerce.number().int().min(1, 'Min 1'),
        unitPrice: z.coerce.number().min(1, 'Required'),
      }),
    )
    .default([]),
});

export type FormValues = z.infer<typeof schema>;
