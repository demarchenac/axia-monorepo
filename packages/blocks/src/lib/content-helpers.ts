export function i18n(value: string, locale = 'es'): Record<string, string> {
  return { [locale]: value }
}

export function resolve(field: Record<string, string>, locale: string): string {
  return field[locale] ?? field['es'] ?? Object.values(field)[0] ?? ''
}
