'use client'

import { useQuery, useMutation } from 'convex/react'
import { useNavigate } from '@tanstack/react-router'
import { api } from '../../../../convex/_generated/api'
import { buildCalidoSections } from '~/data/calido-sections'
import { buildEleganteSections } from '~/data/elegante-sections'
import { buildLujosoSections } from '~/data/lujoso-sections'
import { buildClinicoSections } from '~/data/clinico-sections'
import type { FamiliaSlug } from '~/themes/tokens'
import type { SectionDefinition } from '@talvu/ui/sections/types'
import { useState } from 'react'

const builders: Record<FamiliaSlug, (video?: string) => SectionDefinition[]> = {
  'calido-y-amigable': buildCalidoSections,
  'elegante-y-sofisticado': buildEleganteSections,
  'lujoso-y-premium': buildLujosoSections,
  'clinico-y-profesional': buildClinicoSections,
}

export function GalleryActions({
  familia,
  paleta,
  tokens,
}: {
  familia: FamiliaSlug
  paleta: string
  tokens: Record<string, string>
}) {
  const tenant = useQuery(api.tenants.getBySlug, { slug: 'axia' })
  const applyFullPage = useMutation(api.pages.applyFullPage)
  const upsertTokens = useMutation(api.designTokens.upsert)
  const navigate = useNavigate()
  const [applying, setApplying] = useState(false)

  if (!tenant) return null

  async function handleSelect() {
    if (!tenant) return
    setApplying(true)
    try {
      const buildSections = builders[familia]
      const sections = buildSections()
      await applyFullPage({
        tenantId: tenant._id,
        sections: sections.map((s) => ({
          type: s.type,
          variant: s.variant,
          order: s.order,
          content: s.content,
          visible: s.visible,
        })),
      })
      await upsertTokens({
        tenantId: tenant._id,
        name: `${familia}/${paleta}`,
        tokens,
      })
      navigate({ to: '/t/$slug', params: { slug: 'axia' } })
    } catch (e) {
      console.error('Failed to apply preset:', e)
      setApplying(false)
    }
  }

  return (
    <button
      onClick={handleSelect}
      disabled={applying}
      className="w-full h-9 rounded-lg text-sm font-medium bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20 disabled:opacity-50 transition-colors cursor-pointer"
    >
      {applying ? 'Aplicando...' : 'Elegir este estilo'}
    </button>
  )
}
