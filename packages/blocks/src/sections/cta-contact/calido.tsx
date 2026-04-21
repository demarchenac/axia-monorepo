import { resolve } from '../../lib/content-helpers'
import type { SectionProps, CtaContent } from '../types'

export const meta = {
  type: 'cta-contact' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function CtaCalido({ content, locale, sectionId }: SectionProps<CtaContent>) {
  return (
    <section id={sectionId ?? 'contacto'} className="max-w-5xl mx-auto px-6 py-24">
      <div
        className="bg-[var(--primary)] text-[var(--primary-fg)] p-12 md:p-20 text-center relative overflow-hidden"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10" style={{ borderRadius: '50%' }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10" style={{ borderRadius: '50%' }} />
        <div className="relative">
          {content.emoji && <div className="text-5xl mb-6">{content.emoji}</div>}
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            {resolve(content.heading, locale)}
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
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
          {content.details.length > 0 && (
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm opacity-90">
              {content.details.map((d, i) => (
                <div key={i}>
                  {d.icon} {resolve(d.text, locale)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
