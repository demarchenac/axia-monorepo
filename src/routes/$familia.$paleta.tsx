import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { findVariante, type FamiliaSlug } from '~/themes/tokens'
import { ThemeProvider } from '~/components/ThemeProvider'
import { DemoBadge } from '~/components/DemoBadge'
import { EleganteTemplate } from '~/templates/EleganteTemplate'
import { LujosoTemplate } from '~/templates/LujosoTemplate'
import { ClinicoTemplate } from '~/templates/ClinicoTemplate'
import { CalidoTemplate } from '~/templates/CalidoTemplate'

const templates: Record<FamiliaSlug, (props: { video?: string }) => React.JSX.Element> = {
  'elegante-y-sofisticado': EleganteTemplate,
  'lujoso-y-premium': LujosoTemplate,
  'clinico-y-profesional': ClinicoTemplate,
  'calido-y-amigable': CalidoTemplate,
}

export const Route = createFileRoute('/$familia/$paleta')({
  loader: ({ params }) => {
    const variante = findVariante(params.familia, params.paleta)
    if (!variante) throw notFound()
    return { variante }
  },
  component: VariantePage,
})

function VariantePage() {
  const { variante } = Route.useLoaderData()
  const Template = templates[variante.familia]
  return (
    <ThemeProvider tokens={variante.tokens}>
      <BackToGallery />
      <Template video={variante.video} />
      <DemoBadge />
    </ThemeProvider>
  )
}

function BackToGallery() {
  // Hidden inside iframes (same-origin check via window.self !== window.top)
  if (typeof window !== 'undefined' && window.self !== window.top) return null
  return (
    <Link
      to="/"
      className="fixed top-4 left-4 z-50 px-3 py-1.5 text-xs font-mono uppercase tracking-wider bg-black/80 text-white rounded-full backdrop-blur hover:bg-black"
    >
      ← Galería
    </Link>
  )
}
