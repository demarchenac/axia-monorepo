import { resolve } from '../../lib/content-helpers'
import type { SectionProps, HeaderContent } from '../types'

export const meta = {
  type: 'header' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function HeaderLujoso({ content, locale }: SectionProps<HeaderContent>) {
  if (content.overlay) {
    return (
      <header className="absolute top-0 left-0 right-0 z-30">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-white/30 flex items-center justify-center">
              <span className="display text-white text-lg italic">
                {content.clinicName[0]}
              </span>
            </div>
            <div>
              <div className="display text-lg tracking-[0.15em] uppercase text-white">{content.clinicName}</div>
              {content.doctorName && (
                <div className="text-[10px] tracking-widest text-white/50 uppercase">
                  By {content.doctorName}
                </div>
              )}
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase text-white/80">
            {content.navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {resolve(item.label, locale)}
              </a>
            ))}
          </nav>
          {content.ctaLabel && (
            <a
              href={content.ctaHref ?? '#contacto'}
              className="inline-flex items-center h-9 px-4 text-sm border border-white/30 text-white hover:bg-white/10 transition-all font-medium"
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
      <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 border border-[var(--accent)] flex items-center justify-center">
            <span className="display text-[var(--accent)] text-lg italic">
              {content.clinicName[0]}
            </span>
          </div>
          <div>
            <div className="display text-lg tracking-[0.15em] uppercase">{content.clinicName}</div>
            {content.doctorName && (
              <div className="text-[10px] tracking-widest text-[var(--fg-muted)] uppercase">
                By {content.doctorName}
              </div>
            )}
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
          {content.navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {resolve(item.label, locale)}
            </a>
          ))}
        </nav>
        {content.ctaLabel && (
          <a
            href={content.ctaHref ?? '#contacto'}
            className="inline-flex items-center h-9 px-4 text-sm bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium"
            style={{ borderRadius: 'var(--radius)' }}
          >
            {resolve(content.ctaLabel, locale)}
          </a>
        )}
      </div>
    </header>
  )
}
