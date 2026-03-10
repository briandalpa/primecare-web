import { z } from 'zod';

export const adminLoginSchema = z.object({
  email: z.email({ message: 'Invalid email address' }).max(64),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;
export type AdminLoginFormErrors = Partial<
  Record<keyof AdminLoginFormValues, string>
>;
