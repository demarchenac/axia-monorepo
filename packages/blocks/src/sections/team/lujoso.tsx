import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TeamContent } from '../types'

export const meta = {
  type: 'team' as const,
  variant: 'lujoso',
  recommendedFamilies: ['lujoso-y-premium'],
}

export function TeamLujoso({ content, locale, sectionId }: SectionProps<TeamContent>) {
  return (
    <section id={sectionId ?? 'equipo'} className="bg-[var(--bg-alt)] py-32 border-y border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-10">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">
            — {resolve(content.eyebrow, locale)} —
          </p>
          <h2 className="display text-5xl md:text-6xl italic">
            {resolve(content.heading, locale)}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {content.members.map((d) => (
            <div
              key={d.name}
              className="border border-[var(--border)] bg-[var(--bg)] p-8 hover:border-[var(--accent)] transition-colors"
            >
              <div className="aspect-[3/4] mb-6 overflow-hidden">
                <img
                  src={d.photoUrl}
                  alt={d.name}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                />
              </div>
              <h3 className="display text-2xl italic mb-2">{d.name}</h3>
              <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-4">
                {resolve(d.role, locale)}
              </p>
              <p className="text-[var(--fg-muted)] text-sm leading-relaxed text-justify">
                {resolve(d.bio, locale)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
