import { Home, Briefcase, MapPin, Star } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import type { Address } from '@/types/address';

const CARD_BASE =
  'w-full text-left rounded-lg border bg-card text-card-foreground shadow-sm cursor-pointer transition-all';

function getLabelIcon(label: string): LucideIcon {
  const lower = label.toLowerCase();
  if (lower.includes('home')) return Home;
  if (lower.includes('work') || lower.includes('office')) return Briefcase;
  return MapPin;
}

type Props = {
  addresses: Address[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

type AddressCardProps = {
  addr: Address;
  icon: LucideIcon;
  isSelected: boolean;
  onSelect: (id: string) => void;
};

function AddressCard({ addr, icon: Icon, isSelected, onSelect }: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(addr.id)}
      className={cn(CARD_BASE, isSelected ? 'ring-2 ring-primary border-primary/40' : 'hover:border-primary/30')}
    >
      <div className="flex gap-4 p-4">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-full', isSelected ? 'bg-primary/20' : 'bg-primary/10')}>
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-foreground text-sm">{addr.label}</span>
            {addr.isPrimary && (
              <Badge className="text-xs bg-primary/15 text-primary border-primary/30 gap-1">
                <Star className="h-3 w-3 fill-primary" /> Primary
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.province}</p>
        </div>
        <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 mt-2.5 transition-colors', isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/30')}>
          {isSelected && <div className="h-2 w-2 rounded-full bg-primary-foreground" />}
        </div>
      </div>
    </button>
  );
}

export default function PickupAddressSelector({ addresses, selectedId, onSelect }: Props) {
  return (
    <div className="mb-8">
      <Label className="text-base font-semibold flex items-center gap-2 mb-3">
        <MapPin className="h-4 w-4 text-primary" /> Select Pickup Address
      </Label>
      {addresses.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground text-sm">No saved addresses.</p>
            <Button variant="link" className="mt-1" asChild>
              <Link to="/addresses">Add an address first →</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              icon={getLabelIcon(addr.label)}
              isSelected={selectedId === addr.id}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
