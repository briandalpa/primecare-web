import { useCurrentUser } from '@/hooks/useCurrentUser';

export default function DriverProfile() {
  const { profile, isPending } = useCurrentUser();

  if (isPending) return null;

  return (
    <div className="space-y-4 max-w-md">
      <h2 className="text-xl font-heading font-semibold">Driver Profile</h2>
      <p className="text-sm text-muted-foreground">{profile?.name ?? '—'}</p>
      <p className="text-sm text-muted-foreground">{profile?.email ?? '—'}</p>
    </div>
  );
}
