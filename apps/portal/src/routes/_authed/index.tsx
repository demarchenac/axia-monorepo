import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { api } from '@talvu/db'
import { Card, CardContent, CardHeader, CardTitle } from '@talvu/ui/components/card'
import { Badge } from '@talvu/ui/components/badge'
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from '@talvu/ui/components/table'
import { Button } from '@talvu/ui/components/button'
import { Users, CheckCircle2, Clock, UserPlus, Plus, ImageIcon, ImageOff } from 'lucide-react'

export const Route = createFileRoute('/_authed/')({
  component: Dashboard,
})

const statusConfig: Record<string, { className: string; label: string }> = {
  prospect: { className: 'bg-blue-500/20 text-blue-600 border-blue-500/30', label: 'prospect' },
  trial: { className: 'bg-amber-500/20 text-amber-600 border-amber-500/30', label: 'trial' },
  active: { className: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30', label: 'active' },
  past_due: { className: 'bg-red-500/20 text-red-600 border-red-500/30', label: 'past due' },
  cancelled: { className: 'bg-gray-500/20 text-gray-500 border-gray-500/30', label: 'cancelled' },
  churned: { className: 'bg-gray-500/20 text-gray-400 border-gray-500/30', label: 'churned' },
}

function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status]
  return (
    <Badge variant="outline" className={config?.className}>
      {config?.label ?? status}
    </Badge>
  )
}

function Dashboard() {
  const tenants = useQuery(api.tenants.list)

  const counts = tenants
    ? {
        total: tenants.length,
        active: tenants.filter(t => t.status === 'active').length,
        trial: tenants.filter(t => t.status === 'trial').length,
        prospect: tenants.filter(t => t.status === 'prospect').length,
      }
    : null

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Gestiona clientes y sus configuraciones</p>
        </div>
        <Link to="/tenants/new">
          <Button size="sm">
            <Plus data-icon="inline-start" className="size-3.5" />
            Nuevo tenant
          </Button>
        </Link>
      </div>

      {counts && (
        <div className="mb-6 grid gap-3 grid-cols-2 sm:grid-cols-4">
          <KpiCard icon={<Users className="size-3.5" />} label="TOTAL" value={counts.total} />
          <KpiCard icon={<CheckCircle2 className="size-3.5 text-emerald-500" />} label="ACTIVOS" value={counts.active} hint="status = active" />
          <KpiCard icon={<Clock className="size-3.5 text-amber-500" />} label="TRIAL" value={counts.trial} hint="status = trial" />
          <KpiCard icon={<UserPlus className="size-3.5 text-blue-500" />} label="PROSPECTS" value={counts.prospect} hint="status = prospect" />
        </div>
      )}

      {tenants === undefined ? (
        <div className="py-12 text-center text-xs text-muted-foreground">Cargando...</div>
      ) : tenants.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No hay tenants aún.</p>
            <Link
              to="/tenants/new"
              className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
            >
              Crear el primero
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Industria</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>País</TableHead>
                  <TableHead>Creado</TableHead>
                  <TableHead className="text-center">Logo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenants.map((t) => (
                  <TableRow key={t._id}>
                    <TableCell>
                      <Link
                        to="/tenants/$slug"
                        params={{ slug: t.slug }}
                        className="text-sm font-medium text-foreground hover:underline"
                      >
                        {t.name}
                      </Link>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">{t.slug}</TableCell>
                    <TableCell className="text-xs capitalize">{t.industry}</TableCell>
                    <TableCell><StatusBadge status={t.status} /></TableCell>
                    <TableCell className="text-xs">{t.country}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(t.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell className="text-center">
                      {t.hasRealLogo
                        ? <ImageIcon className="mx-auto size-3.5 text-emerald-500" />
                        : <ImageOff className="mx-auto size-3.5 text-muted-foreground/40" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function KpiCard({
  icon, label, value, hint,
}: {
  icon: React.ReactNode; label: string; value: number; hint?: string
}) {
  return (
    <Card>
      <CardHeader className="pb-1">
        <CardTitle className="flex items-center gap-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
          {icon} {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {hint && <p className="mt-0.5 text-[0.65rem] text-muted-foreground">{hint}</p>}
      </CardContent>
    </Card>
  )
}
