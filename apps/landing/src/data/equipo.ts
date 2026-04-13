export type Doctor = {
  nombre: string
  rol: string
  bio: string
  foto: string
  especialidades: string[]
}

export const equipo: Doctor[] = [
  {
    nombre: 'Dr. Francisco Díaz',
    rol: 'Director Médico · Rehabilitación Oral',
    bio: 'Especialista en rehabilitación oral con más de 12 años de experiencia. Fundador de Axia Odontología y referente en diseño de sonrisa en Barranquilla.',
    foto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80',
    especialidades: ['Diseño de Sonrisa', 'Implantes', 'Rehabilitación Oral'],
  },
  {
    nombre: 'Dra. Camila Restrepo',
    rol: 'Ortodoncia y Odontología Estética',
    bio: 'Ortodoncista certificada en alineadores invisibles. Apasionada por crear sonrisas armónicas que respetan las facciones de cada paciente.',
    foto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80',
    especialidades: ['Ortodoncia', 'Alineadores Invisibles', 'Estética'],
  },
  {
    nombre: 'Dr. Mateo Vargas',
    rol: 'Odontopediatría',
    bio: 'Especialista en odontología infantil. Su enfoque cálido y paciente convierte cada visita en una experiencia positiva para los niños.',
    foto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80',
    especialidades: ['Odontología Pediátrica', 'Prevención', 'Manejo Conductual'],
  },
]
