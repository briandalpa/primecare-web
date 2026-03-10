import { useState, useEffect } from 'react';
import primeCareLogo from '@/assets/prime-care.png';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useSession } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getInitials } from '@/utils/auth';
import MobileNavDrawer from '@/features/navigation/MobileNavDrawer';
import UserProfileDrawer from '@/features/navigation/UserProfileDrawer';
import NavUserMenu from '@/features/navigation/NavUserMenu';
import DesktopNavLinks from '@/features/navigation/DesktopNavLinks';
import DesktopAuthButtons from '@/features/navigation/DesktopAuthButtons';
import MobileMenuButton from '@/features/navigation/MobileMenuButton';
import { navLinks } from '@/features/navigation/nav-links';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const { data: session } = useSession();
  const { profile, effectiveRole, isPending } = useCurrentUser();

  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => setScrolled(window.scrollY > 20));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
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
          {/* Left slot: avatar button on mobile that opens the profile drawer */}
          <div className="md:hidden">
            {session && (
              <button
                aria-label="Open account menu"
                onClick={() => setProfileDrawerOpen(true)}
                className="p-1 rounded-full active:bg-accent/80 transition-colors cursor-pointer"
              >
                <Avatar
                  size="sm"
                  className={cn(
                    'ring-2',
                    scrolled ? 'ring-primary' : 'ring-primary-foreground',
                  )}
                >
                  <AvatarImage
                    src={
                      profile?.avatarUrl ?? session?.user?.image ?? undefined
                    }
                    alt={session?.user?.name ?? 'User'}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>
                    {getInitials(session?.user?.name ?? '')}
                  </AvatarFallback>
                </Avatar>
              </button>
            )}
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 justify-self-center md:justify-self-auto md:flex-1"
          >
            <img
              src={primeCareLogo}
              alt="PrimeCare"
              className="h-7 w-7 object-contain -mx-1"
            />
            <span
              className={cn(
                'text-xl font-bold font-heading',
                scrolled ? 'text-primary-dark' : 'text-primary-foreground',
              )}
            >
              PrimeCare
            </span>
          </Link>

          <div className="hidden md:flex flex-1 justify-center">
            <DesktopNavLinks scrolled={scrolled} />
          </div>

          <div className="flex items-center justify-end gap-3 md:flex-1">
            {isPending ? null : session ? (
              <NavUserMenu
                name={session?.user?.name ?? ''}
                email={session?.user?.email ?? ''}
                avatarUrl={
                  profile?.avatarUrl ?? session?.user?.image ?? undefined
                }
                role={effectiveRole}
                scrolled={scrolled}
              />
            ) : (
              <DesktopAuthButtons scrolled={scrolled} />
            )}
            <MobileMenuButton
              open={navDrawerOpen}
              onClick={() => setNavDrawerOpen(true)}
              scrolled={scrolled}
            />
          </div>
        </div>
      </nav>

      <MobileNavDrawer
        open={navDrawerOpen}
        onOpenChange={setNavDrawerOpen}
        navLinks={navLinks}
        isAuthenticated={!!session}
      />
      <UserProfileDrawer
        open={profileDrawerOpen}
        onOpenChange={setProfileDrawerOpen}
        session={
          session ? { user: { ...session.user, role: effectiveRole } } : null
        }
      />
    </>
  );
}
