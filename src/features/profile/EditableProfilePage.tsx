import { useRef } from 'react';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Phone } from 'lucide-react';
import ProfileAvatarCard from './ProfileAvatarCard';
import ProfileFieldsCard from './ProfileFieldsCard';
import ProfileAccountCard from './ProfileAccountCard';
import type { ProfileData, ProfileField } from '@/types/profile';

const nameSchema = z.string().trim().min(2, 'Min 2 characters').max(100);
const emailSchema = z.email('Invalid email').max(255);
const phoneSchema = z.string().trim().max(20).optional().or(z.literal(''));

function toValidateResult(
  r: { success: true } | { success: false; error: z.ZodError },
): { success: boolean; error?: { errors: { message: string }[] } } {
  if (r.success) return { success: true };
  return { success: false, error: { errors: r.error.issues } };
}

interface Props {
  title: string;
  subtitle: string;
  roleBadge: string;
  profile: ProfileData;
  onUpdate: (data: Partial<ProfileData>) => void;
  extraFields?: ProfileField[];
  extraReadonly?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string;
  }[];
}

const EditableProfilePage = ({
  title,
  subtitle,
  roleBadge,
  profile,
  onUpdate,
  extraFields = [],
  extraReadonly = [],
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = profile.name.charAt(0).toUpperCase();

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onUpdate({ avatarUrl: reader.result as string });
      toast.success('Photo updated');
    };
    reader.readAsDataURL(file);
  };

  const baseFields: ProfileField[] = [
    {
      icon: User,
      label: 'Full Name',
      key: 'name',
      value: profile.name,
      validate: (v) => toValidateResult(nameSchema.safeParse(v)),
    },
    {
      icon: Mail,
      label: 'Email',
      key: 'email',
      value: profile.email,
      type: 'email',
      validate: (v) => toValidateResult(emailSchema.safeParse(v)),
    },
    {
      icon: Phone,
      label: 'Phone',
      key: 'phone',
      value: profile.phone ?? '',
      placeholder: 'Add phone number',
      validate: (v) => toValidateResult(phoneSchema.safeParse(v)),
    },
  ];

  const saveField = (key: string, label: string, v: string) => {
    onUpdate({ [key]: v || undefined } as Partial<ProfileData>);
    toast.success(`${label} updated`);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
      </div>
      <ProfileAvatarCard
        profile={profile}
        initials={initials}
        roleBadge={roleBadge}
        fileInputRef={fileInputRef}
        onAvatarChange={handleAvatarChange}
      />
      <ProfileFieldsCard title="Personal Information" fields={baseFields} onSave={saveField} />
      {extraFields.length > 0 && (
        <ProfileFieldsCard title="Additional Information" fields={extraFields} onSave={saveField} />
      )}
      <ProfileAccountCard profile={profile} extraReadonly={extraReadonly} />
    </div>
  );
};

export default EditableProfilePage;
