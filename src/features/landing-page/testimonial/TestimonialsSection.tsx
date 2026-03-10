import { Star, Quote } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useRef, useState, useEffect } from 'react';
import type { CarouselApi } from '@/components/ui/carousel';

const testimonials = [
  {
    name: 'Sarah M.',
    role: 'Working Mom',
    text: 'PrimeCare has been a lifesaver! The pickup and delivery is always on time, and my clothes come back perfectly clean.',
    rating: 5,
  },
  {
    name: 'Andi R.',
    role: 'Business Owner',
    text: "Best laundry service I've ever used. The subscription plan saves me so much money and time every month.",
    rating: 5,
  },
  {
    name: 'Dina K.',
    role: 'Student',
    text: 'Super affordable and convenient. I love the app tracking feature — I always know where my laundry is.',
    rating: 5,
  },
  {
    name: 'Budi S.',
    role: 'Freelancer',
    text: 'The eco-friendly approach sold me. Great quality and they really care about sustainability.',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }),
  );
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;
    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap());
    api.on('select', () => setCurrent(api.selectedScrollSnap()));
  }, [api]);

  return (
    <section className="py-20 bg-surface">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground font-heading">
            What Our Customers Say
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <Carousel
            opts={{ align: 'start', loop: true }}
            plugins={[autoplayPlugin.current]}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {testimonials.map((t) => (
                <CarouselItem
                  key={t.name}
                  className="pl-4 basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <div className="h-full p-6 rounded-2xl bg-card border border-border flex flex-col">
                    <Quote className="h-8 w-8 text-primary/15 mb-4 shrink-0" />
                    <p className="text-sm text-card-foreground/80 leading-relaxed mb-6 flex-1">
                      "{t.text}"
                    </p>
                    <div>
                      <div className="flex items-center gap-0.5 mb-3">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-3.5 w-3.5 fill-warning text-warning"
                          />
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-semibold text-primary">
                            {t.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-card-foreground">
                            {t.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dot indicators */}
          {count > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: count }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => api?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === current
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-border hover:bg-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
