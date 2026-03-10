import { cn } from '@/lib/utils';
import { navLinks } from './nav-links';

export default function DesktopNavLinks({ scrolled }: { scrolled: boolean }) {
  return (
    <ul className="hidden md:flex items-center gap-8 list-none">
      {navLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className={cn(
              'text-sm font-medium transition-colors',
              scrolled
                ? 'text-foreground/70 hover:text-primary'
                : 'text-primary-foreground/80 hover:text-primary-foreground',
            )}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}
