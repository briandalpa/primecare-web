import { z } from 'zod';

export const workerBypassRequestSchema = z.object({
  notes: z
    .string()
    .trim()
    .min(5, 'Please provide a short explanation for the mismatch.'),
});

export type WorkerBypassRequestFormValues = z.infer<
  typeof workerBypassRequestSchema
>;
