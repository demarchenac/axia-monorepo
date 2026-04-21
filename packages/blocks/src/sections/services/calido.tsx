import { resolve } from '../../lib/content-helpers'
import type { SectionProps, ServicesContent } from '../types'

export const meta = {
  type: 'services' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function ServicesCalido({ content, locale, sectionId }: SectionProps<ServicesContent>) {
  return (
    <section id={sectionId ?? 'servicios'} className="bg-[var(--bg-alt)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">
            {resolve(content.eyebrow, locale)}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {resolve(content.heading, locale)}
          </h2>
          <p className="text-lg text-[var(--fg-muted)]">
            {resolve(content.subheading, locale)}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.items.map((s, i) => (
            <article
              key={i}
              className="bg-[var(--card)] p-8 border border-[var(--border)] hover:shadow-2xl hover:-translate-y-1 transition-all"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="text-3xl font-bold text-[var(--primary)] mb-3">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="text-xl font-bold mb-3">{resolve(s.name, locale)}</h3>
              <p className="text-[var(--fg-muted)] text-sm leading-relaxed mb-5">
                {resolve(s.description, locale)}
              </p>
              {s.cta && (
                <a
                  href={s.cta.href}
                  target={s.cta.href.startsWith('http') ? '_blank' : undefined}
                  rel={s.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-[var(--primary)] hover:bg-[var(--bg-alt)] inline-flex items-center h-9 px-4 text-sm font-medium transition-all"
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {resolve(s.cta.label, locale)}
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
