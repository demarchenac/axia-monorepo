import { createFileRoute, redirect, Outlet, Link, useLocation } from '@tanstack/react-router'
import { getAuth } from '@workos/authkit-tanstack-react-start'
import { LayoutDashboard, Users, LogOut } from 'lucide-react'

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

function AuthedLayout() {
  const { user } = Route.useRouteContext()
  const location = useLocation()

  const navItems = [
    { to: '/' as const, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/' as const, label: 'Tenants', icon: Users },
  ]

  return (
    <div className="flex h-screen">
      <aside className="flex w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
        <div className="flex h-14 items-center border-b border-sidebar-border px-4">
          <span className="text-lg font-semibold tracking-tight">Talvu</span>
          <span className="ml-2 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
            admin
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.label}
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                }`}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-3 rounded-md px-3 py-2">
            <div className="flex size-8 items-center justify-center rounded-full bg-sidebar-primary text-xs font-medium text-sidebar-primary-foreground">
              {user.firstName?.[0] ?? user.email[0].toUpperCase()}
            </div>
            <div className="flex-1 truncate">
              <p className="truncate text-sm font-medium">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ''}`.trim() : user.email}
              </p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <a
              href="/api/auth/signout"
              className="text-muted-foreground transition-colors hover:text-foreground"
              title="Cerrar sesión"
            >
              <LogOut className="size-4" />
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
