import { createFileRoute, notFound, Link } from '@tanstack/react-router'
import { findVariante, type FamiliaSlug } from '~/themes/tokens'
import { DemoBadge } from '~/components/DemoBadge'
import { TokenProvider } from '@talvu/blocks/components/TokenProvider'
import { SectionRenderer } from '@talvu/blocks/components/SectionRenderer'
import { ScrollIndicator } from '~/components/ScrollIndicator'
import { buildCalidoSections } from '~/data/calido-sections'
import { buildEleganteSections } from '~/data/elegante-sections'
import { buildLujosoSections } from '~/data/lujoso-sections'
import { buildClinicoSections } from '~/data/clinico-sections'
import type { SectionDefinition } from '@talvu/blocks/sections/types'

const builders: Record<FamiliaSlug, (video?: string) => SectionDefinition[]> = {
  'calido-y-amigable': buildCalidoSections,
  'elegante-y-sofisticado': buildEleganteSections,
  'lujoso-y-premium': buildLujosoSections,
  'clinico-y-profesional': buildClinicoSections,
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
  const buildSections = builders[variante.familia]
  const sections = buildSections(variante.video)

  return (
    <TokenProvider tokens={variante.tokens}>
      <BackToGallery />
      <SectionRenderer sections={sections} locale="es" />
      <ScrollIndicator />
      <DemoBadge />
    </TokenProvider>
  )
}

function BackToGallery() {
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
