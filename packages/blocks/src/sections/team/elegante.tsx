import { resolve } from '../../lib/content-helpers'
import type { SectionProps, TeamContent } from '../types'

export const meta = {
  type: 'team' as const,
  variant: 'elegante',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export function TeamElegante({ content, locale, sectionId }: SectionProps<TeamContent>) {
  return (
    <section id={sectionId ?? 'equipo'} className="bg-[var(--bg-alt)] py-28">
      <div className="max-w-5xl mx-auto px-8">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">
            {resolve(content.eyebrow, locale)}
          </p>
          <h2 className="display text-5xl md:text-6xl">
            {resolve(content.heading, locale)}
          </h2>
        </div>
        <div className="space-y-24">
          {content.members.map((d, i) => (
            <div
              key={d.name}
              className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
            >
              <div className="md:[direction:ltr]">
                <img src={d.photoUrl} alt={d.name} className="w-full aspect-[4/5] object-cover" />
              </div>
              <div className="md:[direction:ltr]">
                <h3 className="display text-4xl mb-3">{d.name}</h3>
                <p className="text-[var(--accent)] uppercase tracking-widest text-xs mb-6">
                  {resolve(d.role, locale)}
                </p>
                <p className="text-[var(--fg-muted)] leading-relaxed text-justify text-lg mb-6">
                  {resolve(d.bio, locale)}
                </p>
                {d.specialties && (
                  <div className="flex flex-wrap gap-2">
                    {d.specialties.map((e) => (
                      <span
                        key={e}
                        className="text-xs uppercase tracking-wider px-3 py-1 border border-[var(--border)]"
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
