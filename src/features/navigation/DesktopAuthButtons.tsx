import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function DesktopAuthButtons({ scrolled }: { scrolled: boolean }) {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button
        asChild
        variant="ghost"
        size="lg"
        className={cn(!scrolled && 'text-primary-foreground hover:text-primary-foreground')}
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild size="lg" className="rounded-full px-6">
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
}
