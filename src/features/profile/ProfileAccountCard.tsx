import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Calendar } from 'lucide-react';
import { DetailRow } from './ProfileFields';
import type { ProfileData } from '@/types/profile';

interface Props {
  profile: ProfileData;
  extraReadonly: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }[];
}

export default function ProfileAccountCard({ profile, extraReadonly }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">Account</h3>
        </div>
        <Separator />
        <div className="divide-y divide-border">
          <DetailRow
            icon={Shield}
            label="Status"
            value={profile.verified ? 'Verified' : 'Pending verification'}
          />
          <DetailRow
            icon={Calendar}
            label="Member Since"
            value={profile.memberSince ?? 'March 2026'}
          />
          {extraReadonly.map((r) => (
            <DetailRow key={r.label} icon={r.icon} label={r.label} value={r.value} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
