import { z } from 'zod';

const staffRoles = ['OUTLET_ADMIN', 'WORKER', 'DRIVER'] as const;
const workerTypes = ['WASHING', 'IRONING', 'PACKING'] as const;

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email address').max(64, 'Email too long'),
  role: z.enum(staffRoles, { error: 'Please select a role' }),
  outletId: z.string().uuid('Invalid outlet').optional(),
  workerType: z.enum(workerTypes).optional(),
}).superRefine((data, ctx) => {
  if (
    (data.role === 'OUTLET_ADMIN' ||
      data.role === 'WORKER' ||
      data.role === 'DRIVER') &&
    !data.outletId
  ) {
    ctx.addIssue({ code: 'custom', path: ['outletId'], message: 'Outlet ID is required for this role' });
  }
  if (data.role === 'WORKER' && !data.workerType) {
    ctx.addIssue({ code: 'custom', path: ['workerType'], message: 'Worker type is required for Worker role' });
  }
});

export const updateUserSchema = z.object({
  role: z.enum(staffRoles).optional(),
  outletId: z.string().uuid('Invalid outlet').optional(),
  isActive: z.boolean().optional(),
  workerType: z.enum(workerTypes).optional(),
}).superRefine((data, ctx) => {
  if (
    (data.role === 'OUTLET_ADMIN' ||
      data.role === 'WORKER' ||
      data.role === 'DRIVER') &&
    !data.outletId
  ) {
    ctx.addIssue({ code: 'custom', path: ['outletId'], message: 'Outlet ID is required for this role' });
  }
  if (data.role === 'WORKER' && !data.workerType) {
    ctx.addIssue({ code: 'custom', path: ['workerType'], message: 'Worker type is required for Worker role' });
  }
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;
export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;
