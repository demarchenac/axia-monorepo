import type { ComponentType } from 'react'

// --- Section component contract ---

export interface SectionProps<TContent = unknown> {
  content: TContent
  locale: string
  sectionId?: string
}

// --- Content interfaces per section type ---

export interface I18nCta {
  label: Record<string, string>
  href: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export interface HeaderContent {
  clinicName: string
  doctorName?: string
  navItems: Array<{ label: Record<string, string>; href: string }>
  ctaLabel?: Record<string, string>
  ctaHref?: string
  overlay: boolean
}

export interface PromiseCard {
  emoji: string
  title: Record<string, string>
  description: Record<string, string>
}

export interface HeroContent {
  heading: Record<string, string>
  headingAccent?: Record<string, string>
  subheading: Record<string, string>
  badge?: Record<string, string>
  ctas: I18nCta[]
  imageUrl?: string
  videoUrl?: string
  // Included in hero for now — can be extracted to its own section later
  promiseCards?: PromiseCard[]
}

export interface ServiceItem {
  name: Record<string, string>
  description: Record<string, string>
  cta?: I18nCta
}

export interface ServicesContent {
  eyebrow: Record<string, string>
  heading: Record<string, string>
  subheading: Record<string, string>
  items: ServiceItem[]
}

export interface TeamMember {
  name: string
  role: Record<string, string>
  bio: Record<string, string>
  photoUrl: string
  specialties?: string[]
}

export interface TeamContent {
  eyebrow: Record<string, string>
  heading: Record<string, string>
  subheading: Record<string, string>
  members: TeamMember[]
}

export interface TestimonialItem {
  name: string
  location: string
  service: string
  text: Record<string, string>
  rating: number
}

export interface TestimonialsContent {
  eyebrow: Record<string, string>
  heading: Record<string, string>
  items: TestimonialItem[]
}

export interface StatsItem {
  value: string
  label: Record<string, string>
}

export interface StatsContent {
  items: StatsItem[]
}

export interface CtaContent {
  eyebrow?: Record<string, string>
  emoji?: string
  heading: Record<string, string>
  subheading: Record<string, string>
  cta: I18nCta
  details: Array<{ icon: string; label?: Record<string, string>; text: Record<string, string> }>
}

export interface FooterContent {
  clinicName: string
  doctorName?: string
  text?: Record<string, string>
}

// --- Section definition for the renderer ---

export interface SectionDefinition {
  id: string
  type: string
  variant: string
  order: number
  content: unknown
  visible: boolean
}

// --- Registry types ---

export type SectionComponent = ComponentType<SectionProps<any>>
