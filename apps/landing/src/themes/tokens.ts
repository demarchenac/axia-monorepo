import type { ThemeTokens, FamiliaSlug, Variante } from '@talvu/ui/lib/theme-tokens'
export type { ThemeTokens, FamiliaSlug, Variante }

import { eleganteVariantes } from './elegante'
import { lujosoVariantes } from './lujoso'
import { clinicoVariantes } from './clinico'
import { calidoVariantes } from './calido'

export const variantes: Variante[] = [
  ...eleganteVariantes,
  ...lujosoVariantes,
  ...clinicoVariantes,
  ...calidoVariantes,
]

export const variantesPorFamilia: Record<FamiliaSlug, Variante[]> = {
  'elegante-y-sofisticado': eleganteVariantes,
  'lujoso-y-premium': lujosoVariantes,
  'clinico-y-profesional': clinicoVariantes,
  'calido-y-amigable': calidoVariantes,
}

export function findVariante(familia: string, paleta: string): Variante | undefined {
  return variantes.find((v) => v.familia === familia && v.paleta === paleta)
}

export const familiaLabels: Record<FamiliaSlug, { label: string; tagline: string }> = {
  'elegante-y-sofisticado': {
    label: 'Elegante y Sofisticado',
    tagline:
      'Tipografía serif clásica, generosos espacios en blanco, una clínica que se siente como un atelier.',
  },
  'lujoso-y-premium': {
    label: 'Lujoso y Premium',
    tagline:
      'Fondos oscuros, dorados sutiles, contraste alto. Una clínica boutique para un público exclusivo.',
  },
  'clinico-y-profesional': {
    label: 'Clínico y Profesional',
    tagline:
      'Limpieza médica, tipografía sans, autoridad y confianza. Para pacientes que valoran la precisión.',
  },
  'calido-y-amigable': {
    label: 'Cálido y Amigable',
    tagline:
      'Tonos suaves, esquinas redondeadas, un tono humano y cercano. Ideal para familias y pacientes nerviosos.',
  },
}
