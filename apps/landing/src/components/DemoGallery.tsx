'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'

const familiaLabels: Record<string, { label: string; tagline: string }> = {
  calido: {
    label: 'Cálido y Amigable',
    tagline: 'Tonos suaves y acogedores que transmiten confianza y cercanía.',
  },
  elegante: {
    label: 'Elegante y Sofisticado',
    tagline: 'Refinamiento y sutileza para una imagen premium.',
  },
  lujoso: {
    label: 'Lujoso y Premium',
    tagline: 'Exclusividad y prestigio con acabados de alto nivel.',
  },
  clinico: {
    label: 'Clínico y Profesional',
    tagline: 'Confianza institucional y seriedad médica.',
  },
}

export function DemoGallery({ slug, token }: { slug: string; token: string }) {
  const tenant = useQuery(api.tenants.validatePreviewToken, { slug, token })
  const presets = useQuery(
    api.presets.getByIndustry,
    tenant ? { industry: tenant.industry } : 'skip',
  )
  const applyPreset = useMutation(api.presets.applyToTenant)
  const upsertTokens = useMutation(api.designTokens.upsert)
  const [applying, setApplying] = useState<string | null>(null)
  const [applied, setApplied] = useState<string | null>(null)

  if (tenant === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="animate-pulse text-neutral-400">Verificando acceso...</div>
      </div>
    )
  }

  if (tenant === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-100">Link inválido o expirado</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Contacta a tu proveedor para obtener un nuevo link.
          </p>
        </div>
      </div>
    )
  }

  if (!presets) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="animate-pulse text-neutral-400">Cargando diseños...</div>
      </div>
    )
  }

  const grouped = presets.reduce<Record<string, typeof presets>>((acc, p) => {
    ;(acc[p.familia] ??= []).push(p)
    return acc
  }, {})

  async function handleSelect(presetSlug: string) {
    if (!tenant) return
    setApplying(presetSlug)
    try {
      const preset = presets!.find(p => p.slug === presetSlug)
      await applyPreset({ tenantId: tenant._id, presetSlug })
      if (preset) {
        await upsertTokens({
          tenantId: tenant._id,
          name: presetSlug,
          tokens: preset.tokens,
          basedOnPresetSlug: presetSlug,
        })
      }
      setApplied(presetSlug)
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <div className="text-lg font-semibold">{tenant.name}</div>
            <div className="text-xs uppercase tracking-widest text-neutral-500">
              Demo · Dirección visual
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-neutral-800 px-3 py-1.5 font-mono text-xs text-neutral-300">
              {presets.length} variantes
            </span>
            {applied && (
              <a
                href={`/t/${slug}`}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 font-mono text-xs text-emerald-300 transition-colors hover:bg-emerald-500/20"
              >
                Ver sitio actual →
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">
          Elija la dirección visual de{' '}
          <span className="text-amber-400">{tenant.name}</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl leading-relaxed text-neutral-400">
          {presets.length} variantes navegables agrupadas en {Object.keys(grouped).length} familias
          visuales. Cada variante es una página completa, no un mockup. Click en cualquiera para
          verla en vivo.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 font-mono text-xs text-neutral-500">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
          Contenido y fotos son ficticios para fines de presentación
        </div>
      </section>

      {applied && (
        <div className="border-y border-emerald-500/20 bg-emerald-500/5">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/20">
                <svg className="size-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-300">Diseño aplicado</p>
                <p className="text-xs text-emerald-400/70">Tu sitio web se actualizó al instante.</p>
              </div>
            </div>
            <a
              href={`/t/${slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-emerald-400"
            >
              Ver mi sitio →
            </a>
          </div>
        </div>
      )}

      {Object.entries(grouped).map(([familia, familiaPresets]) => {
        const meta = familiaLabels[familia]
        return (
          <section key={familia} className="border-t border-neutral-800 py-20">
            <div className="mx-auto max-w-7xl px-6">
              <div className="mb-12 max-w-3xl">
                <p className="mb-3 text-xs uppercase tracking-[0.3em] text-amber-400">
                  Familia visual
                </p>
                <h2 className="mb-4 text-4xl font-bold md:text-5xl">
                  {meta?.label ?? familia}
                </h2>
                <p className="text-lg leading-relaxed text-neutral-400">
                  {meta?.tagline ?? ''}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {familiaPresets.map((preset) => {
                  const tokens = preset.tokens as Record<string, string>
                  const previewUrl = `/t/${slug}/preview/${preset.slug}?token=${token}`
                  const isApplying = applying === preset.slug
                  const isApplied = applied === preset.slug

                  return (
                    <div
                      key={preset._id}
                      className={`relative overflow-hidden rounded-xl border transition-all ${
                        isApplied
                          ? 'border-emerald-500/50 bg-neutral-900'
                          : 'border-neutral-800 bg-neutral-900 hover:border-amber-500/50'
                      }`}
                    >
                      <a href={previewUrl} target="_blank" rel="noopener" className="block">
                        <div className="aspect-[16/10] overflow-hidden bg-neutral-800">
                          <iframe
                            src={previewUrl}
                            title={(preset.name as Record<string, string>).es ?? preset.slug}
                            loading="lazy"
                            className="pointer-events-none border-0"
                            style={{
                              width: '400%',
                              height: '400%',
                              transform: 'scale(0.25)',
                              transformOrigin: 'top left',
                            }}
                          />
                        </div>
                      </a>

                      <div className="border-t border-neutral-800 p-5">
                        <div className="mb-2 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            {['--bg', '--primary', '--accent', '--fg'].map((key) => (
                              <span
                                key={key}
                                className="h-4 w-4 rounded-full border border-neutral-700"
                                style={{ background: tokens[key] }}
                              />
                            ))}
                          </div>
                          <span className="font-mono text-[10px] uppercase text-neutral-500">
                            {preset.slug.split('-').slice(1).join('-')}
                          </span>
                        </div>

                        <div className="mb-1 font-semibold">
                          {(preset.name as Record<string, string>).es ?? preset.slug}
                        </div>
                        <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-neutral-500">
                          {(preset.description as Record<string, string>).es ?? ''}
                        </p>

                        <button
                          onClick={() => handleSelect(preset.slug)}
                          disabled={applying !== null}
                          className={`h-9 w-full rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                            isApplied
                              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                              : 'border border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                          }`}
                        >
                          {isApplying
                            ? 'Aplicando...'
                            : isApplied
                              ? '✓ Seleccionado'
                              : 'Elegir este estilo'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      <footer className="border-t border-neutral-800 py-10 text-center text-xs text-neutral-500">
        Powered by Talvu · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
