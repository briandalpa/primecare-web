import { Link, useNavigate } from 'react-router-dom';
import { User, LayoutDashboard, Package, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { signOut } from '@/lib/auth-client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { getInitials, getDashboardRoute, type UserRole } from '@/utils/auth';

interface NavUserMenuProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
  image?: string | null;
  role: UserRole;
  scrolled: boolean;
}

export default function NavUserMenu({
  name,
  email,
  avatarUrl,
  image,
  role,
  scrolled,
}: NavUserMenuProps) {
  const navigate = useNavigate();
  const imageSrc = avatarUrl ?? image ?? undefined;

  async function handleSignOut() {
    try {
      await signOut();
      toast.success('Logged out', { description: 'See you next time!' });
      navigate('/');
    } catch {
      toast.error('Logout failed', { description: 'Please try again.' });
    }
  }

  return (
    <div className="hidden md:block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Open account menu"
            className={cn(
              'rounded-full p-0.5 ring-2 transition-all cursor-pointer',
              scrolled
                ? 'ring-primary hover:ring-primary/70 active:ring-primary'
                : 'ring-primary-foreground hover:ring-primary-foreground/70 active:ring-primary-foreground',
            )}
          >
            <Avatar size="default">
              <AvatarImage
                src={imageSrc}
                alt={name}
                referrerPolicy="no-referrer"
              />
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56 p-2">
          <DropdownMenuLabel className="flex flex-col gap-0.5">
            <p className="font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground font-normal truncate">
              {email}
            </p>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="flex items-center gap-2 cursor-pointer"
              >
                <User className="h-4 w-4" aria-hidden="true" />
                Profile
              </Link>
            </DropdownMenuItem>

            {role !== 'CUSTOMER' && (
              <DropdownMenuItem asChild>
                <Link
                  to={getDashboardRoute(role)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
            )}

            {role === 'CUSTOMER' && (
              <DropdownMenuItem asChild>
                <Link
                  to="/orders"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Package className="h-4 w-4" aria-hidden="true" />
                  My Orders
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
