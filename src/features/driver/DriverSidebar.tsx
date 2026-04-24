import { History, LayoutDashboard, LogOut, MoreHorizontal, Truck, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { signOut } from '@/lib/auth-client';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { getInitials } from '@/utils/string';
import { DRIVER_COPY, DRIVER_ROUTE } from '@/utils/driver';
import logoUrl from '@/assets/prime-care.png';

const driverNavItems = [
  { title: 'Dashboard', url: DRIVER_ROUTE.base, icon: LayoutDashboard },
  { title: 'Active Order', url: DRIVER_ROUTE.active, icon: Truck },
  { title: 'Driver History', url: DRIVER_ROUTE.history, icon: History },
  { title: 'Profile', url: DRIVER_ROUTE.profile, icon: User },
];

function isNavActive(url: string, pathname: string): boolean {
  if (url === DRIVER_ROUTE.base) return pathname === DRIVER_ROUTE.base || pathname === DRIVER_ROUTE.dashboard;
  return pathname.startsWith(url);
}

function DriverSidebarBrand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="mb-4 flex items-center gap-2.5 px-1 py-2">
      <img src={logoUrl} alt="PrimeCare" className="h-7 w-7 rounded-lg object-contain shrink-0" />
      {!collapsed && <span className="text-md font-bold text-primary">PrimeCare</span>}
    </div>
  );
}

function DriverSidebarMenu({ collapsed, pathname }: { collapsed: boolean; pathname: string }) {
  return (
    <SidebarMenu>
      {driverNavItems.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton
            asChild
            isActive={isNavActive(item.url, pathname)}
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
  );
}

type DriverSidebarFooterProps = {
  collapsed: boolean;
  profileName?: string | null;
  onLogout: () => void;
};

function DriverSidebarFooter({ collapsed, profileName, onLogout }: DriverSidebarFooterProps) {
  if (collapsed) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="mx-auto h-9 w-9 text-muted-foreground hover:text-destructive"
        onClick={onLogout}
        aria-label="Logout"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-sidebar-accent">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary shrink-0">
        {getInitials(profileName)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-foreground">{profileName ?? '-'}</p>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Truck className="h-3 w-3" />
          <span>{DRIVER_COPY.driverRoleLabel}</span>
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0 text-muted-foreground" aria-label="Driver menu">
            <MoreHorizontal className="h-3.5 w-3.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="top">
          <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DriverSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const { profile } = useCurrentUser();

  const handleLogout = async () => {
    await signOut();
    navigate(DRIVER_ROUTE.home);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <DriverSidebarBrand collapsed={collapsed} />
          <SidebarGroupContent>
            <DriverSidebarMenu collapsed={collapsed} pathname={location.pathname} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <DriverSidebarFooter
          collapsed={collapsed}
          profileName={profile?.name}
          onLogout={handleLogout}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
