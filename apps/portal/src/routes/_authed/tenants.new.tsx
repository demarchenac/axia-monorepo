import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@talvu/ui/components/card'
import { Input } from '@talvu/ui/components/input'
import { Label } from '@talvu/ui/components/label'
import { ArrowLeft } from 'lucide-react'

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
        defaultLocale: (fd.get('defaultLocale') as string).trim() || 'es',
        enabledLocales: (fd.get('enabledLocales') as string).split(',').map(s => s.trim()).filter(Boolean),
        status: 'prospect',
        tagline: (fd.get('tagline') as string).trim() || undefined,
        description: (fd.get('description') as string).trim() || undefined,
      })
      navigate({ to: '/tenants/$slug', params: { slug } })
    } catch (err) {
      setSaving(false)
      alert(err instanceof Error ? err.message : 'Error creando tenant')
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline size-3.5" /> Dashboard
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold tracking-tight">Nuevo Tenant</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Información básica</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Nombre" name="name" placeholder="Axia Odontología" required />
              <FormField label="Slug" name="slug" placeholder="axia" required />
              <FormField label="Industria" name="industry" placeholder="dental" required />
              <FormField label="País" name="country" placeholder="CO" defaultValue="CO" />
              <FormField label="Email" name="email" type="email" placeholder="contacto@ejemplo.com" required />
              <FormField label="Teléfono" name="phone" placeholder="573001234567" required />
              <FormField label="Locale por defecto" name="defaultLocale" defaultValue="es" />
              <FormField label="Locales habilitados" name="enabledLocales" defaultValue="es" placeholder="es, en" />
            </div>

            <FormField label="Tagline" name="tagline" placeholder="Tu sonrisa, nuestra pasión" />

            <div>
              <Label htmlFor="description" className="mb-1.5 text-xs">Descripción</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Breve descripción del negocio..."
                rows={3}
                className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {saving ? 'Creando...' : 'Crear tenant'}
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: '/' })}
                className="inline-flex h-8 items-center rounded-md border px-4 text-xs font-medium transition-colors hover:bg-muted"
              >
                Cancelar
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function FormField({
  label, name, type = 'text', placeholder, required, defaultValue,
}: {
  label: string; name: string; type?: string; placeholder?: string;
  required?: boolean; defaultValue?: string
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-1.5 text-xs">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
      />
    </div>
  )
}
