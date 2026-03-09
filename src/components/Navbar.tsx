import { useState, useEffect } from 'react';
import {
  Menu,
  X,
  Shirt,
  Tag,
  ListOrdered,
  MapPin,
  HelpCircle,
  Bubbles,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import MobileNavDrawer from '@/components/MobileNavDrawer';

export interface NavLink {
  label: string;
  href: string;
  icon: LucideIcon;
}

const navLinks: NavLink[] = [
  { label: 'Services', href: '#services', icon: Shirt },
  { label: 'Pricing', href: '#pricing', icon: Tag },
  { label: 'How It Works', href: '#how-it-works', icon: ListOrdered },
  { label: 'Outlets', href: '#outlets', icon: MapPin },
  { label: 'FAQ', href: '#faq', icon: HelpCircle },
];

function DesktopNavLinks() {
  return (
    <ul className="hidden md:flex items-center gap-8 list-none">
      {navLinks.map((link) => (
        <li key={link.label}>
          <a
            href={link.href}
            className="text-sm font-medium text-foreground/70 hover:text-primary transition-colors"
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function DesktopAuthButtons() {
  return (
    <div className="hidden md:flex items-center gap-3">
      <Button asChild variant="ghost" size="lg">
        <Link to="/login">Login</Link>
      </Button>
      <Button asChild size="lg" className="rounded-full px-6">
        <Link to="/register">Register</Link>
      </Button>
    </div>
  );
}

function MobileMenuButton({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="md:hidden p-2 rounded-md active:bg-accent/80 transition-colors"
      aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
      aria-expanded={open}
      onClick={onClick}
    >
      {open ? (
        <X className="h-6 w-6 text-foreground" />
      ) : (
        <Menu className="h-6 w-6 text-foreground" />
      )}
    </button>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <nav
        aria-label="Main navigation"
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-background/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent',
        )}
      >
        <div className="container mx-auto px-4 grid grid-cols-3 items-center h-16 md:h-20 md:flex md:items-center md:gap-8">
          {/* Left slot: reserved for profile button (added after auth feature) */}
          <div className="md:hidden" />

          <Link
            to="/"
            className="flex items-center gap-2 justify-self-center md:justify-self-auto"
          >
            <Bubbles className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-primary-dark font-heading">
              PrimeCare
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <DesktopNavLinks />
          </div>

          <div className="flex items-center justify-end gap-3">
            <DesktopAuthButtons />
            <MobileMenuButton
              open={drawerOpen}
              onClick={() => setDrawerOpen(true)}
            />
          </div>
        </div>
      </nav>

      <MobileNavDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        navLinks={navLinks}
      />
    </>
  );
}
