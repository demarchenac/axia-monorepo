import type { CSSProperties } from 'react'
import type { ThemeTokens } from '~/themes/tokens'
import { ScrollIndicator } from './ScrollIndicator'

type Props = {
  tokens: ThemeTokens
  children: React.ReactNode
}

export function ThemeProvider({ tokens, children }: Props) {
  return (
    <div data-theme style={tokens as CSSProperties}>
      {children}
      <ScrollIndicator />
    </div>
  )
}
