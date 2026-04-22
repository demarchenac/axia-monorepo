import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '~/components/ClientOnly'
import { DemoGallery } from '~/components/DemoGallery'

type DemoSearch = { token?: string }

export const Route = createFileRoute('/t/$slug_/demo')({
  validateSearch: (search: Record<string, unknown>): DemoSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: DemoRoute,
})

function DemoRoute() {
  const { slug } = Route.useParams()
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Acceso no autorizado</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Necesitas un link válido para acceder a esta galería.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="animate-pulse text-neutral-400">Cargando galería...</div>
        </div>
      }
    >
      <DemoGallery slug={slug} token={token} />
    </ClientOnly>
  )
}
