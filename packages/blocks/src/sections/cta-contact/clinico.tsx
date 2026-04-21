import { resolve } from '../../lib/content-helpers'
import type { SectionProps, CtaContent } from '../types'

export const meta = {
  type: 'cta-contact' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function CtaClinico({ content, locale, sectionId }: SectionProps<CtaContent>) {
  return (
    <section id={sectionId ?? 'contacto'} className="bg-[var(--primary)] text-[var(--primary-fg)] py-20">
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {resolve(content.heading, locale)}
          </h2>
          <p className="text-lg opacity-90 mb-8">
            {resolve(content.subheading, locale)}
          </p>
          <a
            href={content.cta.href}
            target={content.cta.href.startsWith('http') ? '_blank' : undefined}
            rel={content.cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={content.cta.className ?? 'bg-white text-[var(--primary)] hover:bg-white/90 h-14 px-8 inline-flex items-center font-medium transition-all'}
            style={{ borderRadius: 'var(--radius)' }}
          >
            {resolve(content.cta.label, locale)}
          </a>
        </div>
        {content.details.length > 0 && (
          <div className="space-y-4 text-sm">
            {content.details.map((d, i) => (
              <div key={i} className="flex items-center gap-3">
                {d.icon} <span>{resolve(d.text, locale)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
