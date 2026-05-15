import { createFileRoute, redirect, Outlet, Link, useLocation } from '@tanstack/react-router'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import { LayoutDashboard, Settings, LogOut, Moon, Sun, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useTheme } from '@talvu/ui/hooks/use-theme'
import { useState } from 'react'

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
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen">
      <aside className={`flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-200 ${collapsed ? 'w-14' : 'w-60'}`}>
        <div className="flex h-12 items-center justify-between border-b border-sidebar-border px-3">
          {!collapsed && (
            <>
              <span className="text-sm font-semibold tracking-tight">Talvu</span>
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-primary">
                admin
              </span>
            </>
          )}
          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="text-sidebar-foreground/60 transition-colors hover:text-sidebar-foreground"
            title={collapsed ? 'Expandir' : 'Colapsar'}
          >
            {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 p-2">
          {navItems.map((item) => {
            const isActive = item.match(location.pathname)
            return (
              <Link
                key={item.label}
                to={item.to}
                disabled={item.disabled}
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  item.disabled
                    ? 'pointer-events-none text-sidebar-foreground/30'
                    : isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="size-3.5 shrink-0" />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <div className={`flex items-center rounded-md px-2.5 py-1.5 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[0.6rem] font-medium text-sidebar-primary-foreground">
              {user.firstName?.[0] ?? user.email[0].toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 truncate">
                <p className="truncate text-xs font-medium">
                  {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
                </p>
                <p className="truncate text-[0.6rem] text-muted-foreground">{user.email}</p>
              </div>
            )}
            {!collapsed && (
              <>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                >
                  {theme === 'dark' ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
                </button>
                <a
                  href="/api/auth/signout"
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  title="Cerrar sesión"
                >
                  <LogOut className="size-3.5" />
                </a>
              </>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
