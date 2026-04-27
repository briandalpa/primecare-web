import { z } from 'zod';
import { createShiftStartedAt, SHIFT_TIME_OPTIONS } from './shiftTimeOptions';

const isShiftStartTime = (value: string) => {
  return SHIFT_TIME_OPTIONS.some((option) => option.value === value);
};

export const createShiftSchema = z
  .object({
    staffId: z.uuid('Select a worker'),
    shiftDate: z.string().min(1, 'Shift date is required'),
    shiftStartTime: z
      .string()
      .min(1, 'Shift time is required')
      .refine(isShiftStartTime, {
        message: 'Select a valid shift time',
      }),
  })
  .transform(({ staffId, shiftDate, shiftStartTime }) => ({
    staffId,
    startedAt: createShiftStartedAt(shiftDate, shiftStartTime),
  }));

export type CreateShiftSchemaInput = z.input<typeof createShiftSchema>;
export type CreateShiftSchemaValues = z.output<typeof createShiftSchema>;
