import {
  LayoutDashboard,
  Package,
  Plus,
  MapPin,
  User,
  LogOut,
  MoreHorizontal,
  MessageSquareWarning,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { signOut } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import logoUrl from '@/assets/prime-care.png';


const mainItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'My Orders', url: '/orders', icon: Package },
  { title: 'Schedule Pickup', url: '/pickup/create', icon: Plus },
  { title: 'My Addresses', url: '/addresses', icon: MapPin },
  { title: 'My Complaints', url: '/complaints', icon: MessageSquareWarning },
  { title: 'Profile', url: '/profile', icon: User },
];

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export function CustomerSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useCurrentUser();

  const isActive = (url: string) => location.pathname.startsWith(url);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <a href="/" className="flex items-center gap-2">
          <img
            src={logoUrl}
            alt="PrimeCare"
            className="h-7 w-7 rounded-lg object-contain shrink-0"
          />
          {!collapsed && (
            <span className="text-md font-bold text-primary">PrimeCare</span>
          )}
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        {collapsed ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 mx-auto text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        ) : (
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-sidebar-accent transition-colors">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              {getInitials(profile?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {profile?.name ?? '—'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {profile?.email}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground shrink-0"
                  aria-label="User menu"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="top">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
