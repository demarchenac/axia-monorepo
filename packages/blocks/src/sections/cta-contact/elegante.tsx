import { resolve } from '../../lib/content-helpers'
import type { SectionProps, CtaContent } from '../types'

export const meta = {
  type: 'cta-contact' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function CtaElegante({ content, locale, sectionId }: SectionProps<CtaContent>) {
  return (
    <section id={sectionId ?? 'contacto'} className="bg-[var(--bg-alt)] py-32">
      <div className="max-w-3xl mx-auto px-8 text-center">
        {content.eyebrow && (
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
            {resolve(content.eyebrow, locale)}
          </p>
        )}
        <h2 className="display text-5xl md:text-6xl mb-8">
          {resolve(content.heading, locale)}
        </h2>
        <p className="text-lg text-[var(--fg-muted)] mb-12">
          {resolve(content.subheading, locale)}
        </p>
        <a
          href={content.cta.href}
          target={content.cta.href.startsWith('http') ? '_blank' : undefined}
          rel={content.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium"
          style={{ borderRadius: 'var(--radius)' }}
        >
          {resolve(content.cta.label, locale)}
        </a>
        {content.details.length > 0 && (
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-sm text-[var(--fg-muted)]">
            {content.details.map((d, i) => (
              <div key={i}>
                {d.label && (
                  <p className="text-xs uppercase tracking-widest text-[var(--fg)] mb-2">
                    {resolve(d.label, locale)}
                  </p>
                )}
                {resolve(d.text, locale)}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
