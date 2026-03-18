import { useState } from 'react';
import EditableProfilePage from '@/features/profile/EditableProfilePage';
import type { ProfileData } from '@/types/profile';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { Skeleton } from '@/components/ui/skeleton';
import PageHeader from '@/components/PageHeader';

function formatRole(role: string): string {
  return role
    .split('_')
    .map((w) => w.charAt(0) + w.slice(1).toLowerCase())
    .join(' ');
}

export default function AdminProfilePage() {
  const { profile, effectiveRole, isPending } = useCurrentUser();
  const [overrides, setOverrides] = useState<Partial<ProfileData>>({});

  const localProfile: ProfileData = {
    name: profile?.name ?? '',
    email: profile?.email ?? '',
    phone: profile?.phone ?? '',
    avatarUrl: profile?.image ?? '',
    verified: profile?.emailVerified ?? false,
    memberSince: profile?.createdAt
      ? new Date(profile.createdAt).toLocaleDateString('en-US', {
          month: 'long',
          year: 'numeric',
        })
      : '',
    ...overrides,
  };

  if (isPending) {
    return (
      <div className="max-w-2xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <PageHeader title="Profile" />
      <EditableProfilePage
        title="Admin Profile"
        subtitle="Manage your admin account"
        roleBadge={formatRole(effectiveRole)}
        profile={localProfile}
        onUpdate={(data) => setOverrides((prev) => ({ ...prev, ...data }))}
      />
    </>
  );
}
