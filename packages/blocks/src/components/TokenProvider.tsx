import { createContext, useContext, type CSSProperties, type ReactNode } from 'react'
import type { ThemeTokens } from '../lib/theme-tokens'

const TokenContext = createContext<ThemeTokens | null>(null)

export function useTokens(): ThemeTokens {
  const ctx = useContext(TokenContext)
  if (!ctx) throw new Error('useTokens must be used within TokenProvider')
  return ctx
}

export function TokenProvider({ tokens, children }: { tokens: ThemeTokens; children: ReactNode }) {
  return (
    <TokenContext value={tokens}>
      <div data-theme style={tokens as CSSProperties}>
        {children}
      </div>
    </TokenContext>
  )
}
