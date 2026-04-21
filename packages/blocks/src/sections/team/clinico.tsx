import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TeamContent } from '../types'

export const meta = {
  type: 'team' as const,
  variant: 'clinico',
  recommendedFamilies: ['clinico-y-profesional'],
}

export function TeamClinico({ content, locale, sectionId }: SectionProps<TeamContent>) {
  return (
    <section id={sectionId ?? 'equipo'} className="bg-[var(--bg-alt)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">
            {resolve(content.eyebrow, locale)}
          </p>
          <h2 className="text-4xl md:text-5xl font-bold">
            {resolve(content.heading, locale)}
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {content.members.map((d) => (
            <div
              key={d.name}
              className="bg-[var(--card)] border border-[var(--border)] overflow-hidden"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <img src={d.photoUrl} alt={d.name} className="w-full aspect-[4/3] object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-1">{d.name}</h3>
                <p className="text-sm text-[var(--primary)] font-medium mb-3">
                  {resolve(d.role, locale)}
                </p>
                <p className="text-sm text-[var(--fg-muted)] leading-relaxed text-justify mb-4">
                  {resolve(d.bio, locale)}
                </p>
                {d.specialties && (
                  <div className="flex flex-wrap gap-2">
                    {d.specialties.map((e) => (
                      <span
                        key={e}
                        className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[var(--bg-alt)] text-[var(--fg-muted)] font-medium"
                        style={{ borderRadius: 'calc(var(--radius) / 2)' }}
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
