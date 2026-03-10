import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, LogOut } from 'lucide-react';
import { signOut } from '@/lib/auth-client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getInitials, getDashboardRoute, type UserRole } from '@/utils/auth';

interface DrawerUserSectionProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  image?: string | null;
  role: UserRole;
  onClose: () => void;
}

export default function DrawerUserSection({
  name,
  email,
  avatarUrl,
  image,
  role,
  onClose,
}: DrawerUserSectionProps) {
  const navigate = useNavigate();
  const imageSrc = avatarUrl ?? image ?? undefined;

  async function handleSignOut() {
    await signOut();
    onClose();
    navigate('/');
  }

  return (
    <div className="flex flex-col flex-1">
      <Link
        to="/profile"
        onClick={onClose}
        className="flex items-center gap-4 px-5 py-4 hover:bg-accent/50 active:bg-accent/80 transition-colors"
      >
        <Avatar size="lg" className="ring-2 ring-primary/80">
          <AvatarImage src={imageSrc} alt={name} referrerPolicy="no-referrer" />
          <AvatarFallback>{getInitials(name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-bold text-base truncate">{name}</span>
          <span className="text-sm text-muted-foreground truncate">
            {email}
          </span>
        </div>
        <ChevronRight
          className="h-5 w-5 text-muted-foreground shrink-0"
          aria-hidden="true"
        />
      </Link>

      <div className="border-t border-border/50" />

      <nav aria-label="Account navigation">
        <ul className="flex flex-col">
          {role !== 'CUSTOMER' && (
            <li>
              <Link
                to={getDashboardRoute(role)}
                onClick={onClose}
                className="flex items-center w-full px-5 py-3.5 text-sm font-medium text-foreground/80 hover:bg-accent/50 active:bg-accent/80 transition-colors"
              >
                Dashboard
              </Link>
            </li>
          )}
          {role === 'CUSTOMER' && (
            <li>
              <Link
                to="/orders"
                onClick={onClose}
                className="flex items-center w-full px-5 py-3.5 text-sm font-medium text-foreground/80 hover:bg-accent/50 active:bg-accent/80 transition-colors"
              >
                My Orders
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <button
        onClick={handleSignOut}
        className="flex items-center justify-between w-full px-5 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/10 active:bg-destructive/10 transition-colors"
      >
        Logout
        <LogOut className="h-5 w-5 text-destructive" aria-hidden="true" />
      </button>
    </div>
  );
}
