import type { SectionProps, FooterContent } from '../types'

export const meta = {
  type: 'footer' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function FooterClinico({ content }: SectionProps<FooterContent>) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] py-8 text-center text-sm text-[var(--fg-muted)]">
      © {new Date().getFullYear()} {content.clinicName}
      {content.doctorName && <> · {content.doctorName}</>}
      {' · Todos los derechos reservados'}
    </footer>
  )
}
