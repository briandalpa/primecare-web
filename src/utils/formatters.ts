export function formatOrderId(id: string | undefined): string {
  return (id ?? '').slice(0, 8).toUpperCase();
}
