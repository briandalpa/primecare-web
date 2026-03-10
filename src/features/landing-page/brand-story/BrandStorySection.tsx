import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import familyImage from '@/assets/family-time.jpg';

export default function BrandStorySection() {
  return (
    <section className="py-20 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-2xl overflow-hidden aspect-4/3">
            <img
              src={familyImage}
              alt="Family spending quality time together"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-primary-dark/30 to-transparent" />
          </div>

          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">
              Our Mission
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading mb-4 leading-tight">
              More Time for
              <br />
              What Matters
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We started PrimeCare with a simple belief: nobody should spend
              their precious free time doing laundry. Our professional team
              handles everything — from gentle wash to crisp ironing — so you
              can focus on family, work, and the moments that truly count.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With 15+ outlets across the city and a fleet of dedicated drivers,
              we bring convenience right to your doorstep.
            </p>
            <Button className="rounded-full px-8" size="lg">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
