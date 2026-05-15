import { resolve } from '../../lib/content-helpers'
import type { SectionProps, StatsContent } from '../types'

export const meta = {
  type: 'stats' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function StatsLujoso({ content, locale }: SectionProps<StatsContent>) {
  return (
    <section className="bg-[var(--primary)] py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {content.items.map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[var(--accent)] mb-2">
              {s.value}
            </div>
            <div className="text-sm text-[var(--primary-fg)]/70">
              {resolve(s.label, locale)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
