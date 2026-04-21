import { createFileRoute } from '@tanstack/react-router'
import { ClientOnly } from '~/components/ClientOnly'
import { TenantPage } from '~/components/TenantPage'

export const Route = createFileRoute('/t/$slug')({
  component: TenantLanding,
})

function TenantLanding() {
  const { slug } = Route.useParams()
  return (
    <ClientOnly
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50">
          <div className="animate-pulse text-neutral-400">Cargando...</div>
        </div>
      }
    >
      <TenantPage slug={slug} />
    </ClientOnly>
  )
}
