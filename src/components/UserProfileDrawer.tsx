import { Bubbles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import DrawerUserSection from '@/components/DrawerUserSection';
import type { UserRole } from '@/utils/auth';

interface UserProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  session: {
    user: {
      name: string;
      email: string;
      avatarUrl?: string | null;
      image?: string | null;
      role: string;
    };
  } | null;
}

export default function UserProfileDrawer({
  open,
  onOpenChange,
  session,
}: UserProfileDrawerProps) {
  if (!session) return null;
  const handleClose = () => onOpenChange(false);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="left">
      <DrawerContent className="flex flex-col h-full max-w-[300px]">
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
              aria-label="Close account menu"
              className="rounded-md p-2 active:bg-accent/80 transition-colors -mr-1"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <DrawerUserSection
          name={session.user.name}
          email={session.user.email}
          avatarUrl={session.user.avatarUrl}
          image={session.user.image}
          role={session.user.role as UserRole}
          onClose={handleClose}
        />
      </DrawerContent>
    </Drawer>
  );
}
