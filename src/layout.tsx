import React, { useMemo } from "react";
import { Link, useLocation } from "react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Users, FileText, Building2, Building, UserCog, ClipboardList, User, LogOut, LogIn, LayoutDashboard, Mail, Briefcase } from "lucide-react";
import { useUser } from "@blocksdiy/blocks-client-sdk/reactSdk";
import { getPageUrl, logOut } from "@/lib/utils";
import { LoginPage, AgentDashboard2Page, AgentProfilePage } from "@/product-types";
import { Button } from "@/components/ui/button";
import { isAdminRole, isOfficeRole, ADMIN_ONLY_NAV_TITLES, OFFICE_HIDDEN_NAV_TITLES, canAccessPage } from "@/utils/AccessControl";
import { AccessDenied } from "@/components/AccessDenied";

const navigationItems = [
  { title: "דף סוכן", url: getPageUrl(AgentDashboard2Page), icon: LayoutDashboard },
  { title: "ניהול לקוחות", url: "/ClientsManager", icon: Users },
  { title: "ניהול יצרנים", url: "/ProvidersManager", icon: Building },
  { title: "ניהול סוכנים", url: "/AgentsManager", icon: UserCog },
  { title: "ניהול סוגי בקשות", url: "/RequestTypesManager", icon: FileText },
  { title: "ניהול בקשות", url: "/RequestsManager", icon: ClipboardList },
  { title: "ניהול טפסים", url: "/FormsManager", icon: FileText },
  { title: "אימיילים ליצרנים", url: "/ProviderEmailsManager", icon: Mail },
  { title: "מנהל משרד", url: "/OfficeManager", icon: Briefcase },
  { title: "הפרופיל שלי", url: getPageUrl(AgentProfilePage), icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const user = useUser();
  const loginPageUrl = useMemo(() => getPageUrl(LoginPage), []);
  const userRole = user.isAuthenticated ? (user as any).role : undefined;
  const isAdmin = isAdminRole(userRole);

  const filteredNavItems = isAdmin
    ? navigationItems
    : isOfficeRole(userRole)
      ? navigationItems.filter((item) => !OFFICE_HIDDEN_NAV_TITLES.includes(item.title))
      : navigationItems.filter((item) => !ADMIN_ONLY_NAV_TITLES.includes(item.title));

  const hasAccess = canAccessPage(userRole, location.pathname);

  return (
    <SidebarProvider style={{ direction: "rtl" } as React.CSSProperties}>
      <Sidebar side="right">
        <SidebarHeader className="p-6 bg-sidebar-accent">
          <div className="flex items-center gap-2">
            <Building2 className="size-6 text-sidebar-primary" />
            <h1 className="text-xl font-bold text-sidebar-primary">מנהל ביטוח</h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {filteredNavItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.url)}>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            {user.isAuthenticated ? (
              <>
                <SidebarMenuItem>
                  <div className="flex items-center gap-2 px-2 py-2">
                    <User className="size-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName}`
                          : user.name || user.email}
                      </p>
                      {user.email && (
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      )}
                    </div>
                  </div>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton onClick={() => logOut()}>
                    <LogOut className="text-destructive" />
                    <span className="text-destructive">התנתק</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </>
            ) : (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={loginPageUrl}>
                    <LogIn />
                    <span>התחבר</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        {hasAccess ? children : <AccessDenied />}
      </SidebarInset>
    </SidebarProvider>
  );
}