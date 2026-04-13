export type Servicio = {
  slug: string
  nombre: string
  descripcionCorta: string
  descripcionLarga: string
  destacado?: boolean
}

export const servicios: Servicio[] = [
  {
    slug: 'diseno-de-sonrisa',
    nombre: 'Diseño de Sonrisa',
    descripcionCorta: 'Diseñamos tu sonrisa ideal con tecnología digital y arte odontológico.',
    descripcionLarga:
      'Combinamos planeación digital, carillas de porcelana y un análisis facial completo para crear una sonrisa que se ve natural y se siente tuya.',
    destacado: true,
  },
  {
    slug: 'implantes-dentales',
    nombre: 'Implantes Dentales',
    descripcionCorta: 'Reemplaza dientes perdidos con implantes que duran toda la vida.',
    descripcionLarga:
      'Implantes de titanio de grado médico colocados con guías quirúrgicas digitales para máxima precisión, mínima invasión y resultados estéticos impecables.',
    destacado: true,
  },
  {
    slug: 'ortodoncia',
    nombre: 'Ortodoncia / Brackets',
    descripcionCorta: 'Brackets tradicionales, autoligados y alineadores invisibles.',
    descripcionLarga:
      'Tratamientos de ortodoncia para todas las edades, desde brackets metálicos hasta alineadores transparentes invisibles para adultos.',
  },
  {
    slug: 'blanqueamiento',
    nombre: 'Blanqueamiento',
    descripcionCorta: 'Aclara tu sonrisa varios tonos en una sola sesión.',
    descripcionLarga:
      'Blanqueamiento profesional en consultorio con luz LED y fórmulas seguras para el esmalte. Resultados visibles desde la primera sesión.',
  },
  {
    slug: 'endodoncia',
    nombre: 'Endodoncia',
    descripcionCorta: 'Tratamientos de conducto sin dolor con tecnología rotatoria.',
    descripcionLarga:
      'Endodoncias modernas con instrumentación rotatoria, microscopio y anestesia avanzada para una experiencia confortable y resultados duraderos.',
  },
  {
    slug: 'periodoncia',
    nombre: 'Periodoncia',
    descripcionCorta: 'Cuidamos las encías, fundamento de toda sonrisa saludable.',
    descripcionLarga:
      'Diagnóstico, prevención y tratamiento de enfermedades de las encías. La salud periodontal es la base de todo tratamiento estético.',
  },
  {
    slug: 'odontologia-pediatrica',
    nombre: 'Odontología Pediátrica',
    descripcionCorta: 'Atención especializada para los más pequeños de la casa.',
    descripcionLarga:
      'Una experiencia diseñada para niños: lenguaje amigable, técnicas de manejo conductual y un ambiente que vuelve la visita al dentista algo divertido.',
  },
  {
    slug: 'protesis',
    nombre: 'Prótesis y Coronas',
    descripcionCorta: 'Coronas y prótesis personalizadas con cerámicas de alta gama.',
    descripcionLarga:
      'Prótesis fijas y removibles fabricadas con cerámicas de última generación, indistinguibles de los dientes naturales en color y translucidez.',
  },
  {
    slug: 'cirugia-oral',
    nombre: 'Cirugía Oral',
    descripcionCorta: 'Extracciones, cordales y cirugía maxilofacial menor.',
    descripcionLarga:
      'Procedimientos quirúrgicos realizados con técnicas mínimamente invasivas para una recuperación más rápida y cómoda.',
  },
  {
    slug: 'limpieza',
    nombre: 'Limpieza y Profilaxis',
    descripcionCorta: 'Higiene profesional cada 6 meses para una sonrisa radiante.',
    descripcionLarga:
      'Eliminación de placa, sarro y manchas con ultrasonido y pulido profesional. La cita más importante para mantener tu sonrisa sana.',
  },
  {
    slug: 'rehabilitacion-oral',
    nombre: 'Rehabilitación Oral',
    descripcionCorta: 'Devolvemos forma, función y estética a casos complejos.',
    descripcionLarga:
      'Tratamientos integrales que combinan implantes, prótesis, periodoncia y estética para casos de pérdida dental múltiple o desgaste severo.',
    destacado: true,
  },
]

export const serviciosDestacados = servicios.filter((s) => s.destacado)
