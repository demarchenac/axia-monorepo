// Theme tokens for the 4 visual families × 3 palettes each.
// Each theme is injected as inline CSS variables on a [data-theme] wrapper.

export type ThemeTokens = {
  '--bg': string
  '--bg-alt': string
  '--fg': string
  '--fg-muted': string
  '--primary': string
  '--primary-fg': string
  '--accent': string
  '--accent-fg': string
  '--border': string
  '--card': string
  '--card-fg': string
  '--radius': string
  '--font-body': string
  '--font-display': string
  '--scrollbar-thumb'?: string
  '--scrollbar-thumb-hover'?: string
}

export type FamiliaSlug =
  | 'elegante-y-sofisticado'
  | 'lujoso-y-premium'
  | 'clinico-y-profesional'
  | 'calido-y-amigable'

export type Variante = {
  familia: FamiliaSlug
  paleta: string
  label: string
  descripcion: string
  tokens: ThemeTokens
  video?: string // path to video file in /public/videos/
}

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
