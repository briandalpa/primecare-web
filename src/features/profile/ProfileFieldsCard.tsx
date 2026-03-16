import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { EditableField } from './ProfileFields';
import type { ProfileField } from '@/types/profile';

interface Props {
  title: string;
  fields: ProfileField[];
  onSave: (key: string, label: string, v: string) => void;
}

export default function ProfileFieldsCard({ title, fields, onSave }: Props) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="px-6 py-4">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <Separator />
        <div className="divide-y divide-border">
          {fields.map((f) => (
            <EditableField
              key={f.key}
              icon={f.icon}
              label={f.label}
              value={f.value}
              type={f.type}
              placeholder={f.placeholder}
              validate={f.validate}
              onSave={(v) => onSave(f.key, f.label, v)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
