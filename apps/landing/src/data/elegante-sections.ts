import { clinica, whatsappLink } from './clinica'
import { servicios } from './servicios'
import { equipo } from './equipo'
import { testimonios } from './testimonios'
import { i18n } from '@talvu/blocks/lib/content-helpers'
import type { SectionDefinition } from '@talvu/blocks/sections/types'

export function buildEleganteSections(video?: string): SectionDefinition[] {
  return [
    {
      id: 'header', type: 'header', variant: 'elegante', order: 0, visible: true,
      content: {
        clinicName: clinica.nombre,
        overlay: false,
        navItems: [
          { label: i18n('Servicios'), href: '#servicios' },
          { label: i18n('Equipo'), href: '#equipo' },
          { label: i18n('Pacientes'), href: '#testimonios' },
          { label: i18n('Contacto'), href: '#contacto' },
        ],
        ctaLabel: i18n('Agendar'),
        ctaHref: whatsappLink(),
      },
    },
    {
      id: 'hero', type: 'hero', variant: video ? 'elegante-video' : 'elegante-image', order: 1, visible: true,
      content: {
        heading: i18n('La sonrisa,'),
        headingAccent: i18n('una obra de arte personal.'),
        subheading: i18n('Diseñamos cada sonrisa como una pieza única. Combinamos tecnología de vanguardia con la atención artesanal que mereces.'),
        badge: i18n(`By ${clinica.doctor}`),
        videoUrl: video,
        ctas: [
          { label: i18n('Agendar consulta'), href: whatsappLink(), variant: 'primary' as const },
          { label: i18n('Conocer servicios →'), href: '#servicios', variant: 'secondary' as const },
        ],
      },
    },
    {
      id: 'services', type: 'services', variant: 'elegante', order: 2, visible: true,
      content: {
        eyebrow: i18n('Nuestros Servicios'),
        heading: i18n('Once tratamientos, una sola filosofía'),
        subheading: i18n(''),
        items: servicios.map((s) => ({
          name: i18n(s.nombre),
          description: i18n(s.descripcionLarga),
        })),
      },
    },
    {
      id: 'team', type: 'team', variant: 'elegante', order: 3, visible: true,
      content: {
        eyebrow: i18n('Nuestro Equipo'),
        heading: i18n('Especialistas con alma'),
        subheading: i18n(''),
        members: equipo.map((d) => ({
          name: d.nombre,
          role: i18n(d.rol),
          bio: i18n(d.bio),
          photoUrl: d.foto,
          specialties: d.especialidades,
        })),
      },
    },
    {
      id: 'testimonials', type: 'testimonials', variant: 'elegante', order: 4, visible: true,
      content: {
        eyebrow: i18n('Pacientes'),
        heading: i18n('Voces que nos honran'),
        items: testimonios.map((t) => ({
          name: t.nombre,
          location: t.ciudad,
          service: t.servicio,
          text: i18n(t.texto),
          rating: t.rating,
        })),
      },
    },
    {
      id: 'cta', type: 'cta-contact', variant: 'elegante', order: 5, visible: true,
      content: {
        eyebrow: i18n('Comencemos'),
        heading: i18n('Tu próxima sonrisa te está esperando.'),
        subheading: i18n('Agenda tu valoración inicial. Te escuchamos sin compromiso.'),
        cta: { label: i18n('Escríbenos por WhatsApp'), href: whatsappLink() },
        details: [
          { label: i18n('Teléfono'), text: i18n(clinica.whatsappDisplay) },
          { label: i18n('Dirección'), text: i18n(clinica.direccion) },
          { label: i18n('Horario'), text: i18n(clinica.horario) },
        ],
      },
    },
    {
      id: 'footer', type: 'footer', variant: 'elegante', order: 6, visible: true,
      content: { clinicName: clinica.nombre },
    },
  ]
}
