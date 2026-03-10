import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/lib/auth-client';
import { SLIDES, CAROUSEL_INTERVAL, useHeroCarousel } from './hero-data';
import HeroBackground from './HeroBackground';
import { SlideBadge, SlideHeading } from './HeroSlideContent';
import HeroCTAs from './HeroCTAs';
import HeroStats from './HeroStats';
import HeroCarouselControls from './HeroCarouselControls';

export default function HeroSection() {
  const navigate = useNavigate();
  const { data: session } = useSession();
  const { current, isTransitioning, direction, goTo, next, prev } = useHeroCarousel(SLIDES.length);

  useEffect(() => {
    const t = setInterval(next, CAROUSEL_INTERVAL);
    return () => clearInterval(t);
  }, [next]);

  const slide = SLIDES[current];
  const nextIdx =
    direction === 'next'
      ? (current + 1) % SLIDES.length
      : (current - 1 + SLIDES.length) % SLIDES.length;

  return (
    <section aria-label="Hero" className="relative min-h-[85vh] flex items-center overflow-hidden">
      <HeroBackground
        current={current}
        nextIdx={nextIdx}
        isTransitioning={isTransitioning}
        direction={direction}
      />
      <div className="container mx-auto relative z-10 pt-24 pb-16 px-4">
        <div className="max-w-xl">
          <SlideBadge key={`badge-${current}`} text={slide.badge} />
          <SlideHeading key={`heading-${current}`} text={slide.heading} highlight={slide.highlightWord} />
          <p
            key={`sub-${current}`}
            className="text-base md:text-lg text-background/70 mb-10 max-w-md leading-relaxed animate-fade-in"
            style={{ animationDelay: '200ms', animationFillMode: 'both' }}
          >
            {slide.subtext}
          </p>
          <HeroCTAs
            key={`cta-${current}`}
            onSchedule={() => navigate(session ? '/pickup/create' : '/auth/login')}
          />
          <HeroStats />
        </div>
      </div>
      <HeroCarouselControls
        count={SLIDES.length}
        current={current}
        goTo={goTo}
        onPrev={prev}
        onNext={() => goTo((current + 1) % SLIDES.length, 'next')}
      />
    </section>
  );
}
