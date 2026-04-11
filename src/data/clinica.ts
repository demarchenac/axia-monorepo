export const clinica = {
  nombre: 'Axia Odontología',
  tagline: 'Sonrisas que transforman vidas',
  doctor: 'Dr. Francisco Díaz',
  whatsapp: '573043218666', // formato wa.me, sin +
  whatsappDisplay: '+57 304 321 8666',
  email: 'contacto@axiaodontologia.com',
  ciudad: 'Barranquilla',
  direccion: 'Calle 84 #53-100, Barranquilla, Colombia',
  horario: 'Lun - Sáb · 8:00 a.m. — 7:00 p.m.',
  redes: {
    instagram: 'https://instagram.com/axiaodontologia',
    google: 'https://g.page/axiaodontologia',
    twitter: 'https://x.com/axiaodontologia',
  },
}

export const baseWhatsAppMessage = (servicio?: string) =>
  servicio
    ? `Hola, quiero agendar una cita en ${clinica.nombre} para ${servicio}.`
    : `Hola, quiero agendar una cita en ${clinica.nombre}.`

export const whatsappLink = (servicio?: string) =>
  `https://wa.me/${clinica.whatsapp}?text=${encodeURIComponent(baseWhatsAppMessage(servicio))}`
