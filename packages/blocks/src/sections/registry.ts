import type { SectionComponent } from './types'
import { HeaderCalido, HeaderElegante, HeaderLujoso, HeaderClinico } from './header'
import { HeroCalidoImage, HeroCalidoVideo, HeroEleganteImage, HeroEleganteVideo, HeroLujosoImage, HeroLujosoVideo, HeroClinicoImage, HeroClinicoVideo } from './hero'
import { ServicesCalido, ServicesElegante, ServicesLujoso, ServicesClinico } from './services'
import { TeamCalido, TeamElegante, TeamLujoso, TeamClinico } from './team'
import { TestimonialsCalido, TestimonialsElegante, TestimonialsLujoso, TestimonialsClinico } from './testimonials'
import { CtaCalido, CtaElegante, CtaLujoso, CtaClinico } from './cta-contact'
import { FooterCalido, FooterElegante, FooterLujoso, FooterClinico } from './footer'
import { StatsClinico } from './stats'

export const sectionRegistry: Record<string, SectionComponent> = {
  // Calido
  'header::calido': HeaderCalido,
  'hero::calido-image': HeroCalidoImage,
  'hero::calido-video': HeroCalidoVideo,
  'services::calido': ServicesCalido,
  'team::calido': TeamCalido,
  'testimonials::calido': TestimonialsCalido,
  'cta-contact::calido': CtaCalido,
  'footer::calido': FooterCalido,
  // Elegante
  'header::elegante': HeaderElegante,
  'hero::elegante-image': HeroEleganteImage,
  'hero::elegante-video': HeroEleganteVideo,
  'services::elegante': ServicesElegante,
  'team::elegante': TeamElegante,
  'testimonials::elegante': TestimonialsElegante,
  'cta-contact::elegante': CtaElegante,
  'footer::elegante': FooterElegante,
  // Lujoso
  'header::lujoso': HeaderLujoso,
  'hero::lujoso-image': HeroLujosoImage,
  'hero::lujoso-video': HeroLujosoVideo,
  'services::lujoso': ServicesLujoso,
  'team::lujoso': TeamLujoso,
  'testimonials::lujoso': TestimonialsLujoso,
  'cta-contact::lujoso': CtaLujoso,
  'footer::lujoso': FooterLujoso,
  // Clinico
  'header::clinico': HeaderClinico,
  'hero::clinico-image': HeroClinicoImage,
  'hero::clinico-video': HeroClinicoVideo,
  'stats::clinico': StatsClinico,
  'services::clinico': ServicesClinico,
  'team::clinico': TeamClinico,
  'testimonials::clinico': TestimonialsClinico,
  'cta-contact::clinico': CtaClinico,
  'footer::clinico': FooterClinico,
}

export function getSection(type: string, variant: string): SectionComponent | undefined {
  return sectionRegistry[`${type}::${variant}`]
}
