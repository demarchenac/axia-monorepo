import { clinica, whatsappLink } from './clinica'
import { servicios } from './servicios'
import { equipo } from './equipo'
import { testimonios } from './testimonios'
import { i18n } from '@talvu/blocks/lib/content-helpers'
import type { SectionDefinition } from '@talvu/blocks/sections/types'

export function buildClinicoSections(video?: string): SectionDefinition[] {
  return [
    {
      id: 'header', type: 'header', variant: 'clinico', order: 0, visible: true,
      content: {
        clinicName: clinica.nombre,
        doctorName: clinica.doctor,
        overlay: false,
        navItems: [
          { label: i18n('Servicios'), href: '#servicios' },
          { label: i18n('Equipo médico'), href: '#equipo' },
          { label: i18n('Pacientes'), href: '#testimonios' },
          { label: i18n('Contacto'), href: '#contacto' },
        ],
        ctaLabel: i18n('Agendar cita'),
        ctaHref: whatsappLink(),
        topBar: {
          address: i18n(clinica.direccion),
          schedule: i18n(clinica.horario),
          phone: clinica.whatsapp,
          phoneDisplay: clinica.whatsappDisplay,
        },
      },
    },
    {
      id: 'hero', type: 'hero', variant: video ? 'clinico-video' : 'clinico-image', order: 1, visible: true,
      content: {
        heading: i18n('Salud dental con la'),
        headingAccent: i18n('precisión que mereces.'),
        subheading: i18n(`${clinica.nombre} reúne especialistas certificados, tecnología de punta y un protocolo de atención centrado en ti. Resultados clínicos comprobables en cada visita.`),
        badge: i18n('Atención certificada · Tecnología de vanguardia'),
        imageUrl: video ? undefined : 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85',
        videoUrl: video,
        socialProof: {
          rating: '4.9',
          ratingSource: i18n('en Google'),
          extraText: i18n('+8.500 pacientes'),
        },
        highlightStat: { value: '12+', label: i18n('Años cuidando sonrisas') },
        ctas: [
          { label: i18n('Agendar consulta'), href: whatsappLink(), variant: 'primary' as const },
          { label: i18n('Ver tratamientos'), href: '#servicios', variant: 'secondary' as const },
        ],
      },
    },
    {
      id: 'stats', type: 'stats', variant: 'clinico', order: 2, visible: true,
      content: {
        items: [
          { value: '12+', label: i18n('Años de experiencia') },
          { value: '8.500+', label: i18n('Pacientes atendidos') },
          { value: '11', label: i18n('Especialidades') },
          { value: '4.9★', label: i18n('Calificación Google') },
        ],
      },
    },
    {
      id: 'services', type: 'services', variant: 'clinico', order: 3, visible: true,
      content: {
        eyebrow: i18n('Especialidades'),
        heading: i18n('Tratamientos para cada necesidad'),
        subheading: i18n('Once especialidades clínicas bajo un mismo techo, lideradas por profesionales certificados.'),
        items: servicios.map((s) => ({
          name: i18n(s.nombre),
          description: i18n(s.descripcionLarga),
          cta: { label: i18n('Consultar →'), href: whatsappLink(s.nombre) },
        })),
      },
    },
    {
      id: 'team', type: 'team', variant: 'clinico', order: 4, visible: true,
      content: {
        eyebrow: i18n('Equipo Médico'),
        heading: i18n('Profesionales certificados'),
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
      id: 'testimonials', type: 'testimonials', variant: 'clinico', order: 5, visible: true,
      content: {
        eyebrow: i18n('Pacientes'),
        heading: i18n('Lo que dicen quienes nos visitan'),
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
      id: 'cta', type: 'cta-contact', variant: 'clinico', order: 6, visible: true,
      content: {
        heading: i18n('Agenda tu cita hoy'),
        subheading: i18n('Atención el mismo día disponible. Respuesta inmediata por WhatsApp.'),
        cta: {
          label: i18n('Escribir por WhatsApp'),
          href: whatsappLink(),
          className: 'bg-white text-[var(--primary)] hover:bg-white/90 h-14 px-8 inline-flex items-center font-medium transition-all',
        },
        details: [
          { icon: '📍', text: i18n(clinica.direccion) },
          { icon: '⏱', text: i18n(clinica.horario) },
          { icon: '📞', text: i18n(clinica.whatsappDisplay) },
          { icon: '✉️', text: i18n(clinica.email) },
        ],
      },
    },
    {
      id: 'footer', type: 'footer', variant: 'clinico', order: 7, visible: true,
      content: { clinicName: clinica.nombre, doctorName: clinica.doctor },
    },
  ]
}
