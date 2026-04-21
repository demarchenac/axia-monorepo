import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TestimonialsContent } from '../types'

export const meta = {
  type: 'testimonials' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function TestimonialsElegante({ content, locale, sectionId }: SectionProps<TestimonialsContent>) {
  return (
    <section id={sectionId ?? 'testimonios'} className="max-w-5xl mx-auto px-8 py-28">
      <div className="text-center mb-16">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">
          {resolve(content.eyebrow, locale)}
        </p>
        <h2 className="display text-5xl md:text-6xl">
          {resolve(content.heading, locale)}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-12">
        {content.items.slice(0, 4).map((t) => (
          <figure key={t.name} className="border-l-2 border-[var(--accent)] pl-6">
            <blockquote className="display text-2xl leading-relaxed text-justify italic mb-6">
              "{resolve(t.text, locale)}"
            </blockquote>
            <figcaption>
              <div className="font-medium">{t.name}</div>
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
