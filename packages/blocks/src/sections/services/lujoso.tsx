import { resolve } from '../../lib/content-helpers'
import type { SectionProps, ServicesContent } from '../types'

const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

export const meta = {
  type: 'services' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function ServicesLujoso({ content, locale, sectionId }: SectionProps<ServicesContent>) {
  return (
    <section id={sectionId ?? 'servicios'} className="max-w-7xl mx-auto px-10 py-32">
      <div className="grid md:grid-cols-12 gap-10 mb-20">
        <div className="md:col-span-5">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
            — {resolve(content.eyebrow, locale)} —
          </p>
          <h2 className="display text-5xl md:text-6xl italic font-light leading-tight">
            {resolve(content.heading, locale)}
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6 flex items-end">
          <p className="text-lg text-[var(--fg-muted)] leading-relaxed text-justify">
            {resolve(content.subheading, locale)}
          </p>
        </div>
      </div>
      <div className="grid md:grid-cols-2">
        {content.items.map((s, i) => (
          <article
            key={i}
            className="group p-10 border-t border-[var(--border)] md:[&:nth-child(odd)]:border-r"
          >
            <div className="flex items-start gap-8">
              <span className="display italic text-4xl text-[var(--accent)] min-w-12">
                {romanos[i] ?? String(i + 1)}
              </span>
              <div>
                <h3 className="display text-3xl mb-3 italic">{resolve(s.name, locale)}</h3>
                <p className="text-[var(--fg-muted)] leading-relaxed text-justify">
                  {resolve(s.description, locale)}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
