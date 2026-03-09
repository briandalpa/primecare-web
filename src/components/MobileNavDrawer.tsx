import { useState, useEffect } from 'react';
import { Bubbles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import type { NavLink } from '@/components/Navbar';

interface MobileNavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  navLinks: NavLink[];
  isAuthenticated: boolean;
}

function useActiveHash() {
  const [activeHash, setActiveHash] = useState(() => window.location.hash);

  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash);
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return activeHash;
}

function NavLinkItem({
  link,
  isActive,
  onClose,
}: {
  link: NavLink;
  isActive: boolean;
  onClose: () => void;
}) {
  const Icon = link.icon;
  return (
    <li>
      <a
        href={link.href}
        onClick={onClose}
        className={cn(
          'flex items-center gap-3 min-h-[3rem] px-5 py-3 text-sm font-medium transition-colors',
          'active:bg-accent/80 active:text-primary active:border-primary',
          isActive
            ? 'border-primary text-primary bg-accent/50'
            : 'border-transparent text-foreground/70',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0',
            isActive ? 'text-primary' : 'text-muted-foreground',
          )}
          aria-hidden="true"
        />
        <span className="flex-1">{link.label}</span>
      </a>
    </li>
  );
}

function NavLinkList({
  links,
  onClose,
}: {
  links: NavLink[];
  onClose: () => void;
}) {
  const activeHash = useActiveHash();
  return (
    <ul className="flex flex-col py-2">
      {links.map((link) => (
        <NavLinkItem
          key={link.label}
          link={link}
          isActive={activeHash === link.href}
          onClose={onClose}
        />
      ))}
    </ul>
  );
}

function DrawerAuthButtons({ onClose }: { onClose: () => void }) {
  return (
    <DrawerFooter className="gap-2.5 pt-4 border-t border-border/50">
      <Button
        asChild
        variant="outline"
        size="default"
        onClick={onClose}
        className="w-full"
      >
        <Link to="/login">Login</Link>
      </Button>
      <Button
        asChild
        size="default"
        onClick={onClose}
        className="w-full rounded-full"
      >
        <Link to="/register">Get Started</Link>
      </Button>
    </DrawerFooter>
  );
}

export default function MobileNavDrawer({
  open,
  onOpenChange,
  navLinks,
  isAuthenticated,
}: MobileNavDrawerProps) {
  const handleClose = () => onOpenChange(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex flex-col h-full max-w-[300px] ml-auto">
        <DrawerHeader className="flex-row items-center justify-between border-b border-border/50 pb-4 shrink-0">
          <DrawerTitle>
            <Link
              to="/"
              onClick={handleClose}
              className="flex items-center gap-2"
              aria-label="PrimeCare home"
            >
              <Bubbles className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold text-primary-dark font-heading">
                PrimeCare
              </span>
            </Link>
          </DrawerTitle>
          <DrawerClose asChild>
            <button
              aria-label="Close navigation"
              className="rounded-md p-2 active:bg-accent/80 transition-colors -mr-1"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto">
          <NavLinkList links={navLinks} onClose={handleClose} />
        </nav>

        {!isAuthenticated && <DrawerAuthButtons onClose={handleClose} />}
      </DrawerContent>
    </Drawer>
  );
}
