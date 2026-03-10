import { useState, useCallback } from 'react';
import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';

export const SLIDES = [
  {
    badge: '#1 Laundry Service in Town',
    heading: 'Fresh Clothes, Zero Hassle.',
    highlightWord: 'Zero Hassle.',
    subtext:
      'Professional laundry & dry cleaning picked up and delivered to your door.',
  },
  {
    badge: 'Premium Dry Cleaning',
    heading: 'Expert Care for Every Fabric.',
    highlightWord: 'Every Fabric.',
    subtext:
      'From delicate silks to everyday wear — specialists treat every garment with precision.',
  },
  {
    badge: 'Free Pickup & Delivery',
    heading: 'Doorstep Service, On Your Schedule.',
    highlightWord: 'On Your Schedule.',
    subtext:
      'Book a pickup in seconds. We collect, clean, and return your clothes.',
  },
];

export function useHeroCarousel(slideCount: number) {
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const goTo = useCallback(
    (index: number, dir: 'next' | 'prev') => {
      if (isTransitioning) return;
      setDirection(dir);
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrent(index);
        setIsTransitioning(false);
      }, 700);
    },
    [isTransitioning],
  );

  const next = useCallback(
    () => goTo((current + 1) % slideCount, 'next'),
    [current, goTo, slideCount],
  );
  const prev = useCallback(
    () => goTo((current - 1 + slideCount) % slideCount, 'prev'),
    [current, goTo, slideCount],
  );

  return { current, isTransitioning, direction, goTo, next, prev };
}

export const IMAGES = [heroSlide1, heroSlide2, heroSlide3];
export const CAROUSEL_INTERVAL = 5500;
export const STATS = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '15+', label: 'Outlets' },
  { value: '4.9★', label: 'Rating' },
];
