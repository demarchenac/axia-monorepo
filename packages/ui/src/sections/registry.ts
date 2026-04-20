import type { SectionComponent } from './types'
import { HeaderCalido } from './header'
import { HeroCalidoImage, HeroCalidoVideo } from './hero'
import { ServicesCalido } from './services'
import { TeamCalido } from './team'
import { TestimonialsCalido } from './testimonials'
import { CtaCalido } from './cta-contact'
import { FooterCalido } from './footer'

export const sectionRegistry: Record<string, SectionComponent> = {
  'header::calido': HeaderCalido,
  'hero::calido-image': HeroCalidoImage,
  'hero::calido-video': HeroCalidoVideo,
  'services::calido': ServicesCalido,
  'team::calido': TeamCalido,
  'testimonials::calido': TestimonialsCalido,
  'cta-contact::calido': CtaCalido,
  'footer::calido': FooterCalido,
}

export function getSection(type: string, variant: string): SectionComponent | undefined {
  return sectionRegistry[`${type}::${variant}`]
}
