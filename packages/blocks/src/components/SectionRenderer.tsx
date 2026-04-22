import { Component, type ReactNode } from 'react'
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
          const SectionComponent = getSection(s.type, s.variant)
          if (!SectionComponent) {
            console.warn(`[SectionRenderer] Unknown section: ${s.type}::${s.variant}`)
            return null
          }
          return (
            <SectionErrorBoundary key={s.id} sectionType={s.type} variant={s.variant}>
              <SectionComponent content={s.content} locale={locale} sectionId={s.id} />
            </SectionErrorBoundary>
          )
        })}
    </main>
  )
}

class SectionErrorBoundary extends Component<
  { children: ReactNode; sectionType: string; variant: string },
  { hasError: boolean }
> {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.warn(
      `[SectionRenderer] Error in ${this.props.sectionType}::${this.props.variant}:`,
      error.message,
    )
  }

  render() {
    if (this.state.hasError) return null
    return this.props.children
  }
}
