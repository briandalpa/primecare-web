import { MapPin, Pencil, Trash2, Star, Briefcase, Home } from 'lucide-react';
import { toTitleCase } from '@/utils/string';
import type { Address } from '@/types/address';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

function getLabelIcon(label: string) {
  const lower = label.toLowerCase();
  if (lower.includes('home')) return Home;
  if (lower.includes('work') || lower.includes('office')) return Briefcase;
  return MapPin;
}

type Props = {
  addresses: Address[];
  onEdit: (a: Address) => void;
  onDelete: (id: string) => void;
  onSetPrimary: (id: string) => void;
};

export function AddressList({
  addresses,
  onEdit,
  onDelete,
  onSetPrimary,
}: Props) {
  return (
    <ul className="grid gap-4">
      {addresses.map((addr) => {
        const Icon = getLabelIcon(addr.label);
        return (
          <li key={addr.id}>
            <Card
              className={
                addr.isPrimary ? 'ring-2 ring-primary/30 border-primary/40' : ''
              }
            >
              <CardContent className="flex gap-4 px-6 py-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    addr.isPrimary ? 'bg-primary/20' : 'bg-primary/10'
                  }`}
                >
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">
                      {addr.label}
                    </span>
                    {addr.isPrimary && (
                      <Badge className="text-xs bg-primary/15 text-primary border-primary/30 gap-1">
                        <Star className="h-3 w-3 fill-primary" /> Primary
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {addr.street}, {toTitleCase(addr.city)}, {toTitleCase(addr.province)}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    ({addr.latitude}, {addr.longitude})
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    {!addr.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs gap-1.5 rounded-full"
                        onClick={() => onSetPrimary(addr.id)}
                      >
                        <Star className="h-3 w-3" /> Set as Primary
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1"
                      onClick={() => onEdit(addr)}
                    >
                      <Pencil className="h-3 w-3" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                      onClick={() => onDelete(addr.id)}
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </li>
        );
      })}
    </ul>
  );
}
