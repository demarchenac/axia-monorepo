import { createFileRoute, Link } from '@tanstack/react-router'
import { variantesPorFamilia, familiaLabels, type FamiliaSlug } from '~/themes/tokens'

export const Route = createFileRoute('/')({
  component: Home,
})

const familiaOrden: FamiliaSlug[] = [
  'elegante-y-sofisticado',
  'lujoso-y-premium',
  'clinico-y-profesional',
  'calido-y-amigable',
]

function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800 sticky top-0 z-50 backdrop-blur bg-neutral-950/80">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-lg">Axia Odontología</div>
            <div className="text-xs text-neutral-500 uppercase tracking-widest">Demo · Dirección visual</div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-3 py-1.5 rounded-full bg-neutral-800 text-neutral-300 font-mono">12 variantes</span>
            <span className="text-xs px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-300 font-mono border border-amber-500/30">v1.0</span>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Elija la dirección visual de <span className="text-amber-400">Axia</span>
        </h1>
        <p className="text-xl text-neutral-400 leading-relaxed max-w-2xl mx-auto">
          12 variantes navegables agrupadas en 4 familias visuales. Cada variante es una página
          completa, no un mockup. Click en cualquiera para verla en vivo.
        </p>
        <div className="mt-10 inline-flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          Contenido y fotos son ficticios para fines de presentación
        </div>
      </section>

      {familiaOrden.map((familia) => {
        const meta = familiaLabels[familia]
        const items = variantesPorFamilia[familia]
        return (
          <section key={familia} className="border-t border-neutral-800 py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-12 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.3em] text-amber-400 mb-3">Familia visual</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{meta.label}</h2>
                <p className="text-neutral-400 text-lg leading-relaxed">{meta.tagline}</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((v) => {
                  const href = `/${v.familia}/${v.paleta}`
                  return (
                    <Link
                      key={href}
                      to="/$familia/$paleta"
                      params={{ familia: v.familia, paleta: v.paleta }}
                      className="group relative block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 hover:border-amber-500/50 transition-all"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-neutral-800 relative">
                        <iframe
                          src={href}
                          title={`${v.familia} ${v.paleta}`}
                          loading="lazy"
                          className="pointer-events-none border-0 absolute top-0 left-0"
                          style={{
                            width: '400%',
                            height: '400%',
                            transform: 'scale(0.25)',
                            transformOrigin: 'top left',
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="p-5 border-t border-neutral-800">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2">
                            {[v.tokens['--bg'], v.tokens['--primary'], v.tokens['--accent'], v.tokens['--fg']].map((color, i) => (
                              <span
                                key={i}
                                className="h-4 w-4 rounded-full border border-neutral-700"
                                style={{ background: color }}
                              />
                            ))}
                          </div>
                          <span className="text-[10px] font-mono text-neutral-500 uppercase">{v.paleta}</span>
                        </div>
                        <div className="font-semibold mb-1">{v.label}</div>
                        <p className="text-xs text-neutral-500 leading-relaxed line-clamp-2">
                          {v.descripcion}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )
      })}

      <footer className="border-t border-neutral-800 py-10 text-center text-xs text-neutral-500">
        Demo de dirección visual · Axia Odontología · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
