import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '~/components/ClientOnly'
import { PresetPreview } from '~/components/PresetPreview'

type PreviewSearch = { token?: string }

export const Route = createFileRoute('/t/$slug_/preview/$presetSlug')({
  validateSearch: (search: Record<string, unknown>): PreviewSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: PreviewRoute,
})

function PreviewRoute() {
  const { slug, presetSlug } = Route.useParams()
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <p className="text-sm text-neutral-500">Acceso no autorizado.</p>
      </div>
    )
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="animate-pulse text-neutral-400">Cargando preview...</div>
        </div>
      }
    >
      <PresetPreview slug={slug} presetSlug={presetSlug} token={token} />
    </ClientOnly>
  )
}
