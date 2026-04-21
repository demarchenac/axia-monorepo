'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@talvu/db'
import { useState } from 'react'

const familiaLabels: Record<string, { label: string; description: string }> = {
  calido: {
    label: 'Cálido y Amigable',
    description: 'Tonos suaves y acogedores que transmiten confianza y cercanía.',
  },
  elegante: {
    label: 'Elegante y Sofisticado',
    description: 'Refinamiento y sutileza para una imagen premium.',
  },
  lujoso: {
    label: 'Lujoso y Premium',
    description: 'Exclusividad y prestigio con acabados de alto nivel.',
  },
  clinico: {
    label: 'Clínico y Profesional',
    description: 'Confianza institucional y seriedad médica.',
  },
}

export function PresetPicker({ slug, token }: { slug: string; token: string }) {
  const tenant = useQuery(api.tenants.validatePreviewToken, { slug, token })
  const presets = useQuery(
    api.presets.getByIndustry,
    tenant ? { industry: tenant.industry } : 'skip',
  )
  const applyPreset = useMutation(api.presets.applyToTenant)
  const [applying, setApplying] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  if (tenant === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="animate-pulse text-neutral-400">Verificando acceso...</div>
      </div>
    )
  }

  if (tenant === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Link inválido o expirado</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Contacta a tu proveedor para obtener un nuevo link.
          </p>
        </div>
      </div>
    )
  }

  if (!presets) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
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
      await applyPreset({ tenantId: tenant._id, presetSlug })
      setSelected(presetSlug)
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-center">
          <p className="text-xs font-medium uppercase tracking-widest text-neutral-400">
            Dirección visual
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
            {tenant.name}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-neutral-500">
            Elige el estilo visual que mejor represente tu marca.
            Puedes cambiar de opinión en cualquier momento.
          </p>
        </div>
      </header>

      {selected && (
        <div className="border-b bg-emerald-50">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-emerald-100">
                <svg className="size-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-900">Diseño aplicado</p>
                <p className="text-xs text-emerald-700">Tu sitio web se actualizó al instante.</p>
              </div>
            </div>
            <a
              href={`/t/${slug}`}
              target="_blank"
              rel="noopener"
              className="inline-flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
            >
              Ver mi sitio
              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-12">
        {Object.entries(grouped).map(([familia, familiaPresets]) => {
          const meta = familiaLabels[familia]
          return (
            <section key={familia} className="mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-neutral-900">
                  {meta?.label ?? familia}
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  {meta?.description ?? ''}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {familiaPresets.map((preset) => {
                  const tokens = preset.tokens as Record<string, string>
                  const isSelected = selected === preset.slug
                  const isApplying = applying === preset.slug

                  return (
                    <div
                      key={preset._id}
                      className={`group overflow-hidden rounded-2xl border-2 bg-white shadow-sm transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                          : 'border-neutral-200 hover:border-neutral-300'
                      }`}
                    >
                      <div
                        className="relative h-40 p-6"
                        style={{ background: tokens['--bg'], color: tokens['--fg'] }}
                      >
                        <div
                          className="absolute inset-x-0 bottom-0 h-20"
                          style={{
                            background: `linear-gradient(to top, ${tokens['--bg']}, transparent)`,
                          }}
                        />
                        <div className="relative">
                          <div
                            className="mb-3 inline-block rounded-full px-3 py-1 text-xs font-semibold"
                            style={{
                              background: tokens['--primary'],
                              color: tokens['--primary-fg'],
                            }}
                          >
                            {tenant.name}
                          </div>
                          <div
                            className="text-lg font-bold"
                            style={{
                              fontFamily: tokens['--font-display'],
                              color: tokens['--fg'],
                            }}
                          >
                            Tu sonrisa, nuestra pasión
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 flex gap-1.5">
                          {['--primary', '--accent', '--bg-alt', '--border'].map((key) => (
                            <div
                              key={key}
                              className="size-5 rounded-full border border-white/30 shadow-sm"
                              style={{ background: tokens[key] }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="p-5">
                        <h3 className="font-semibold text-neutral-900">
                          {(preset.name as Record<string, string>).es ?? preset.slug}
                        </h3>
                        <p className="mt-1 text-xs leading-relaxed text-neutral-500">
                          {(preset.description as Record<string, string>).es ?? ''}
                        </p>

                        <button
                          onClick={() => handleSelect(preset.slug)}
                          disabled={applying !== null}
                          className={`mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${
                            isSelected
                              ? 'bg-emerald-50 text-emerald-700 border-2 border-emerald-200'
                              : 'bg-neutral-900 text-white hover:bg-neutral-800'
                          }`}
                        >
                          {isApplying ? (
                            <>
                              <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                              </svg>
                              Aplicando...
                            </>
                          ) : isSelected ? (
                            <>
                              <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              Seleccionado
                            </>
                          ) : (
                            'Elegir este diseño'
                          )}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </main>

      <footer className="border-t bg-white py-8 text-center text-xs text-neutral-400">
        Powered by Talvu
      </footer>
    </div>
  )
}
