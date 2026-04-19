import { z } from 'zod';

export const workerProcessOrderSchema = z.object({
  items: z.array(
    z.object({
      laundryItemId: z.uuid(),
      quantity: z
        .string()
        .trim()
        .min(1, 'Quantity is required')
        .refine(
          (value) => Number.isInteger(Number(value)) && Number(value) > 0,
          'Quantity must be a positive whole number',
        ),
    }),
  ),
});

export type WorkerProcessOrderFormValues = z.infer<
  typeof workerProcessOrderSchema
>;
