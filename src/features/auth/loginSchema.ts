import { z } from 'zod';

export const loginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }).max(64),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type LoginFormErrors = Partial<Record<keyof LoginFormValues, string>>;
