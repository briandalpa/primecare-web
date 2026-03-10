import { IMAGES } from './hero-data';

type Direction = 'next' | 'prev';

function getSlideAnimClass(
  isTransitioning: boolean,
  isActive: boolean,
  isNext: boolean,
  direction: Direction,
): string {
  if (isTransitioning && isActive)
    return direction === 'next'
      ? 'animate-slide-to-left'
      : 'animate-[slide-from-right_0.7s_ease-in-out_reverse]';
  if (isNext)
    return direction === 'next'
      ? 'animate-slide-from-right'
      : 'animate-[slide-to-left_0.7s_ease-in-out_reverse]';
  return '';
}

export default function HeroBackground({
  current,
  nextIdx,
  isTransitioning,
  direction,
}: {
  current: number;
  nextIdx: number;
  isTransitioning: boolean;
  direction: Direction;
}) {
  return (
    <>
      {IMAGES.map((img, i) => {
        const isActive = i === current;
        const isNext = isTransitioning && i === nextIdx;
        const animClass = getSlideAnimClass(isTransitioning, isActive, isNext, direction);
        return (
          <div
            key={i}
            className={`absolute inset-0 z-0 transition-none ${isActive || isNext ? 'block' : 'hidden'} ${animClass}`}
          >
            <img src={img} alt="" className="w-full h-full object-cover animate-ken-burns" />
            <div className="absolute inset-0 bg-linear-to-r from-foreground/90 via-foreground/65 to-foreground/25" />
          </div>
        );
      })}
    </>
  );
}
