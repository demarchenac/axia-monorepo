'use client'

import { useQuery } from 'convex/react'
import { api } from '../../../../convex/_generated/api'
import { TokenProvider } from '@talvu/ui/components/TokenProvider'
import { SectionRenderer } from '@talvu/ui/components/SectionRenderer'
import { ScrollIndicator } from '~/components/ScrollIndicator'
import type { ThemeTokens } from '@talvu/ui/lib/theme-tokens'

export function TenantPage({ slug }: { slug: string }) {
  const tenant = useQuery(api.tenants.getBySlug, { slug })
  const page = useQuery(
    api.pages.getByTenant,
    tenant ? { tenantId: tenant._id } : 'skip',
  )
  const tokens = useQuery(
    api.designTokens.getActive,
    tenant ? { tenantId: tenant._id } : 'skip',
  )

  if (tenant === undefined || page === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse text-neutral-400">Cargando...</div>
      </div>
    )
  }

  if (tenant === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No encontrado</h1>
          <p className="text-neutral-500">No existe un sitio con ese nombre.</p>
        </div>
      </div>
    )
  }

  if (!page || !page.sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{tenant.name}</h1>
          <p className="text-neutral-500">Este sitio aún no tiene contenido configurado.</p>
        </div>
      </div>
    )
  }

  const themeTokens = (tokens?.tokens ?? {}) as ThemeTokens

  return (
    <TokenProvider tokens={themeTokens}>
      <SectionRenderer
        sections={page.sections.map((s) => ({
          id: s._id,
          type: s.type,
          variant: s.variant,
          order: s.order,
          content: s.content,
          visible: s.visible,
        }))}
        locale={tenant.defaultLocale}
      />
      <ScrollIndicator />
    </TokenProvider>
  )
}
