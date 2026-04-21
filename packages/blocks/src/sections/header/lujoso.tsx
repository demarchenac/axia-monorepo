import { resolve } from '../../lib/content-helpers'
import type { SectionProps, HeaderContent } from '../types'

export const meta = {
  type: 'header' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function HeaderLujoso({ content, locale }: SectionProps<HeaderContent>) {
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
