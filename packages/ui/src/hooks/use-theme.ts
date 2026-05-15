import { useSyncExternalStore, useCallback } from 'react'

type Theme = 'light' | 'dark'

const KEY = 'theme'

function getTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = localStorage.getItem(KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark')
}

let listeners: Array<() => void> = []

function subscribe(cb: () => void) {
  listeners.push(cb)
  return () => {
    listeners = listeners.filter((l) => l !== cb)
  }
}

function getSnapshot(): Theme {
  return getTheme()
}

function getServerSnapshot(): Theme {
  return 'light'
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const toggleTheme = useCallback(() => {
    const next: Theme = getTheme() === 'dark' ? 'light' : 'dark'
    localStorage.setItem(KEY, next)
    applyTheme(next)
    listeners.forEach((l) => l())
  }, [])

  return { theme, toggleTheme } as const
}
