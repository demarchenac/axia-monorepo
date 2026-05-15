import { createFileRoute } from '@tanstack/react-router'
import { ConvexHttpClient } from 'convex/browser'
import { api } from '@talvu/db'
import { TokenProvider } from '@talvu/blocks/components/TokenProvider'
import { SectionRenderer } from '@talvu/blocks/components/SectionRenderer'
import { ScrollIndicator } from '~/components/ScrollIndicator'
import type { ThemeTokens } from '@talvu/blocks/lib/theme-tokens'
import type { SectionDefinition } from '@talvu/blocks/sections/types'

type TenantData = {
  name: string
  defaultLocale: string
  sections: SectionDefinition[]
  tokens: ThemeTokens
} | null

export const Route = createFileRoute('/t/$slug')({
  loader: async ({ params }): Promise<TenantData> => {
    const http = new ConvexHttpClient(
      import.meta.env.VITE_CONVEX_URL as string,
    )

    const tenant = await http.query(api.tenants.getBySlug, {
      slug: params.slug,
    })
    if (!tenant) return null

    const [page, tokens] = await Promise.all([
      http.query(api.pages.getByTenant, { tenantId: tenant._id }),
      http.query(api.designTokens.getActive, { tenantId: tenant._id }),
    ])

    return {
      name: tenant.name,
      defaultLocale: tenant.defaultLocale,
      sections: (page?.sections ?? []).map((s: any) => ({
        id: s._id,
        type: s.type,
        variant: s.variant,
        order: s.order,
        content: s.content,
        visible: s.visible,
      })),
      tokens: (tokens?.tokens ?? {}) as ThemeTokens,
    }
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [{ title: loaderData.name }]
      : [{ title: 'No encontrado' }],
  }),
  component: TenantLanding,
})

function TenantLanding() {
  const data = Route.useLoaderData()

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No encontrado</h1>
          <p className="text-neutral-500">No existe un sitio con ese nombre.</p>
        </div>
      </div>
    )
  }

  if (!data.sections.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">{data.name}</h1>
          <p className="text-neutral-500">
            Este sitio aún no tiene contenido configurado.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TokenProvider tokens={data.tokens}>
      <SectionRenderer sections={data.sections} locale={data.defaultLocale} />
      <ScrollIndicator />
    </TokenProvider>
  )
}
