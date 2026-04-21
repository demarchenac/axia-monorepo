import { resolve } from '../../lib/content-helpers'
import type { SectionProps, ServicesContent } from '../types'

export const meta = {
  type: 'services' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function ServicesClinico({ content, locale, sectionId }: SectionProps<ServicesContent>) {
  return (
    <section id={sectionId ?? 'servicios'} className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">
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
            className="border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition-all"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div className="h-12 w-12 rounded-lg bg-[var(--bg-alt)] flex items-center justify-center text-[var(--primary)] mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">{resolve(s.name, locale)}</h3>
            <p className="text-[var(--fg-muted)] text-sm leading-relaxed text-justify mb-4">
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
    </section>
  )
}
