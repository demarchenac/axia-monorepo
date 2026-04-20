import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TeamContent } from '../types'

export const meta = {
  type: 'team' as const,
  variant: 'calido',
  recommendedFamilies: ['calido-y-amigable'],
}

export function TeamCalido({ content, locale, sectionId }: SectionProps<TeamContent>) {
  return (
    <section id={sectionId ?? 'equipo'} className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">
          {resolve(content.eyebrow, locale)}
        </p>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          {resolve(content.heading, locale)}
        </h2>
        <p className="text-lg text-[var(--fg-muted)]">
          {resolve(content.subheading, locale)}
        </p>
      </div>
      <div className="grid md:grid-cols-3 gap-10">
        {content.members.map((d) => (
          <div key={d.name} className="text-center">
            <div className="relative inline-block mb-6">
              <div
                className="absolute inset-0 bg-[var(--accent)] opacity-30 -rotate-6"
                style={{ borderRadius: 'var(--radius)' }}
              />
              <img
                src={d.photoUrl}
                alt={d.name}
                className="relative w-56 h-56 object-cover mx-auto"
                style={{ borderRadius: '50%' }}
              />
            </div>
            <h3 className="text-2xl font-bold mb-1">{d.name}</h3>
            <p className="text-[var(--primary)] font-medium mb-4">{resolve(d.role, locale)}</p>
            <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-xs mx-auto">
              {resolve(d.bio, locale)}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
