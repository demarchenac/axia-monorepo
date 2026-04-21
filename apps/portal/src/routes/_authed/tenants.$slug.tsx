import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/tenants/$slug')({
  component: TenantDetail,
})

const statusOptions = ['prospect', 'trial', 'active', 'past_due', 'cancelled', 'churned'] as const

function TenantDetail() {
  const { slug } = Route.useParams()
  const tenant = useQuery(api.tenants.getBySlug, { slug })
  const updateTenant = useMutation(api.tenants.update)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  if (tenant === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando...</div>
  }
  if (tenant === null) {
    return <div className="p-8 text-sm text-muted-foreground">Tenant no encontrado.</div>
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!tenant) return
    setSaving(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)

    try {
      await updateTenant({
        id: tenant._id,
        name: (fd.get('name') as string).trim(),
        email: (fd.get('email') as string).trim(),
        phone: (fd.get('phone') as string).trim(),
        industry: (fd.get('industry') as string).trim(),
        country: (fd.get('country') as string).trim(),
        status: fd.get('status') as typeof statusOptions[number],
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          &larr; Tenants
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-semibold tracking-tight">{tenant.name}</h1>
      </div>

      <div className="mb-6 flex gap-2">
        <Link
          to="/tenants/$slug/presets"
          params={{ slug }}
          className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Presets
        </Link>
        <a
          href={`http://localhost:3000/${slug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Ver landing &nearr;
        </a>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre" name="name" defaultValue={tenant.name} required />
        <Field label="Slug" name="slug" defaultValue={tenant.slug} disabled />
        <Field label="Industria" name="industry" defaultValue={tenant.industry} required />
        <Field label="Email" name="email" type="email" defaultValue={tenant.email} required />
        <Field label="Teléfono" name="phone" defaultValue={tenant.phone} required />
        <Field label="País" name="country" defaultValue={tenant.country} required />

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={tenant.status}
            className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          {saved && <span className="text-sm text-emerald-600">Guardado</span>}
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  defaultValue,
  required,
  disabled,
}: {
  label: string
  name: string
  type?: string
  defaultValue?: string
  required?: boolean
  disabled?: boolean
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        disabled={disabled}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )
}
