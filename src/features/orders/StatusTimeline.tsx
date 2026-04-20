import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { OrderStatus } from '@/types/enums';
import { getStatusSteps } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';

export default function StatusTimeline({ status }: { status: OrderStatus }) {
  const steps = getStatusSteps(status);
  return (
    <Card className="md:col-span-1">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Status Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step.status} className="flex gap-3">
              <div className="flex flex-col items-center">
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                ) : step.active ? (
                  <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground/30 shrink-0" />
                )}
                {i < steps.length - 1 && (
                  <div className={cn('w-0.5 h-6', step.completed ? 'bg-primary' : 'bg-border')} />
                )}
              </div>
              <span
                className={cn(
                  'text-sm pb-6',
                  step.active
                    ? 'font-semibold text-primary'
                    : step.completed
                    ? 'text-foreground'
                    : 'text-muted-foreground/50',
                )}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
