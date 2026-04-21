import { resolve } from '../../lib/content-helpers'
import type { SectionProps, CtaContent } from '../types'

export const meta = {
  type: 'cta-contact' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function CtaLujoso({ content, locale, sectionId }: SectionProps<CtaContent>) {
  return (
    <section id={sectionId ?? 'contacto'} className="bg-[var(--bg-alt)] border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-10 py-32 grid md:grid-cols-2 gap-16">
        <div>
          {content.eyebrow && (
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
              — {resolve(content.eyebrow, locale)} —
            </p>
          )}
          <h2 className="display text-5xl md:text-6xl italic font-light leading-tight mb-8">
            {resolve(content.heading, locale)}
          </h2>
          <p className="text-lg text-[var(--fg-muted)] mb-10 leading-relaxed text-justify">
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
        </div>
        {content.details.length > 0 && (
          <div className="space-y-8 md:border-l md:border-[var(--border)] md:pl-16">
            {content.details.map((d, i) => (
              <div key={i}>
                {d.label && (
                  <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-2">
                    {resolve(d.label, locale)}
                  </p>
                )}
                <p className="display text-2xl italic">{resolve(d.text, locale)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
