import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ message: 'Name is required' })
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be under 100 characters' }),
  email: z
    .string({ message: 'Email is required' })
    .email({ message: 'Invalid email address' })
    .max(64, { message: 'Email must be under 64 characters' }),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type RegisterFormErrors = Partial<
  Record<keyof RegisterFormValues, string>
>;
