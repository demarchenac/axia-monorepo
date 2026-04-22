'use client'

import { useQuery } from 'convex/react'
import { api } from '@talvu/db'
import { TokenProvider } from '@talvu/blocks/components/TokenProvider'
import { SectionRenderer } from '@talvu/blocks/components/SectionRenderer'
import type { ThemeTokens } from '@talvu/blocks/lib/theme-tokens'

export function PresetPreview({
  slug,
  presetSlug,
  token,
}: {
  slug: string
  presetSlug: string
  token: string
}) {
  const tenant = useQuery(api.tenants.validatePreviewToken, { slug, token })
  const preview = useQuery(api.presets.resolvePreview, { presetSlug })

  if (tenant === undefined || preview === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="animate-pulse text-neutral-400">Cargando preview...</div>
      </div>
    )
  }

  if (tenant === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Link inválido o expirado.</p>
      </div>
    )
  }

  if (!preview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Preset no encontrado.</p>
      </div>
    )
  }

  const themeTokens = (preview.preset.tokens ?? {}) as ThemeTokens

  return (
    <TokenProvider tokens={themeTokens}>
      <SectionRenderer
        sections={preview.sections.map((s, i) => ({
          id: `preview-${i}`,
          type: s.type,
          variant: s.variant,
          order: s.order,
          content: s.content,
          visible: s.visible,
        }))}
        locale={tenant.defaultLocale}
      />
    </TokenProvider>
  )
}
