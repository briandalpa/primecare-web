import {
  LayoutDashboard,
  Store,
  ClipboardList,
  PackageSearch,
  CalendarRange,
  Users,
  Settings,
  User,
  MoreHorizontal,
  LogOut,
  MessageSquareWarning,
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import { signOut } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import logoUrl from '@/assets/prime-care.png';
import { getInitials } from '@/utils/string';

const mainNavItems = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Orders', url: '/admin/orders', icon: ClipboardList },
  { title: 'Pickup Requests', url: '/admin/pickup-requests', icon: PackageSearch },
  { title: 'Outlets', url: '/admin/outlets', icon: Store },
  { title: 'Shifts', url: '/admin/shifts', icon: CalendarRange },
  { title: 'Users', url: '/admin/users', icon: Users },
  { title: 'Complaints', url: '/admin/complaints', icon: MessageSquareWarning },
];

const accountNavItems = [
  { title: 'Settings', url: '/admin/settings', icon: Settings },
  { title: 'Profile', url: '/admin/profile', icon: User },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, effectiveRole } = useCurrentUser();

  const isActive = (url: string) =>
    url === '/admin'
      ? location.pathname === '/admin'
      : location.pathname.startsWith(url);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const roleLabel =
    effectiveRole === 'SUPER_ADMIN'
      ? 'Super Admin'
      : effectiveRole === 'OUTLET_ADMIN'
      ? 'Outlet Admin'
      : effectiveRole;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center gap-2.5 px-1 py-2 mb-4">
            <img
              src={logoUrl}
              alt="PrimeCare"
              className="h-7 w-7 rounded-lg object-contain shrink-0"
            />
            {!collapsed && (
              <span className="text-md font-bold text-primary">PrimeCare</span>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  >
                    <NavLink to={item.url} end={item.url === '/admin'}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Account</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNavItems.map((item) => (
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
                {profile?.name ?? '\u2014'}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {roleLabel}
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
