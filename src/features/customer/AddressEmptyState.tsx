import { MapPin, Plus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type Props = { onAdd: () => void };

export function AddressEmptyState({ onAdd }: Props) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <MapPin className="h-10 w-10 text-muted-foreground/40 mb-3" />
        <p className="text-muted-foreground font-medium">No addresses yet</p>
        <Button
          onClick={onAdd}
          variant="outline"
          className="rounded-full gap-2 mt-4"
        >
          <Plus className="h-4 w-4" /> Add Address
        </Button>
      </CardContent>
    </Card>
  );
}
