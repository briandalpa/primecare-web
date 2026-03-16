import { useState } from 'react';
import { Pencil, X, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditableFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  validate: (v: string) => {
    success: boolean;
    error?: { errors: { message: string }[] };
  };
  onSave: (v: string) => void;
}

export function EditableField({
  icon: Icon,
  label,
  value,
  type = 'text',
  placeholder,
  validate,
  onSave,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');

  const startEdit = () => {
    setDraft(value);
    setError('');
    setEditing(true);
  };
  const cancel = () => {
    setEditing(false);
    setError('');
  };

  const save = () => {
    const result = validate(draft);
    if (!result.success) {
      setError(result.error?.errors[0]?.message ?? 'Invalid');
      return;
    }
    onSave(draft.trim());
    setEditing(false);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancel();
  };

  if (editing) {
    return (
      <div className="px-6 py-3">
        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
        <div className="flex items-center gap-2">
          <Input
            autoFocus
            type={type}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            maxLength={255}
            className={`h-9 text-sm ${error ? 'border-destructive' : ''}`}
          />
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={cancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-8 w-8 shrink-0" onClick={save}>
            <Check className="h-4 w-4" />
          </Button>
        </div>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 px-6 py-3.5 group">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">
          {value || (
            <span className="text-muted-foreground/60 italic">
              {placeholder ?? '—'}
            </span>
          )}
        </p>
      </div>
      <button
        onClick={startEdit}
        className="h-7 w-7 flex items-center justify-center rounded-md opacity-0 group-hover:opacity-100 hover:bg-muted transition-all"
        aria-label={`Edit ${label}`}
      >
        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
      </button>
    </div>
  );
}

export function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-3.5">
      <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
