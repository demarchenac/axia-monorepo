import { createFileRoute, redirect, Outlet, Link, useLocation } from '@tanstack/react-router'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import { LayoutDashboard, Settings, LogOut } from 'lucide-react'

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

  return (
    <div className="flex h-screen">
      <aside className="flex w-60 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-12 items-center gap-2 border-b border-sidebar-border px-4">
          <span className="text-sm font-semibold tracking-tight">Talvu</span>
          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wider text-primary">
            admin
          </span>
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
              >
                <item.icon className="size-3.5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <div className="flex items-center gap-2.5 rounded-md px-2.5 py-1.5">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-[0.6rem] font-medium text-sidebar-primary-foreground">
              {user.firstName?.[0] ?? user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-xs font-medium">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
              </p>
              <p className="truncate text-[0.6rem] text-muted-foreground">{user.email}</p>
            </div>
            <a
              href="/api/auth/signout"
              className="text-muted-foreground transition-colors hover:text-foreground"
              title="Cerrar sesión"
            >
              <LogOut className="size-3.5" />
            </a>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
