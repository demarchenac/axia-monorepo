import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'
import { ArrowLeft, Check, ExternalLink, Eye, Loader2 } from 'lucide-react'

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
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)

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
            href={`http://localhost:3000/t/${slug}`}
            target="_blank"
            rel="noopener"
            className="ml-1 inline-flex items-center gap-1 font-medium underline"
          >
            Ver landing <ExternalLink className="size-3" />
          </a>
        </div>
      )}

      {Object.entries(grouped).map(([familia, familiaPresets]) => (
        <div key={familia} className="mb-8">
          <h2 className="mb-4 text-lg font-semibold">{familiaLabels[familia] ?? familia}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {familiaPresets.map((preset) => (
              <div
                key={preset._id}
                className="overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
              >
                <div
                  className="flex h-24 items-end p-3"
                  style={{
                    background: (preset.tokens as Record<string, string>)['--bg'] ?? '#fff',
                    color: (preset.tokens as Record<string, string>)['--fg'] ?? '#000',
                  }}
                >
                  <div className="flex gap-2">
                    {['--primary', '--accent', '--bg-alt', '--border'].map((token) => (
                      <div
                        key={token}
                        className="size-6 rounded-full border border-white/20"
                        style={{
                          background:
                            (preset.tokens as Record<string, string>)[token] ?? '#ccc',
                        }}
                        title={token}
                      />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium">
                    {(preset.name as Record<string, string>).es ?? preset.slug}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {(preset.description as Record<string, string>).es ?? ''}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => handleApply(preset.slug)}
                      disabled={applying !== null}
                      className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                    >
                      {applying === preset.slug ? (
                        <><Loader2 className="size-3 animate-spin" /> Aplicando...</>
                      ) : applied === preset.slug ? (
                        <><Check className="size-3" /> Aplicado</>
                      ) : (
                        'Aplicar'
                      )}
                    </button>
                    <a
                      href={`http://localhost:3000/${familia}/${preset.slug.split('-').slice(1).join('-')}`}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex h-8 items-center gap-1.5 rounded-md border px-3 text-xs font-medium transition-colors hover:bg-muted"
                    >
                      <Eye className="size-3" /> Preview
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
