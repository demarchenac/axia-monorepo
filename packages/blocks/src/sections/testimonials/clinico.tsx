import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TestimonialsContent } from '../types'

export const meta = {
  type: 'testimonials' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function TestimonialsClinico({ content, locale, sectionId }: SectionProps<TestimonialsContent>) {
  return (
    <section id={sectionId ?? 'testimonios'} className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">
          {resolve(content.eyebrow, locale)}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold">
          {resolve(content.heading, locale)}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.items.map((t) => (
          <figure
            key={t.name}
            className="border border-[var(--border)] bg-[var(--card)] p-6"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div className="text-[var(--accent)] mb-4">{'★'.repeat(t.rating)}</div>
            <blockquote className="text-[var(--fg)] leading-relaxed text-justify mb-6">
              "{resolve(t.text, locale)}"
            </blockquote>
            <figcaption className="border-t border-[var(--border)] pt-4">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-[var(--fg-muted)]">
                {t.location} · {t.service}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
