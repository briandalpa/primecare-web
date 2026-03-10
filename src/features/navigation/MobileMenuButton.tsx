import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MobileMenuButton({
  open,
  onClick,
  scrolled,
}: {
  open: boolean;
  onClick: () => void;
  scrolled: boolean;
}) {
  const iconClass = cn('h-6 w-6', scrolled ? 'text-foreground' : 'text-primary-foreground');
  return (
    <button
      className="md:hidden p-2 rounded-md active:bg-accent/80 transition-colors"
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? <X className={iconClass} /> : <Menu className={iconClass} />}
    </button>
  );
}
