import { resolve } from '../../lib/content-helpers'
import { VideoHero } from '../../components/VideoHero'
import type { SectionProps, HeroContent } from '../types'

export const heroCalidoImageMeta = {
  type: 'hero' as const,
  variant: 'calido-image',
  recommendedFamilies: ['calido-y-amigable'],
}

export const heroCalidoVideoMeta = {
  type: 'hero' as const,
  variant: 'calido-video',
  recommendedFamilies: ['calido-y-amigable'],
}

function PromiseCards({ content, locale }: SectionProps<HeroContent>) {
  if (!content.promiseCards?.length) return null
  return (
    <section className="max-w-7xl mx-auto px-6 mt-16 mb-20">
      <div className="grid md:grid-cols-3 gap-4">
        {content.promiseCards.map((c) => (
          <div
            key={resolve(c.title, locale)}
            className="bg-[var(--card)] border border-[var(--border)] p-6 flex items-start gap-4"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <div className="text-4xl">{c.emoji}</div>
            <div>
              <h3 className="font-bold text-lg mb-1">{resolve(c.title, locale)}</h3>
              <p className="text-sm text-[var(--fg-muted)]">{resolve(c.description, locale)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HeroCalidoImage({ content, locale, sectionId }: SectionProps<HeroContent>) {
  return (
    <>
      <section id={sectionId} className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-7">
            {content.badge && (
              <div
                className="inline-flex items-center gap-2 bg-[var(--bg-alt)] px-4 py-2 mb-6"
                style={{ borderRadius: '999px' }}
              >
                <span>✨</span>
                <span className="text-sm font-medium">{resolve(content.badge, locale)}</span>
              </div>
            )}
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
              {resolve(content.heading, locale)}{' '}
              {content.headingAccent && (
                <>
                  <br />
                  <span className="text-[var(--primary)]">{resolve(content.headingAccent, locale)}</span>
                </>
              )}
            </h1>
            <p className="text-xl text-[var(--fg-muted)] mb-10 max-w-xl leading-relaxed">
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
                      ? 'h-14 px-8 inline-flex items-center bg-[var(--bg-alt)] text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors'
                      : 'h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium'
                  }
                  style={{ borderRadius: 'var(--radius)' }}
                >
                  {resolve(cta.label, locale)}
                </a>
              ))}
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div
              className="absolute -top-8 -left-8 w-32 h-32 bg-[var(--accent)] opacity-30"
              style={{ borderRadius: '50%' }}
            />
            <div
              className="absolute -bottom-8 -right-8 w-40 h-40 bg-[var(--primary)] opacity-20"
              style={{ borderRadius: '50%' }}
            />
            {content.imageUrl && (
              <img
                src={content.imageUrl}
                alt=""
                className="relative w-full aspect-square object-cover"
                style={{ borderRadius: 'var(--radius)' }}
              />
            )}
          </div>
        </div>
      </section>
      <PromiseCards content={content} locale={locale} />
    </>
  )
}

export function HeroCalidoVideo({ content, locale, sectionId }: SectionProps<HeroContent>) {
  if (!content.videoUrl) return null
  return (
    <VideoHero src={content.videoUrl} overlay="dark">
      <div id={sectionId} className="max-w-5xl mx-auto px-6 py-32">
        <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 text-white">
          {resolve(content.heading, locale)}{' '}
          {content.headingAccent && (
            <>
              <br />
              <span className="text-[var(--accent)]">{resolve(content.headingAccent, locale)}</span>
            </>
          )}
        </h1>
        <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed text-justify">
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
                  ? 'h-14 px-8 inline-flex items-center bg-white/15 backdrop-blur text-white border border-white/30 hover:bg-white/25 transition-colors'
                  : 'h-14 px-8 inline-flex items-center bg-[var(--primary)] text-[var(--primary-fg)] hover:opacity-90 transition-all font-medium'
              }
              style={{ borderRadius: 'var(--radius)' }}
            >
              {resolve(cta.label, locale)}
            </a>
          ))}
        </div>
      </div>
    </VideoHero>
  )
}
