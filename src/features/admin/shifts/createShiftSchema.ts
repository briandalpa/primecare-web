import { z } from 'zod';

export const createShiftSchema = z.object({
  staffId: z.uuid('Select a worker'),
  startedAt: z
    .string()
    .min(1, 'Start time is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), {
      message: 'Start time is invalid',
    })
    .transform((value) => new Date(value).toISOString()),
});

export type CreateShiftSchemaInput = z.input<typeof createShiftSchema>;
export type CreateShiftSchemaValues = z.output<typeof createShiftSchema>;
