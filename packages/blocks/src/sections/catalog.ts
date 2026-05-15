import { sectionRegistry } from './registry'

export type SectionCatalogEntry = {
  type: string
  label: Record<string, string>
  description: Record<string, string>
  availableVariants: string[]
}

function variantsForType(type: string): string[] {
  return Object.keys(sectionRegistry)
    .filter((key) => key.startsWith(`${type}::`))
    .map((key) => key.slice(type.length + 2))
}

export const SECTION_CATALOG: SectionCatalogEntry[] = [
  {
    type: 'header',
    label: { es: 'Encabezado', en: 'Header' },
    description: { es: 'Navegación con nombre de la clínica y botón de acción', en: 'Navigation with clinic name and CTA' },
    availableVariants: variantsForType('header'),
  },
  {
    type: 'hero',
    label: { es: 'Hero', en: 'Hero' },
    description: { es: 'Sección principal con imagen o video, título y llamado a la acción', en: 'Main section with image or video, heading, and CTA' },
    availableVariants: variantsForType('hero'),
  },
  {
    type: 'services',
    label: { es: 'Servicios', en: 'Services' },
    description: { es: 'Lista de servicios con nombre, descripción y precio', en: 'Service list with name, description, and pricing' },
    availableVariants: variantsForType('services'),
  },
  {
    type: 'team',
    label: { es: 'Equipo', en: 'Team' },
    description: { es: 'Miembros del equipo con foto, rol y especialidad', en: 'Team members with photo, role, and specialty' },
    availableVariants: variantsForType('team'),
  },
  {
    type: 'testimonials',
    label: { es: 'Testimonios', en: 'Testimonials' },
    description: { es: 'Reseñas de pacientes con calificación', en: 'Patient reviews with rating' },
    availableVariants: variantsForType('testimonials'),
  },
  {
    type: 'stats',
    label: { es: 'Estadísticas', en: 'Stats' },
    description: { es: 'Métricas clave del negocio (pacientes atendidos, años de experiencia, etc.)', en: 'Key business metrics' },
    availableVariants: variantsForType('stats'),
  },
  {
    type: 'cta-contact',
    label: { es: 'Contacto / CTA', en: 'Contact / CTA' },
    description: { es: 'Llamado a la acción con datos de contacto', en: 'Call to action with contact details' },
    availableVariants: variantsForType('cta-contact'),
  },
  {
    type: 'footer',
    label: { es: 'Pie de página', en: 'Footer' },
    description: { es: 'Pie de página con nombre de la clínica', en: 'Footer with clinic name' },
    availableVariants: variantsForType('footer'),
  },
]
