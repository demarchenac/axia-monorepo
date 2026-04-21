import type { SectionProps, FooterContent } from '../types'

export const meta = {
  type: 'footer' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function FooterLujoso({ content }: SectionProps<FooterContent>) {
  return (
    <footer className="border-t border-[var(--border)] py-10 text-center text-xs tracking-[0.25em] uppercase text-[var(--fg-muted)]">
      © {new Date().getFullYear()} · {content.clinicName}
      {content.doctorName && <> · By {content.doctorName}</>}
    </footer>
  )
}
