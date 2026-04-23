import { ChevronRight, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import type { OrderStatus } from '@/types/enums';
import { getStatusSteps } from '@/utils/orderStatus';
import { cn } from '@/lib/utils';

export default function StatusTimelineDrawer({ status }: { status: OrderStatus }) {
  const steps = getStatusSteps(status);
  const activeStep = steps.find((s) => s.active);
  const completedCount = steps.filter((s) => s.completed).length;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-5 w-5 rounded-full border-2 border-primary bg-primary/20 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-primary truncate">
                {activeStep?.label ?? 'Completed'}
              </p>
              <p className="text-xs text-muted-foreground">
                {completedCount} of {steps.length} steps completed
              </p>
            </div>
          </div>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0 text-xs gap-1 px-2">
                View Timeline <ChevronRight className="h-3 w-3" />
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Order Timeline</DrawerTitle>
              </DrawerHeader>
              <div className="px-4 pb-8 overflow-y-auto max-h-[70vh] space-y-0">
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
                        <div
                          className={cn('w-0.5 h-6', step.completed ? 'bg-primary' : 'bg-border')}
                        />
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
            </DrawerContent>
          </Drawer>
        </div>
      </CardContent>
    </Card>
  );
}
