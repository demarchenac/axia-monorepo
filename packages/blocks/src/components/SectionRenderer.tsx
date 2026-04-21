import { getSection } from '../sections/registry'
import type { SectionDefinition } from '../sections/types'

type Props = {
  sections: SectionDefinition[]
  locale: string
}

export function SectionRenderer({ sections, locale }: Props) {
  return (
    <main className="min-h-screen">
      {sections
        .filter((s) => s.visible)
        .sort((a, b) => a.order - b.order)
        .map((s) => {
          const Component = getSection(s.type, s.variant)
          if (!Component) {
            console.warn(`[SectionRenderer] Unknown section: ${s.type}::${s.variant}`)
            return null
          }
          return <Component key={s.id} content={s.content} locale={locale} sectionId={s.id} />
        })}
    </main>
  )
}
