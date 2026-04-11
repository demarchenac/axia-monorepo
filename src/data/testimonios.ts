export type Testimonio = {
  nombre: string
  ciudad: string
  servicio: string
  texto: string
  rating: number
}

export const testimonios: Testimonio[] = [
  {
    nombre: 'María Fernanda L.',
    ciudad: 'Barranquilla, Colombia',
    servicio: 'Diseño de Sonrisa',
    texto:
      'Jamás imaginé sonreír así. El Dr. Francisco escuchó cada detalle de lo que quería y el resultado superó todas mis expectativas. Es como tener una sonrisa nueva que parece siempre haber sido mía.',
    rating: 5,
  },
  {
    nombre: 'Carlos A. Mendoza',
    ciudad: 'Miami, USA',
    servicio: 'Implantes Dentales',
    texto:
      'Vine desde Miami por recomendación de un amigo. La atención fue impecable, el costo muchísimo más razonable que en Estados Unidos y el resultado de los implantes es de primera clase mundial.',
    rating: 5,
  },
  {
    nombre: 'Sofía Restrepo',
    ciudad: 'Medellín, Colombia',
    servicio: 'Ortodoncia Invisible',
    texto:
      'Tres años usando los alineadores y nadie notó que los tenía puestos. La atención de la Dra. Camila siempre cálida, siempre puntual. 100% recomendados.',
    rating: 5,
  },
  {
    nombre: 'Andrés Pérez',
    ciudad: 'Barranquilla, Colombia',
    servicio: 'Rehabilitación Oral',
    texto:
      'Llegué con un caso complejo después de años evitando al dentista. El equipo de Axia me devolvió la confianza para volver a sonreír sin tapar mi boca. Cambió mi vida.',
    rating: 5,
  },
  {
    nombre: 'Laura Tatiana Gómez',
    ciudad: 'Cali, Colombia',
    servicio: 'Blanqueamiento',
    texto:
      'Súper rápido y sin sensibilidad. Salí en una hora con varios tonos más claros. Las fotos del antes y después son sorprendentes.',
    rating: 5,
  },
  {
    nombre: 'Jennifer Walker',
    ciudad: 'Toronto, Canadá',
    servicio: 'Coronas y Estética',
    texto:
      'They speak English perfectly and helped me coordinate my whole trip. The work is beautiful and the price was a fraction of what I would have paid back home.',
    rating: 5,
  },
]
