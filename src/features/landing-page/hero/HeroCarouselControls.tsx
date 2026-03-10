import { ChevronLeft, ChevronRight } from 'lucide-react';

const ARROW_CLS =
  'h-10 w-10 rounded-full bg-background/10 backdrop-blur-sm border border-background/20 flex items-center justify-center text-background/80 hover:bg-background/20 transition-colors cursor-pointer';

function CarouselDots({
  count,
  current,
  goTo,
}: {
  count: number;
  current: number;
  goTo: (i: number, d: 'next' | 'prev') => void;
}) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          onClick={() => goTo(i, i > current ? 'next' : 'prev')}
          className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${i === current ? 'w-8 bg-primary' : 'w-2 bg-background/40 hover:bg-background/60'}`}
          aria-label={`Go to slide ${i + 1}`}
        />
      ))}
    </>
  );
}

function MobileControls({
  onPrev,
  onNext,
  count,
  current,
  goTo,
}: {
  onPrev: () => void;
  onNext: () => void;
  count: number;
  current: number;
  goTo: (i: number, d: 'next' | 'prev') => void;
}) {
  return (
    <div className="absolute bottom-6 left-0 right-0 z-20 flex items-center justify-between px-4 sm:hidden">
      <button onClick={onPrev} aria-label="Previous slide" className={ARROW_CLS}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <div className="flex gap-2">
        <CarouselDots count={count} current={current} goTo={goTo} />
      </div>
      <button onClick={onNext} aria-label="Next slide" className={ARROW_CLS}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

function DesktopControls({
  onPrev,
  onNext,
  count,
  current,
  goTo,
}: {
  onPrev: () => void;
  onNext: () => void;
  count: number;
  current: number;
  goTo: (i: number, d: 'next' | 'prev') => void;
}) {
  return (
    <>
      <button
        onClick={onPrev}
        aria-label="Previous slide"
        className={`hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 ${ARROW_CLS}`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={onNext}
        aria-label="Next slide"
        className={`hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 ${ARROW_CLS}`}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
      <div className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 gap-2">
        <CarouselDots count={count} current={current} goTo={goTo} />
      </div>
    </>
  );
}

export default function HeroCarouselControls({
  count,
  current,
  goTo,
  onPrev,
  onNext,
}: {
  count: number;
  current: number;
  goTo: (i: number, d: 'next' | 'prev') => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <MobileControls onPrev={onPrev} onNext={onNext} count={count} current={current} goTo={goTo} />
      <DesktopControls onPrev={onPrev} onNext={onNext} count={count} current={current} goTo={goTo} />
    </>
  );
}
