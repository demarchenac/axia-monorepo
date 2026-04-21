import { resolve } from '../../lib/content-helpers'
import { VideoHero } from '../../components/VideoHero'
import type { SectionProps, HeroContent } from '../types'

export const heroEleganteImageMeta = {
  type: 'hero' as const,
  variant: 'elegante-image',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

export const heroEleganteVideoMeta = {
  type: 'hero' as const,
  variant: 'elegante-video',
  recommendedFamilies: ['elegante-y-sofisticado'],
}

function HeroInner({ content, locale, isVideo }: SectionProps<HeroContent> & { isVideo: boolean }) {
  return (
    <div className={`max-w-4xl mx-auto px-8 py-32 text-center ${isVideo ? 'text-white' : ''}`}>
      {content.badge && (
        <p className={`text-xs tracking-[0.3em] uppercase ${isVideo ? 'opacity-70' : 'text-[var(--fg-muted)]'} mb-8`}>
          {resolve(content.badge, locale)}
        </p>
      )}
      <h1 className="display text-6xl md:text-8xl font-normal leading-[1.05] mb-10">
        {resolve(content.heading, locale)}{' '}
        {content.headingAccent && (
          <em className="text-[var(--accent)]">{resolve(content.headingAccent, locale)}</em>
        )}
      </h1>
      <p className={`text-lg md:text-xl ${isVideo ? 'opacity-80' : 'text-[var(--fg-muted)]'} max-w-2xl mx-auto leading-relaxed text-justify mb-12`}>
        {resolve(content.subheading, locale)}
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        {content.ctas.map((cta) => (
          <a
            key={cta.href}
            href={cta.href}
            target={cta.href.startsWith('http') ? '_blank' : undefined}
            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={
              cta.variant === 'secondary'
                ? `h-14 px-8 inline-flex items-center text-base ${isVideo ? 'text-white/80 hover:text-white' : 'text-[var(--fg)] hover:text-[var(--primary)]'}`
                : 'h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium'
            }
            style={{ borderRadius: 'var(--radius)' }}
          >
            {resolve(cta.label, locale)}
          </a>
        ))}
      </div>
    </div>
  )
}

export function HeroEleganteImage({ content, locale, sectionId }: SectionProps<HeroContent>) {
  return (
    <>
      <section id={sectionId}>
        <HeroInner content={content} locale={locale} isVideo={false} />
      </section>
      <div className="max-w-4xl mx-auto px-8">
        <div className="h-px bg-[var(--accent)] w-24 mx-auto" />
      </div>
    </>
  )
}

export function HeroEleganteVideo({ content, locale, sectionId }: SectionProps<HeroContent>) {
  if (!content.videoUrl) return null
  return (
    <>
      <VideoHero src={content.videoUrl} overlay="dark">
        <div id={sectionId}>
          <HeroInner content={content} locale={locale} isVideo={true} />
        </div>
      </VideoHero>
      <div className="max-w-4xl mx-auto px-8">
        <div className="h-px bg-[var(--accent)] w-24 mx-auto" />
      </div>
    </>
  )
}
