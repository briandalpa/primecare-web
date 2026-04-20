import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function DesktopAuthButtons({
  scrolled,
}: {
  scrolled: boolean;
}) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button
        asChild
        variant="link"
        size="lg"
        className={cn(
          'hover:no-underline',
          !scrolled
            ? 'text-primary-foreground/80 hover:text-primary-foreground'
            : 'text-foreground/70 hover:text-primary',
        )}
      >
        <Link to="/auth/login">Login</Link>
      </Button>
      <Button asChild size="lg" className="rounded-full px-6">
        <Link to="/auth/register">Register</Link>
      </Button>
    </div>
  );
}
