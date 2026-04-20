import { clinica, whatsappLink } from './clinica'
import { servicios } from './servicios'
import { equipo } from './equipo'
import { testimonios } from './testimonios'
import { i18n } from '@talvu/ui/lib/content-helpers'
import type { SectionDefinition } from '@talvu/ui/sections/types'
import type {
  HeaderContent,
  HeroContent,
  ServicesContent,
  TeamContent,
  TestimonialsContent,
  CtaContent,
  FooterContent,
} from '@talvu/ui/sections/types'

export function buildCalidoSections(video?: string): SectionDefinition[] {
  const header: HeaderContent = {
    clinicName: clinica.nombre,
    doctorName: clinica.doctor,
    overlay: !!video,
    navItems: [
      { label: i18n('Lo que hacemos'), href: '#servicios' },
      { label: i18n('Nuestro equipo'), href: '#equipo' },
      { label: i18n('Historias'), href: '#testimonios' },
    ],
  }

  const hero: HeroContent = {
    heading: i18n('Acá no hay miedo al dentista.'),
    headingAccent: i18n('Solo sonrisas.'),
    subheading: i18n(
      `En ${clinica.nombre} te recibimos como a alguien de la familia. Tomamos café juntos, te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.`
    ),
    badge: video ? undefined : i18n('Atención cálida desde 2013'),
    ctas: [
      { label: i18n('Agendar mi visita'), href: whatsappLink(), variant: 'primary' },
      { label: i18n('¿Qué hacemos?'), href: '#servicios', variant: 'secondary' },
    ],
    imageUrl: video
      ? undefined
      : 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85',
    videoUrl: video,
    promiseCards: video
      ? undefined
      : [
          {
            emoji: '☕',
            title: i18n('Café de bienvenida'),
            description: i18n('Llegas, te recibimos, conversamos.'),
          },
          {
            emoji: '👶',
            title: i18n('Amigos de los niños'),
            description: i18n('Sin lágrimas, lo prometemos.'),
          },
          {
            emoji: '💬',
            title: i18n('Sin tecnicismos'),
            description: i18n('Te explicamos como a un amigo.'),
          },
        ],
  }

  const services: ServicesContent = {
    eyebrow: i18n('¿Qué hacemos?'),
    heading: i18n('Cuidamos tu sonrisa, completa.'),
    subheading: i18n('Once tratamientos pensados para acompañarte en cada etapa de tu vida.'),
    items: servicios.map((s) => ({
      name: i18n(s.nombre),
      description: i18n(s.descripcionLarga),
      cta: {
        label: i18n('Pregúntanos →'),
        href: whatsappLink(s.nombre),
      },
    })),
  }

  const team: TeamContent = {
    eyebrow: i18n('El equipo'),
    heading: i18n('Caras amigas'),
    subheading: i18n('Personas reales, cercanas y profundamente buenas en lo que hacen.'),
    members: equipo.map((d) => ({
      name: d.nombre,
      role: i18n(d.rol),
      bio: i18n(d.bio),
      photoUrl: d.foto,
    })),
  }

  const testimonialsContent: TestimonialsContent = {
    eyebrow: i18n('Historias reales'),
    heading: i18n('Lo que cuentan nuestros pacientes'),
    items: testimonios.map((t) => ({
      name: t.nombre,
      location: t.ciudad,
      service: t.servicio,
      text: i18n(t.texto),
      rating: t.rating,
    })),
  }

  const cta: CtaContent = {
    emoji: '😊',
    heading: i18n('¿Listos para sonreír juntos?'),
    subheading: i18n(
      'Escríbenos por WhatsApp y te ayudamos a agendar tu primera visita. Te respondemos rapidito 🌸'
    ),
    cta: {
      label: i18n('¡Quiero agendar! 💌'),
      href: whatsappLink(),
      className: 'bg-white text-[var(--primary)] hover:bg-white/90 h-14 px-8 inline-flex items-center font-medium transition-all',
    },
    details: [
      { icon: '📍', text: i18n(clinica.direccion) },
      { icon: '⏰', text: i18n(clinica.horario) },
      { icon: '📱', text: i18n(clinica.whatsappDisplay) },
    ],
  }

  const footer: FooterContent = {
    clinicName: clinica.nombre,
  }

  return [
    { id: 'header', type: 'header', variant: 'calido', order: 0, content: header, visible: true },
    {
      id: 'hero',
      type: 'hero',
      variant: video ? 'calido-video' : 'calido-image',
      order: 1,
      content: hero,
      visible: true,
    },
    { id: 'services', type: 'services', variant: 'calido', order: 2, content: services, visible: true },
    { id: 'team', type: 'team', variant: 'calido', order: 3, content: team, visible: true },
    {
      id: 'testimonials',
      type: 'testimonials',
      variant: 'calido',
      order: 4,
      content: testimonialsContent,
      visible: true,
    },
    { id: 'cta', type: 'cta-contact', variant: 'calido', order: 5, content: cta, visible: true },
    { id: 'footer', type: 'footer', variant: 'calido', order: 6, content: footer, visible: true },
  ]
}
