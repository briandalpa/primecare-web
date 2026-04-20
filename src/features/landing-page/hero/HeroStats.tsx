import { STATS } from './hero-data';

export default function HeroStats() {
  return (
    <div
      className="flex items-center gap-0 mt-12 animate-fade-in"
      style={{ animationDelay: '450ms', animationFillMode: 'both' }}
    >
      {STATS.map((stat, i) => (
        <div key={stat.label} className={i > 0 ? 'border-l border-background/20 pl-8 ml-8' : ''}>
          <p className="text-2xl md:text-3xl font-bold text-background">{stat.value}</p>
          <p className="text-xs text-background/50 mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
