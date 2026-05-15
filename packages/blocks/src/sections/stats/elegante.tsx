import { resolve } from '../../lib/content-helpers'
import type { SectionProps, StatsContent } from '../types'

export const meta = {
  type: 'stats' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function StatsElegante({ content, locale }: SectionProps<StatsContent>) {
  return (
    <section className="border-y border-[var(--border)] py-16">
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center divide-x divide-[var(--border)]">
        {content.items.map((s) => (
          <div key={s.value} className="px-10 py-2 text-center">
            <div
              className="text-4xl md:text-5xl font-light tracking-tight text-[var(--primary)] mb-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {s.value}
            </div>
            <div className="text-xs uppercase tracking-widest text-[var(--fg-muted)]">
              {resolve(s.label, locale)}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
