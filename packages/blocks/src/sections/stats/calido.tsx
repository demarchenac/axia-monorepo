import { resolve } from '../../lib/content-helpers'
import type { SectionProps, StatsContent } from '../types'

export const meta = {
  type: 'stats' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function StatsCalido({ content, locale }: SectionProps<StatsContent>) {
  return (
    <section className="bg-[var(--bg-alt)] py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {content.items.map((s) => (
          <div
            key={s.value}
            className="rounded-2xl bg-[var(--card)] p-6 text-center shadow-sm"
          >
            <div className="text-4xl font-bold text-[var(--accent)] mb-1">
              {s.value}
            </div>
            <div className="text-sm text-[var(--fg-muted)]">
              {resolve(s.label, locale)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
