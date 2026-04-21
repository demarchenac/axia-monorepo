import { resolve } from '../../lib/content-helpers'
import { VideoHero } from '../../components/VideoHero'
import type { SectionProps, HeroContent } from '../types'

export const heroLujosoImageMeta = {
  type: 'hero' as const,
  variant: 'lujoso-image',
  recommendedFamilies: ['lujoso-y-premium'],
}

export const heroLujosoVideoMeta = {
  type: 'hero' as const,
  variant: 'lujoso-video',
  recommendedFamilies: ['lujoso-y-premium'],
}

interface LujosoHeroContent extends HeroContent {
  quote?: Record<string, string>
  quoteAttribution?: Record<string, string>
}

function HeroText({ content, locale, isVideo }: { content: LujosoHeroContent; locale: string; isVideo: boolean }) {
  return (
    <>
      {content.badge && (
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-8">
          {resolve(content.badge, locale)}
        </p>
      )}
      <h1 className={`display text-6xl md:text-8xl leading-[0.95] font-light italic mb-8 ${isVideo ? 'text-white' : ''}`}>
        {resolve(content.heading, locale)}
        {content.headingAccent && (
          <>
            <br />
            <span className="text-[var(--accent)]">{resolve(content.headingAccent, locale)}</span>
          </>
        )}
      </h1>
      <p className={`text-lg ${isVideo ? 'text-white/70' : 'text-[var(--fg-muted)]'} max-w-md mb-12 leading-relaxed text-justify`}>
        {resolve(content.subheading, locale)}
      </p>
      <div className="flex flex-wrap gap-4">
        {content.ctas.map((cta) => (
          <a
            key={cta.href}
            href={cta.href}
            target={cta.href.startsWith('http') ? '_blank' : undefined}
            rel={cta.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            className={
              cta.variant === 'secondary'
                ? 'display italic text-lg text-[var(--accent)] underline-offset-8 hover:underline self-center'
                : 'h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium'
            }
            style={cta.variant !== 'secondary' ? { borderRadius: 'var(--radius)' } : undefined}
          >
            {resolve(cta.label, locale)}
          </a>
        ))}
      </div>
    </>
  )
}

export function HeroLujosoImage({ content, locale, sectionId }: SectionProps<LujosoHeroContent>) {
  return (
    <section id={sectionId} className="border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 min-h-[80vh]">
        <div className="md:col-span-7 flex flex-col justify-center px-10 py-20 border-r border-[var(--border)]">
          <HeroText content={content} locale={locale} isVideo={false} />
        </div>
        <div className="md:col-span-5 relative bg-[var(--bg-alt)]">
          {content.imageUrl && (
            <img
              src={content.imageUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
          )}
          {content.quote && (
            <div className="absolute bottom-10 right-10 left-10 border border-[var(--accent)] p-6 backdrop-blur bg-[var(--bg)]/70">
              <p className="display italic text-2xl mb-2">"{resolve(content.quote, locale)}"</p>
              {content.quoteAttribution && (
                <p className="text-xs tracking-widest uppercase text-[var(--accent)]">
                  — {resolve(content.quoteAttribution, locale)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export function HeroLujosoVideo({ content, locale, sectionId }: SectionProps<LujosoHeroContent>) {
  if (!content.videoUrl) return null
  return (
    <VideoHero src={content.videoUrl} overlay="dark">
      <div id={sectionId} className="max-w-5xl mx-auto px-10 py-32">
        <HeroText content={content} locale={locale} isVideo={true} />
      </div>
    </VideoHero>
  )
}
