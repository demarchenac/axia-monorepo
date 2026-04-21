import { resolve } from '../../lib/content-helpers'
import type { SectionProps, HeaderContent } from '../types'

export const meta = {
  type: 'header' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function HeaderCalido({ content, locale }: SectionProps<HeaderContent>) {
  const { clinicName, doctorName, navItems, overlay } = content

  if (overlay) {
    return (
      <header className="absolute top-0 left-0 right-0 z-30 px-6 pt-6">
        <div
          className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 flex items-center justify-between"
          style={{ borderRadius: 'var(--radius)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="h-11 w-11 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-xl"
              style={{ borderRadius: 'calc(var(--radius) * 0.7)' }}
            >
              ✦
            </div>
            <div>
              <div className="font-semibold text-lg leading-tight text-white">{clinicName}</div>
              {doctorName && <div className="text-xs text-white/60">{doctorName}</div>}
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/90">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="hover:text-white">
                {resolve(item.label, locale)}
              </a>
            ))}
          </nav>
        </div>
      </header>
    )
  }

  return (
    <header className="px-6 pt-6">
      <div
        className="max-w-7xl mx-auto bg-[var(--card)] border border-[var(--border)] px-6 py-4 flex items-center justify-between"
        style={{ borderRadius: 'var(--radius)' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="h-11 w-11 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-xl"
            style={{ borderRadius: 'calc(var(--radius) * 0.7)' }}
          >
            ✦
          </div>
          <div>
            <div className="font-semibold text-lg leading-tight">{clinicName}</div>
            {doctorName && <div className="text-xs text-[var(--fg-muted)]">{doctorName}</div>}
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="hover:text-[var(--primary)]">
              {resolve(item.label, locale)}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
