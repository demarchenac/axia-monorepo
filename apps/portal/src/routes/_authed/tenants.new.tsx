import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../../../../convex/_generated/api'
import { useState } from 'react'

export const Route = createFileRoute('/_authed/tenants/new')({
  component: NewTenant,
})

function NewTenant() {
  const navigate = useNavigate()
  const createTenant = useMutation(api.tenants.create)
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData(e.currentTarget)

    try {
      const slug = (fd.get('slug') as string).trim()
      await createTenant({
        name: (fd.get('name') as string).trim(),
        slug,
        industry: (fd.get('industry') as string).trim(),
        email: (fd.get('email') as string).trim(),
        phone: (fd.get('phone') as string).trim(),
        country: (fd.get('country') as string).trim() || 'CO',
        defaultLocale: 'es',
        enabledLocales: ['es'],
        status: 'prospect',
      })
      navigate({ to: '/tenants/$slug', params: { slug } })
    } catch (err) {
      setSaving(false)
      alert(err instanceof Error ? err.message : 'Error creando tenant')
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">Nuevo Tenant</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Nombre" name="name" placeholder="Axia Odontología" required />
        <Field label="Slug" name="slug" placeholder="axia" required />
        <Field label="Industria" name="industry" placeholder="dental" required />
        <Field label="Email" name="email" type="email" placeholder="contacto@ejemplo.com" required />
        <Field label="Teléfono" name="phone" placeholder="573001234567" required />
        <Field label="País" name="country" placeholder="CO" />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-9 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {saving ? 'Creando...' : 'Crear tenant'}
          </button>
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            className="inline-flex h-9 items-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
  defaultValue,
}: {
  label: string
  name: string
  type?: string
  placeholder?: string
  required?: boolean
  defaultValue?: string
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
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none transition-colors focus:border-ring focus:ring-2 focus:ring-ring/50"
      />
    </div>
  )
}
