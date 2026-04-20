import { resolve } from '../../lib/content-helpers'
import type { SectionProps, FooterContent } from '../types'

export const meta = {
  type: 'footer' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function FooterCalido({ content, locale }: SectionProps<FooterContent>) {
  return (
    <footer className="py-8 text-center text-sm text-[var(--fg-muted)]">
      {content.text ? resolve(content.text, locale) : `Hecho con cariño · © ${new Date().getFullYear()} ${content.clinicName}`}
    </footer>
  )
}
