import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@talvu/ui/components/tabs'
import { Input } from '@talvu/ui/components/input'
import { Label } from '@talvu/ui/components/label'
import { ArrowLeft, Palette, ExternalLink, LinkIcon, Copy, Check, RotateCcw, Trash2, MapPin, PenTool } from 'lucide-react'

export const Route = createFileRoute('/_authed/tenants/$slug')({
  component: TenantDetail,
})

const statusOptions = ['prospect', 'trial', 'active', 'past_due', 'cancelled', 'churned'] as const
const taxRegimeOptions = ['simplificado', 'comun', 'no_responsable_iva', 'gran_contribuyente', 'other'] as const

function TenantDetail() {
  const { slug } = Route.useParams()
  const tenant = useQuery(api.tenants.getBySlug, { slug })

  if (tenant === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando...</div>
  }
  if (tenant === null) {
    return <div className="p-8 text-sm text-muted-foreground">Tenant no encontrado.</div>
  }

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline size-3.5" /> Tenants
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-xl font-semibold tracking-tight">{tenant.name}</h1>
      </div>

      <div className="mb-6 flex gap-2">
        <Link
          to="/tenants/$slug/presets"
          params={{ slug }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <Palette className="size-3.5" /> Presets
        </Link>
        <Link
          to="/tenants/$slug/editor"
          params={{ slug }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <PenTool className="size-3.5" /> Editor
        </Link>
        <Link
          to="/tenants/$slug/locations"
          params={{ slug }}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <MapPin className="size-3.5" /> Ubicaciones
        </Link>
        <a
          href={`http://localhost:3000/t/${slug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
        >
          <ExternalLink className="size-3.5" /> Ver landing
        </a>
      </div>

      <PreviewTokenSection slug={slug} tenant={tenant} />

      <Tabs defaultValue="general">
        <TabsList variant="line" className="mb-6 border-b pb-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="marca">Marca</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab tenant={tenant} />
        </TabsContent>
        <TabsContent value="marca">
          <MarcaTab tenant={tenant} />
        </TabsContent>
        <TabsContent value="legal">
          <LegalTab tenant={tenant} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function GeneralTab({ tenant }: { tenant: any }) {
  const updateTenant = useMutation(api.tenants.update)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
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
        defaultLocale: (fd.get('defaultLocale') as string).trim(),
        enabledLocales: (fd.get('enabledLocales') as string).split(',').map(s => s.trim()).filter(Boolean),
        hasRealLogo: fd.get('hasRealLogo') === 'on',
        hasRealPhotos: fd.get('hasRealPhotos') === 'on',
        reviewRequestsEnabled: fd.get('reviewRequestsEnabled') === 'on',
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Nombre" name="name" defaultValue={tenant.name} required />
        <FormField label="Slug" name="slug" defaultValue={tenant.slug} disabled />
        <FormField label="Industria" name="industry" defaultValue={tenant.industry} required />
        <div>
          <Label htmlFor="status" className="mb-1.5 text-xs">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={tenant.status}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <FormField label="Email" name="email" type="email" defaultValue={tenant.email} required />
        <FormField label="Teléfono" name="phone" defaultValue={tenant.phone} required />
        <FormField label="País" name="country" defaultValue={tenant.country} required />
        <FormField label="Locale por defecto" name="defaultLocale" defaultValue={tenant.defaultLocale} />
        <FormField
          label="Locales habilitados"
          name="enabledLocales"
          defaultValue={tenant.enabledLocales?.join(', ')}
          placeholder="es, en"
        />
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="hasRealLogo" defaultChecked={tenant.hasRealLogo} className="rounded" />
          Logo real
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="hasRealPhotos" defaultChecked={tenant.hasRealPhotos} className="rounded" />
          Fotos reales
        </label>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="reviewRequestsEnabled" defaultChecked={tenant.reviewRequestsEnabled} className="rounded" />
          Solicitar reseñas
        </label>
      </div>

      <SaveButton saving={saving} saved={saved} />
    </form>
  )
}

function MarcaTab({ tenant }: { tenant: any }) {
  const updateTenant = useMutation(api.tenants.update)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [color, setColor] = useState(tenant.primaryColor ?? '')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    try {
      await updateTenant({
        id: tenant._id,
        tagline: (fd.get('tagline') as string).trim() || undefined,
        description: (fd.get('description') as string).trim() || undefined,
        logoUrl: (fd.get('logoUrl') as string).trim() || undefined,
        primaryColor: (fd.get('primaryColor') as string).trim() || undefined,
        headerVariant: (fd.get('headerVariant') as string).trim() || undefined,
        footerVariant: (fd.get('footerVariant') as string).trim() || undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Tagline" name="tagline" defaultValue={tenant.tagline ?? ''} />
      <div>
        <Label htmlFor="description" className="mb-1.5 text-xs">Descripción</Label>
        <textarea
          id="description"
          name="description"
          defaultValue={tenant.description ?? ''}
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-2.5 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        />
      </div>
      <FormField label="Logo URL" name="logoUrl" defaultValue={tenant.logoUrl ?? ''} placeholder="https://..." />
      <div>
        <Label htmlFor="primaryColor" className="mb-1.5 text-xs">Color primario</Label>
        <div className="flex gap-2">
          <Input
            id="primaryColor"
            name="primaryColor"
            defaultValue={tenant.primaryColor ?? ''}
            placeholder="#1e5fa0"
            onChange={e => setColor(e.target.value)}
          />
          <div
            className="size-9 shrink-0 rounded-md border"
            style={{ background: color || '#e5e5e5' }}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Header variant" name="headerVariant" defaultValue={tenant.headerVariant ?? ''} placeholder="calido" />
        <FormField label="Footer variant" name="footerVariant" defaultValue={tenant.footerVariant ?? ''} placeholder="calido" />
      </div>

      <SaveButton saving={saving} saved={saved} />
    </form>
  )
}

function LegalTab({ tenant }: { tenant: any }) {
  const updateTenant = useMutation(api.tenants.update)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    const fd = new FormData(e.currentTarget)
    const repName = (fd.get('repName') as string).trim()
    const repDocType = (fd.get('repDocType') as string).trim()
    const repDocNumber = (fd.get('repDocNumber') as string).trim()
    try {
      await updateTenant({
        id: tenant._id,
        legalName: (fd.get('legalName') as string).trim() || undefined,
        nit: (fd.get('nit') as string).trim() || undefined,
        taxRegime: (fd.get('taxRegime') as string || undefined) as any,
        economicActivityCode: (fd.get('economicActivityCode') as string).trim() || undefined,
        legalRepresentative:
          repName && repDocType && repDocNumber
            ? { name: repName, documentType: repDocType, documentNumber: repDocNumber }
            : undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } finally {
      setSaving(false)
    }
  }

  const rep = tenant.legalRepresentative

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Razón social" name="legalName" defaultValue={tenant.legalName ?? ''} />
        <FormField label="NIT" name="nit" defaultValue={tenant.nit ?? ''} />
        <div>
          <Label htmlFor="taxRegime" className="mb-1.5 text-xs">Régimen tributario</Label>
          <select
            id="taxRegime"
            name="taxRegime"
            defaultValue={tenant.taxRegime ?? ''}
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">Sin especificar</option>
            {taxRegimeOptions.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
        </div>
        <FormField label="Código actividad económica" name="economicActivityCode" defaultValue={tenant.economicActivityCode ?? ''} />
      </div>

      <fieldset className="rounded-lg border p-4">
        <legend className="px-2 text-xs font-medium">Representante legal</legend>
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField label="Nombre" name="repName" defaultValue={rep?.name ?? ''} />
          <FormField label="Tipo documento" name="repDocType" defaultValue={rep?.documentType ?? ''} placeholder="CC" />
          <FormField label="Número documento" name="repDocNumber" defaultValue={rep?.documentNumber ?? ''} />
        </div>
      </fieldset>

      <SaveButton saving={saving} saved={saved} />
    </form>
  )
}

function PreviewTokenSection({ slug, tenant }: { slug: string; tenant: { _id: any; previewToken?: string } }) {
  const generateToken = useMutation(api.tenants.generatePreviewToken)
  const revokeToken = useMutation(api.tenants.revokePreviewToken)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const previewUrl = tenant.previewToken
    ? `http://localhost:3000/t/${slug}/demo?token=${tenant.previewToken}`
    : null

  async function handleGenerate() {
    setGenerating(true)
    try {
      await generateToken({ id: tenant._id })
    } finally {
      setGenerating(false)
    }
  }

  async function handleCopy() {
    if (!previewUrl) return
    await navigator.clipboard.writeText(previewUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mb-6 rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium">
        <LinkIcon className="size-3.5" />
        Link de preview para el cliente
      </div>
      {previewUrl ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Input readOnly value={previewUrl} className="flex-1 font-mono text-xs" />
            <button
              onClick={handleCopy}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
            >
              {copied ? <><Check className="size-3.5 text-emerald-600" /> Copiado</> : <><Copy className="size-3.5" /> Copiar</>}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[0.65rem] font-medium transition-colors hover:bg-muted disabled:opacity-50"
            >
              <RotateCcw className="size-3" /> Regenerar
            </button>
            <button
              onClick={() => revokeToken({ id: tenant._id })}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border px-2.5 text-[0.65rem] font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              <Trash2 className="size-3" /> Revocar
            </button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-[0.65rem] text-muted-foreground">
            Genera un link para que el cliente vea y elija sus presets sin iniciar sesión.
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            <LinkIcon className="size-3.5" />
            {generating ? 'Generando...' : 'Generar link de preview'}
          </button>
        </div>
      )}
    </div>
  )
}

function FormField({
  label, name, type = 'text', defaultValue, placeholder, required, disabled,
}: {
  label: string; name: string; type?: string; defaultValue?: string;
  placeholder?: string; required?: boolean; disabled?: boolean
}) {
  return (
    <div>
      <Label htmlFor={name} className="mb-1.5 text-xs">{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </div>
  )
}

function SaveButton({ saving, saved }: { saving: boolean; saved: boolean }) {
  return (
    <div className="flex items-center gap-3 pt-2">
      <button
        type="submit"
        disabled={saving}
        className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar'}
      </button>
      {saved && <span className="text-xs text-emerald-600">Guardado</span>}
    </div>
  )
}
