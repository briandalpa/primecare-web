import { Sparkles } from 'lucide-react';

export function SlideBadge({ text }: { text: string }) {
  return (
    <div
      className="inline-flex items-center gap-1.5 rounded-full bg-background/10 border border-background/20 px-3 py-1 mb-8 animate-fade-in"
      style={{ animationDelay: '0ms', animationFillMode: 'both' }}
    >
      <Sparkles className="h-3.5 w-3.5 text-primary" />
      <span className="text-xs font-medium text-background/90 tracking-wide">{text}</span>
    </div>
  );
}

export function SlideHeading({ text, highlight }: { text: string; highlight: string }) {
  const parts = text.split(highlight);
  return (
    <h1
      className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-background leading-[1.1] mb-6 font-heading animate-fade-in"
      style={{ animationDelay: '100ms', animationFillMode: 'both' }}
    >
      {parts[0]}
      <span className="text-primary">{highlight}</span>
    </h1>
  );
}
