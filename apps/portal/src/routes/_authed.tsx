import { createFileRoute, redirect, Outlet, Link, useLocation } from '@tanstack/react-router'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import { LayoutDashboard, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { useTheme } from '@talvu/ui/hooks/use-theme'
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from '@talvu/ui/components/sidebar'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async () => {
    const { user } = await getAuth()
    if (!user) {
      throw redirect({ to: '/sign-in' })
    }
    return { user }
  },
  component: AuthedLayout,
})

const navItems = [
  { to: '/' as const, label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/' || p.startsWith('/tenants') },
  { to: '/' as const, label: 'Settings', icon: Settings, match: (p: string) => p.startsWith('/settings'), disabled: true },
]

function AuthedLayout() {
  const { user } = Route.useRouteContext()
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                  T
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Talvu</span>
                  <span className="truncate text-xs text-muted-foreground">admin</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const isActive = item.match(location.pathname)
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        render={<Link to={item.to} disabled={item.disabled} />}
                        isActive={isActive}
                        tooltip={item.label}
                        disabled={item.disabled}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[0.6rem] font-medium text-sidebar-primary-foreground">
                  {user.firstName?.[0] ?? user.email[0].toUpperCase()}
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold text-xs">
                    {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
                  </span>
                  <span className="truncate text-[0.6rem] text-muted-foreground">{user.email}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarSeparator />
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} onClick={toggleTheme}>
                {theme === 'dark' ? <Sun /> : <Moon />}
                <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Cerrar sesión" render={<a href="/api/auth/signout" />}>
                <LogOut />
                <span>Cerrar sesión</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex flex-col h-svh overflow-hidden">
        <header className="flex h-10 shrink-0 items-center border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
