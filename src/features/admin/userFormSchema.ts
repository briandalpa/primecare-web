import { z } from 'zod';

const staffRoles = ['OUTLET_ADMIN', 'WORKER', 'DRIVER'] as const;

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address').max(64, 'Email too long'),
  role: z.enum(staffRoles, { error: 'Please select a role' }),
  outletId: z.string().optional(),
});

export const updateUserSchema = z.object({
  role: z.enum(staffRoles).optional(),
  outletId: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
