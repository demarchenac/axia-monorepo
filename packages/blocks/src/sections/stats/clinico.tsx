import { resolve } from '../../lib/content-helpers'
import type { SectionProps, StatsContent } from '../types'

export const meta = {
  type: 'stats' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function StatsClinico({ content, locale }: SectionProps<StatsContent>) {
  return (
    <section className="border-y border-[var(--border)] bg-[var(--bg-alt)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        {content.items.map((s) => (
          <div key={s.value} className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-2">{s.value}</div>
            <div className="text-sm text-[var(--fg-muted)]">{resolve(s.label, locale)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
