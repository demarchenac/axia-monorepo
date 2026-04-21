import { resolve } from '../../lib/content-helpers'
import type { SectionProps, HeaderContent } from '../types'

export const meta = {
  type: 'header' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

interface ClinicoHeaderContent extends HeaderContent {
  topBar?: {
    address: Record<string, string>
    schedule: Record<string, string>
    phone: string
    phoneDisplay: string
  }
}

export function HeaderClinico({ content, locale }: SectionProps<ClinicoHeaderContent>) {
  return (
    <>
      {content.topBar && (
        <div className="bg-[var(--bg-alt)] border-b border-[var(--border)] text-xs">
          <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-6 text-[var(--fg-muted)]">
              <span>📍 {resolve(content.topBar.address, locale)}</span>
              <span className="hidden md:inline">⏱ {resolve(content.topBar.schedule, locale)}</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={`tel:+${content.topBar.phone}`} className="text-[var(--primary)] font-medium">
                {content.topBar.phoneDisplay}
              </a>
            </div>
          </div>
        </div>
      )}
      <header className="border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-fg)] font-bold text-lg">
              {content.clinicName[0]}
            </div>
            <div>
              <div className="font-semibold text-lg leading-tight">{content.clinicName}</div>
              {content.doctorName && (
                <div className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">
                  {content.doctorName}
                </div>
              )}
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            {content.navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-[var(--primary)]">
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
    </>
  )
}
