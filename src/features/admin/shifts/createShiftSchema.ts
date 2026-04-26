import { z } from 'zod';

const SHIFT_START_TIMES = {
  SHIFT_1: '07:00',
  SHIFT_2: '13:00',
  SHIFT_3: '15:00',
} as const;

export const createShiftSchema = z.object({
  staffId: z.uuid('Select a worker'),
  shiftDate: z.string().min(1, 'Shift date is required'),
  shiftSlot: z.enum(['SHIFT_1', 'SHIFT_2', 'SHIFT_3'], 'Select a shift time'),
}).transform((value) => {
  const startedAt = new Date(`${value.shiftDate}T${SHIFT_START_TIMES[value.shiftSlot]}`);
  return {
    staffId: value.staffId,
    startedAt: startedAt.toISOString(),
  };
});

export type CreateShiftSchemaInput = z.input<typeof createShiftSchema>;
export type CreateShiftSchemaValues = z.output<typeof createShiftSchema>;
