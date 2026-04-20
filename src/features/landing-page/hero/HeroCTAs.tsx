import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

function scrollToPricing() {
  document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
}

export default function HeroCTAs({ onSchedule }: { onSchedule: () => void }) {
  return (
    <div
      className="flex flex-col sm:flex-row gap-3 animate-fade-in"
      style={{ animationDelay: '300ms', animationFillMode: 'both' }}
    >
      <Button size="lg" className="rounded-full text-base font-semibold" onClick={onSchedule}>
        Schedule Pickup <ArrowRight className="h-5 w-5" />
      </Button>
      <Button
        variant="outline"
        size="lg"
        className="rounded-full px-8 text-base font-semibold border-background/20 text-background hover:text-background bg-background/10 backdrop-blur-sm hover:bg-background/20"
        onClick={scrollToPricing}
      >
        View Pricing
      </Button>
    </div>
  );
}
