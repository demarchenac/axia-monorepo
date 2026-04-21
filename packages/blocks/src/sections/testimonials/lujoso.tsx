import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TestimonialsContent } from '../types'

export const meta = {
  type: 'testimonials' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function TestimonialsLujoso({ content, locale, sectionId }: SectionProps<TestimonialsContent>) {
  return (
    <section id={sectionId ?? 'testimonios'} className="max-w-5xl mx-auto px-10 py-32">
      <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6 text-center">
        — {resolve(content.eyebrow, locale)} —
      </p>
      <div className="space-y-20">
        {content.items.slice(0, 3).map((t) => (
          <figure key={t.name} className="text-center">
            <span className="display text-7xl text-[var(--accent)] leading-none">"</span>
            <blockquote className="display text-3xl md:text-4xl italic leading-relaxed text-justify font-light mb-8 -mt-4">
              {resolve(t.text, locale)}
            </blockquote>
            <figcaption className="text-xs tracking-[0.25em] uppercase text-[var(--fg-muted)]">
              {t.name} · {t.location}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
