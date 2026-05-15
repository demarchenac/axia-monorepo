import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState, useEffect } from 'react'
import { ArrowLeft, Check, ExternalLink, Eye, Loader2 } from 'lucide-react'
import { TokenProvider } from '@talvu/blocks/components/TokenProvider'
import { SectionRenderer } from '@talvu/blocks/components/SectionRenderer'
import type { ThemeTokens } from '@talvu/blocks/lib/theme-tokens'

const LANDING_URL = import.meta.env.VITE_LANDING_URL ?? 'http://localhost:3000'
const PREVIEW_WIDTH = 1440
const CARD_WIDTH = 380

export const Route = createFileRoute('/_authed/tenants_/$slug_/presets')({
  component: PresetSelector,
})

const familiaLabels: Record<string, string> = {
  calido: 'Cálido',
  elegante: 'Elegante',
  lujoso: 'Lujoso',
  clinico: 'Clínico',
}

function PresetSelector() {
  const { slug } = Route.useParams()
  const tenant = useQuery(api.tenants.getBySlug, { slug })
  const presets = useQuery(api.presets.getByIndustry, { industry: tenant?.industry ?? 'dental' })
  const applyPreset = useMutation(api.presets.applyToTenant)
  const generateToken = useMutation(api.tenants.generatePreviewToken)
  const existingCopies = useQuery(api.presets.getPresetCopiesForTenant, tenant ? { tenantId: tenant._id } : 'skip')
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)

  useEffect(() => {
    if (tenant && !tenant.previewToken) {
      generateToken({ id: tenant._id })
    }
  }, [tenant, generateToken])

  if (!tenant || presets === undefined) {
    return <div className="p-8 text-sm text-muted-foreground">Cargando...</div>
  }

  const grouped = presets.reduce<Record<string, typeof presets>>((acc, p) => {
    const key = p.familia
    ;(acc[key] ??= []).push(p)
    return acc
  }, {})

  async function handleApply(presetSlug: string) {
    if (!tenant) return
    setApplying(presetSlug)
    setApplied(null)
    try {
      await applyPreset({ tenantId: tenant._id, presetSlug })
      setApplied(presetSlug)
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="inline size-4" /> Tenants
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link
          to="/tenants/$slug"
          params={{ slug }}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {tenant.name}
        </Link>
        <span className="text-muted-foreground">/</span>
        <h1 className="text-2xl font-semibold tracking-tight">Presets</h1>
      </div>

      {applied && (
        <div className="mb-6 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <Check className="size-4" />
          Preset <strong>{applied}</strong> aplicado.
          <a
            href={`${LANDING_URL}/t/${slug}`}
            target="_blank"
            rel="noopener"
            className="ml-1 inline-flex items-center gap-1 font-medium underline"
          >
            Ver landing <ExternalLink className="size-3" />
          </a>
        </div>
      )}

      {Object.entries(grouped).map(([familia, familiaPresets]) => (
        <div key={familia} className="mb-10">
          <h2 className="mb-3 text-lg font-semibold">{familiaLabels[familia] ?? familia}</h2>
          <div className="flex flex-wrap gap-5">
            {Array.from({ length: Math.ceil(familiaPresets.length / 2) }, (_, i) => {
              const pair = familiaPresets.slice(i * 2, i * 2 + 2)
              return (
                <div key={i} className="flex gap-5">
                  {pair.map((preset) => (
                    <PresetCard
                      key={preset._id}
                      preset={preset}
                      slug={slug}
                      applying={applying}
                      applied={applied}
                      onApply={handleApply}
                      previewToken={tenant.previewToken}
                      hasExistingCopy={existingCopies?.includes(preset.slug) ?? false}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function PresetCard({
  preset,
  slug,
  applying,
  applied,
  onApply,
  previewToken,
  hasExistingCopy,
}: {
  preset: { _id: string; slug: string; name: unknown; description: unknown }
  slug: string
  applying: string | null
  applied: string | null
  onApply: (slug: string) => void
  previewToken?: string
  hasExistingCopy: boolean
}) {
  return (
    <div className="group w-[380px] shrink-0 overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg">
      <PresetThumbnail presetSlug={preset.slug} tenantSlug={slug} />
      <div className="px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          {(preset.name as Record<string, string>).es ?? preset.slug}
          {hasExistingCopy && (
            <span className="rounded bg-muted px-1.5 py-0.5 text-[0.6rem] font-medium text-muted-foreground">
              Editado
            </span>
          )}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
          {(preset.description as Record<string, string>).es ?? ''}
        </p>
        <div className="mt-2.5 flex gap-2">
          <button
            onClick={() => onApply(preset.slug)}
            disabled={applying !== null}
            className="inline-flex h-7 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {applying === preset.slug ? (
              <><Loader2 className="size-3 animate-spin" /> Aplicando...</>
            ) : applied === preset.slug ? (
              <><Check className="size-3" /> Aplicado</>
            ) : (
              'Aplicar'
            )}
          </button>
          {previewToken && (
            <a
              href={`${LANDING_URL}/t/${slug}/preview/${preset.slug}?token=${previewToken}`}
              target="_blank"
              rel="noopener"
              className="inline-flex h-7 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
            >
              <Eye className="size-3" /> Preview
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function PresetThumbnail({ presetSlug, tenantSlug }: { presetSlug: string; tenantSlug: string }) {
  const preview = useQuery(api.presets.resolvePreview, { presetSlug, slug: tenantSlug })

  if (!preview) {
    return (
      <div className="flex aspect-[16/10] items-center justify-center bg-muted text-sm text-muted-foreground">
        Cargando preview...
      </div>
    )
  }

  const sections = preview.sections.map((s, i) => ({
    id: `preview-${i}`,
    type: s.type,
    variant: s.variant,
    order: s.order,
    content: s.content,
    visible: s.visible,
  }))

  const tokens = (preview.preset.tokens ?? {}) as ThemeTokens & Record<string, string>

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <div
        className="preset-isolation pointer-events-none origin-top-left"
        style={{
          width: PREVIEW_WIDTH,
          transform: `scale(${CARD_WIDTH / PREVIEW_WIDTH})`,
          background: tokens['--bg'] ?? '#fff',
          color: tokens['--fg'] ?? '#000',
        }}
      >
        <TokenProvider tokens={tokens}>
          <SectionRenderer sections={sections} locale="es" />
        </TokenProvider>
      </div>
    </div>
  )
}
