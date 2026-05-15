import { resolve } from '../../lib/content-helpers'
import type { SectionProps, HeaderContent } from '../types'

export const meta = {
  type: 'header' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function HeaderElegante({ content, locale }: SectionProps<HeaderContent>) {
  if (content.overlay) {
    return (
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="display text-xl tracking-[0.2em] uppercase text-white">
            {content.clinicName}
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide uppercase text-white/80">
            {content.navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {resolve(item.label, locale)}
              </a>
            ))}
          </nav>
          {content.ctaLabel && (
            <a
              href={content.ctaHref ?? '#contacto'}
              className="inline-flex items-center h-9 px-4 text-sm border border-white/30 text-white hover:bg-white/10 transition-colors"
              style={{ borderRadius: 'var(--radius)' }}
            >
              {resolve(content.ctaLabel, locale)}
            </a>
          )}
        </div>
      </header>
    )
  }

  return (
    <header className="border-b border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
        <div className="display text-xl tracking-[0.2em] uppercase">
          {content.clinicName}
        </div>
        <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide uppercase">
          {content.navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--primary)]">
              {resolve(item.label, locale)}
            </a>
          ))}
        </nav>
        {content.ctaLabel && (
          <a
            href={content.ctaHref ?? '#contacto'}
            className="inline-flex items-center h-9 px-4 text-sm border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-[var(--primary-fg)] transition-colors"
            style={{ borderRadius: 'var(--radius)' }}
          >
            {resolve(content.ctaLabel, locale)}
          </a>
        )}
      </div>
    </header>
  )
}
