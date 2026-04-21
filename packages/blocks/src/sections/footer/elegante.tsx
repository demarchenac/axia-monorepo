import type { SectionProps, FooterContent } from '../types'

export const meta = {
  type: 'footer' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function FooterElegante({ content }: SectionProps<FooterContent>) {
  return (
    <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--fg-muted)] tracking-widest uppercase">
      © {new Date().getFullYear()} {content.clinicName} · Todos los derechos reservados
    </footer>
  )
}
