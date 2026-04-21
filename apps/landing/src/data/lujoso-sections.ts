import { clinica, whatsappLink } from './clinica'
import { servicios } from './servicios'
import { equipo } from './equipo'
import { testimonios } from './testimonios'
import { i18n } from '@talvu/blocks/lib/content-helpers'
import type { SectionDefinition } from '@talvu/blocks/sections/types'

export function buildLujosoSections(video?: string): SectionDefinition[] {
  return [
    {
      id: 'header', type: 'header', variant: 'lujoso', order: 0, visible: true,
      content: {
        clinicName: clinica.nombre,
        doctorName: clinica.doctor,
        overlay: false,
        navItems: [
          { label: i18n('Servicios'), href: '#servicios' },
          { label: i18n('Maestros'), href: '#equipo' },
          { label: i18n('Pacientes'), href: '#testimonios' },
          { label: i18n('Reservar'), href: '#contacto' },
        ],
        ctaLabel: i18n('Reservar cita'),
        ctaHref: whatsappLink(),
      },
    },
    {
      id: 'hero', type: 'hero', variant: video ? 'lujoso-video' : 'lujoso-image', order: 1, visible: true,
      content: {
        heading: i18n('Una sonrisa extraordinaria merece manos extraordinarias.'),
        headingAccent: i18n('extraordinaria'),
        subheading: i18n(`Cada tratamiento en ${clinica.nombre} es una obra hecha a medida. Tecnología alemana, materiales suizos, atención de boutique.`),
        badge: i18n('— Atelier Odontológico —'),
        imageUrl: video ? undefined : 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1000&q=85',
        videoUrl: video,
        quote: i18n('Una experiencia digna de un hotel cinco estrellas.'),
        quoteAttribution: i18n('Vogue España, 2025'),
        ctas: [
          { label: i18n('Reservar valoración'), href: whatsappLink(), variant: 'primary' as const },
          { label: i18n('Conocer especialidades'), href: '#servicios', variant: 'secondary' as const },
        ],
      },
    },
    {
      id: 'services', type: 'services', variant: 'lujoso', order: 2, visible: true,
      content: {
        eyebrow: i18n('Especialidades'),
        heading: i18n('Once disciplinas, dominadas a la perfección.'),
        subheading: i18n('Cada especialidad en Axia está liderada por un maestro reconocido en su campo. No externalizamos, no derivamos: lo que hacemos, lo hacemos en casa.'),
        items: servicios.map((s) => ({
          name: i18n(s.nombre),
          description: i18n(s.descripcionLarga),
        })),
      },
    },
    {
      id: 'team', type: 'team', variant: 'lujoso', order: 3, visible: true,
      content: {
        eyebrow: i18n('Los Maestros'),
        heading: i18n('Quienes esculpen tu sonrisa'),
        subheading: i18n(''),
        members: equipo.map((d) => ({
          name: d.nombre,
          role: i18n(d.rol),
          bio: i18n(d.bio),
          photoUrl: d.foto,
        })),
      },
    },
    {
      id: 'testimonials', type: 'testimonials', variant: 'lujoso', order: 4, visible: true,
      content: {
        eyebrow: i18n('Voces'),
        heading: i18n(''),
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
      id: 'cta', type: 'cta-contact', variant: 'lujoso', order: 5, visible: true,
      content: {
        eyebrow: i18n('Reservar'),
        heading: i18n('Su sonrisa, nuestra obsesión.'),
        subheading: i18n('Atendemos por cita previa para garantizar la atención exclusiva que cada paciente merece.'),
        cta: { label: i18n('Reservar valoración privada'), href: whatsappLink() },
        details: [
          { label: i18n('Dirección'), text: i18n(clinica.direccion) },
          { label: i18n('Horario'), text: i18n(clinica.horario) },
          { label: i18n('WhatsApp'), text: i18n(clinica.whatsappDisplay) },
        ],
      },
    },
    {
      id: 'footer', type: 'footer', variant: 'lujoso', order: 6, visible: true,
      content: { clinicName: clinica.nombre, doctorName: clinica.doctor },
    },
  ]
}
