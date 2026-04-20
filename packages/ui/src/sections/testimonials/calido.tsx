import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TestimonialsContent } from '../types'

export const meta = {
  type: 'testimonials' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function TestimonialsCalido({ content, locale, sectionId }: SectionProps<TestimonialsContent>) {
  return (
    <section id={sectionId ?? 'testimonios'} className="bg-[var(--bg-alt)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">
            {resolve(content.eyebrow, locale)}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            {resolve(content.heading, locale)}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {content.items.slice(0, 4).map((t) => (
            <figure
              key={t.name}
              className="bg-[var(--card)] border border-[var(--border)] p-8"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="text-[var(--accent)] text-xl mb-4">
                {'★'.repeat(t.rating)}
              </div>
              <blockquote className="text-lg leading-relaxed mb-6">
                "{resolve(t.text, locale)}"
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div
                  className="h-12 w-12 bg-[var(--accent)] flex items-center justify-center text-[var(--accent-fg)] font-bold"
                  style={{ borderRadius: '50%' }}
                >
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-xs text-[var(--fg-muted)]">
                    {t.location} · {t.service}
                  </div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
