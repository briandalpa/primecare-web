export type UserRole =
  | 'CUSTOMER'
  | 'SUPER_ADMIN'
  | 'OUTLET_ADMIN'
  | 'WORKER'
  | 'DRIVER';

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  return trimmed[0].toUpperCase();
}

export function getDashboardRoute(role: UserRole): string {
  if (role === 'OUTLET_ADMIN' || role === 'SUPER_ADMIN') return '/admin/dashboard';
  if (role === 'WORKER') return '/worker/dashboard';
  if (role === 'DRIVER') return '/driver/dashboard';
  return '/';
}
