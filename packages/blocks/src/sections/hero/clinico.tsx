import { resolve } from '../../lib/content-helpers'
import { VideoHero } from '../../components/VideoHero'
import type { SectionProps, HeroContent } from '../types'

export const heroClinicoImageMeta = {
  type: 'hero' as const,
  variant: 'clinico-image',
  recommendedFamilies: ['clinico-y-profesional'],
}

export const heroClinicoVideoMeta = {
  type: 'hero' as const,
  variant: 'clinico-video',
  recommendedFamilies: ['clinico-y-profesional'],
}

interface ClinicoHeroContent extends HeroContent {
  socialProof?: {
    rating: string
    ratingSource: Record<string, string>
    extraText: Record<string, string>
  }
  highlightStat?: { value: string; label: Record<string, string> }
}

function CtaButtons({ content, locale, isVideo }: { content: ClinicoHeroContent; locale: string; isVideo: boolean }) {
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {content.ctas.map((cta) => (
          <a
            key={cta.href}
            href={cta.href}
            target={cta.href.startsWith('http') ? '_blank' : undefined}
            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={
              cta.variant === 'secondary'
                ? `h-14 px-8 inline-flex items-center text-base font-medium ${
                    isVideo
                      ? 'text-white border border-white/30 hover:bg-white/10'
                      : 'text-[var(--primary)] border border-[var(--border)] hover:bg-[var(--bg-alt)]'
                  }`
                : 'h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium'
            }
            style={{ borderRadius: 'var(--radius)' }}
          >
            {resolve(cta.label, locale)}
          </a>
        ))}
      </div>
      {content.socialProof && (
        <div className={`flex items-center gap-6 mt-10 text-sm ${isVideo ? 'text-white/70' : 'text-[var(--fg-muted)]'}`}>
          <div className="flex items-center gap-2">
            ⭐⭐⭐⭐⭐{' '}
            <strong className={isVideo ? 'text-white' : 'text-[var(--fg)]'}>{content.socialProof.rating}</strong>{' '}
            {resolve(content.socialProof.ratingSource, locale)}
          </div>
          <div>·</div>
          <div>{resolve(content.socialProof.extraText, locale)}</div>
        </div>
      )}
    </>
  )
}

export function HeroClinicoImage({ content, locale, sectionId }: SectionProps<ClinicoHeroContent>) {
  return (
    <section id={sectionId} className="bg-[var(--bg)]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          {content.badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] text-xs font-medium text-[var(--primary)] mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
              {resolve(content.badge, locale)}
            </div>
          )}
          <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6">
            {resolve(content.heading, locale)}{' '}
            {content.headingAccent && (
              <span className="text-[var(--primary)]">{resolve(content.headingAccent, locale)}</span>
            )}
          </h1>
          <p className="text-lg text-[var(--fg-muted)] mb-8 leading-relaxed text-justify">
            {resolve(content.subheading, locale)}
          </p>
          <CtaButtons content={content} locale={locale} isVideo={false} />
        </div>
        <div className="relative">
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              alt=""
              className="w-full aspect-[4/5] object-cover"
              style={{ borderRadius: 'var(--radius)' }}
            />
          )}
          {content.highlightStat && (
            <div
              className="absolute -bottom-6 -left-6 bg-[var(--card)] border border-[var(--border)] p-5 shadow-xl"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="text-3xl font-bold text-[var(--primary)]">{content.highlightStat.value}</div>
              <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wider">
                {resolve(content.highlightStat.label, locale)}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function HeroClinicoVideo({ content, locale, sectionId }: SectionProps<ClinicoHeroContent>) {
  if (!content.videoUrl) return null
  return (
    <VideoHero src={content.videoUrl} overlay="dark">
      <div id={sectionId} className="max-w-5xl mx-auto px-6 py-24">
        {content.badge && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-medium text-white mb-6">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
            {resolve(content.badge, locale)}
          </div>
        )}
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6 text-white">
          {resolve(content.heading, locale)}{' '}
          {content.headingAccent && (
            <span className="text-[var(--accent)]">{resolve(content.headingAccent, locale)}</span>
          )}
        </h1>
        <p className="text-lg text-white/80 mb-8 leading-relaxed text-justify max-w-2xl">
          {resolve(content.subheading, locale)}
        </p>
        <CtaButtons content={content} locale={locale} isVideo={true} />
      </div>
    </VideoHero>
  )
}
