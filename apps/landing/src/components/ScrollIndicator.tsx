'use client'

import { useEffect, useRef } from 'react'

export function ScrollIndicator() {
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function update() {
      const el = thumbRef.current
      if (!el) return

      const { scrollTop, scrollHeight, clientHeight } = document.documentElement
      if (scrollHeight <= clientHeight) {
        el.style.opacity = '0'
        return
      }

      el.style.opacity = ''
      const trackH = clientHeight - 16 // account for top/bottom padding
      const ratio = clientHeight / scrollHeight
      const thumbH = Math.max(ratio * trackH, 30)
      const maxTop = trackH - thumbH
      const top = (scrollTop / (scrollHeight - clientHeight)) * maxTop

      el.style.height = `${thumbH}px`
      el.style.transform = `translateY(${top}px)`
    }

    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    update()

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 8,
        right: 6,
        bottom: 8,
        width: 6,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        ref={thumbRef}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          borderRadius: 9999,
          background: 'color-mix(in srgb, var(--scrollbar-thumb, var(--primary)) 45%, transparent)',
          backdropFilter: 'blur(12px) saturate(180%)',
          WebkitBackdropFilter: 'blur(12px) saturate(180%)',
          border: '0.5px solid color-mix(in srgb, var(--fg) 25%, transparent)',
          boxShadow: '0 0 6px color-mix(in srgb, var(--fg) 15%, transparent)',
        }}
      />
    </div>
  )
}
