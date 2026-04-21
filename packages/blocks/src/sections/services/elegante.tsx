import { resolve } from '../../lib/content-helpers'
import type { SectionProps, ServicesContent } from '../types'

export const meta = {
  type: 'services' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function ServicesElegante({ content, locale, sectionId }: SectionProps<ServicesContent>) {
  return (
    <section id={sectionId ?? 'servicios'} className="max-w-5xl mx-auto px-8 py-28">
      <div className="text-center mb-20">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">
          {resolve(content.eyebrow, locale)}
        </p>
        <h2 className="display text-5xl md:text-6xl">
          {resolve(content.heading, locale)}
        </h2>
      </div>
      <ol className="space-y-px">
        {content.items.map((s, i) => (
          <li
            key={i}
            className="grid grid-cols-12 gap-6 py-8 border-t border-[var(--border)] items-baseline"
          >
            <span className="display text-3xl text-[var(--accent)] col-span-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="display text-2xl col-span-4">{resolve(s.name, locale)}</h3>
            <p className="text-[var(--fg-muted)] col-span-7 leading-relaxed text-justify">
              {resolve(s.description, locale)}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
