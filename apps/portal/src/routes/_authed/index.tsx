import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'

export const Route = createFileRoute('/_authed/')({
  component: Dashboard,
})

const statusColors: Record<string, string> = {
  prospect: 'bg-blue-100 text-blue-700',
  trial: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  past_due: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-500',
  churned: 'bg-gray-100 text-gray-400',
}

function Dashboard() {
  const tenants = useQuery(api.tenants.list)

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Tenants</h1>
          <p className="text-sm text-muted-foreground">
            Gestiona clientes y sus configuraciones
          </p>
        </div>
        <Link
          to="/tenants/new"
          className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Nuevo tenant
        </Link>
      </div>

      {tenants === undefined ? (
        <div className="py-12 text-center text-sm text-muted-foreground">Cargando...</div>
      ) : tenants.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay tenants aún.</p>
          <Link
            to="/tenants/new"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            Crear el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-4 py-3 text-left font-medium">Nombre</th>
                <th className="px-4 py-3 text-left font-medium">Slug</th>
                <th className="px-4 py-3 text-left font-medium">Industria</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-left font-medium">País</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr key={t._id} className="border-b transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link
                      to="/tenants/$slug"
                      params={{ slug: t.slug }}
                      className="font-medium text-foreground hover:underline"
                    >
                      {t.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.slug}</td>
                  <td className="px-4 py-3 capitalize">{t.industry}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[t.status] ?? 'bg-gray-100 text-gray-600'}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{t.country}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
