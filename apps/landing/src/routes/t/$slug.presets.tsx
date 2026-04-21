import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '~/components/ClientOnly'
import { PresetPicker } from '~/components/PresetPicker'

type PresetSearch = { token?: string }

export const Route = createFileRoute('/t/$slug/presets')({
  validateSearch: (search: Record<string, unknown>): PresetSearch => ({
    token: typeof search.token === 'string' ? search.token : undefined,
  }),
  component: PresetPickerRoute,
})

function PresetPickerRoute() {
  const { slug } = Route.useParams()
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-neutral-900">Acceso no autorizado</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Necesitas un link válido para acceder a esta página.
          </p>
        </div>
      </div>
    )
  }

  return (
    <ClientOnly
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-50">
          <div className="animate-pulse text-neutral-400">Cargando...</div>
        </div>
      }
    >
      <PresetPicker slug={slug} token={token} />
    </ClientOnly>
  )
}
