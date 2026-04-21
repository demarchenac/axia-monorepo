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
  video?: string
}
