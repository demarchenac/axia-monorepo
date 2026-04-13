import { clinica } from '~/data/clinica'
import { servicios } from '~/data/servicios'
import { equipo } from '~/data/equipo'
import { testimonios } from '~/data/testimonios'
import { WhatsAppButton } from '~/components/WhatsAppButton'
import { VideoHero } from '~/components/VideoHero'

// Familia: Elegante y Sofisticado
// Composición: editorial, mucho white-space, serif grande, listas numeradas en vez de grids,
// fotos verticales alternadas con texto. Inspirado en revistas de diseño y atelieres.

export function EleganteTemplate({ video }: { video?: string }) {
  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="display text-xl tracking-[0.2em] uppercase">
            {clinica.nombre}
          </div>
          <nav className="hidden md:flex items-center gap-10 text-sm tracking-wide uppercase">
            <a href="#servicios" className="hover:text-[var(--primary)]">Servicios</a>
            <a href="#equipo" className="hover:text-[var(--primary)]">Equipo</a>
            <a href="#testimonios" className="hover:text-[var(--primary)]">Pacientes</a>
            <a href="#contacto" className="hover:text-[var(--primary)]">Contacto</a>
          </nav>
          <WhatsAppButton size="sm" variant="outline">Agendar</WhatsAppButton>
        </div>
      </header>

      {/* Hero */}
      {video ? (
        <VideoHero src={video} overlay="dark">
          <div className="max-w-4xl mx-auto px-8 py-32 text-center text-white">
            <p className="text-xs tracking-[0.3em] uppercase opacity-70 mb-8">
              By {clinica.doctor}
            </p>
            <h1 className="display text-6xl md:text-8xl font-normal leading-[1.05] mb-10">
              La sonrisa, <em className="text-[var(--accent)]">una obra</em> de arte personal.
            </h1>
            <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto leading-relaxed text-justify mb-12">
              Diseñamos cada sonrisa como una pieza única. Combinamos tecnología de vanguardia con
              la atención artesanal que mereces.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <WhatsAppButton size="lg">Agendar consulta</WhatsAppButton>
              <a href="#servicios" className="h-14 px-8 inline-flex items-center text-base text-white/80 hover:text-white">
                Conocer servicios →
              </a>
            </div>
          </div>
        </VideoHero>
      ) : (
        <section className="max-w-4xl mx-auto px-8 py-32 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--fg-muted)] mb-8">
            By {clinica.doctor}
          </p>
          <h1 className="display text-6xl md:text-8xl font-normal leading-[1.05] mb-10">
            La sonrisa, <em className="text-[var(--accent)]">una obra</em> de arte personal.
          </h1>
          <p className="text-lg md:text-xl text-[var(--fg-muted)] max-w-2xl mx-auto leading-relaxed text-justify mb-12">
            Diseñamos cada sonrisa como una pieza única. Combinamos tecnología de vanguardia con
            la atención artesanal que mereces.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <WhatsAppButton size="lg">Agendar consulta</WhatsAppButton>
            <a href="#servicios" className="h-14 px-8 inline-flex items-center text-base text-[var(--fg)] hover:text-[var(--primary)]">
              Conocer servicios →
            </a>
          </div>
        </section>
      )}

      {/* Filete decorativo */}
      <div className="max-w-4xl mx-auto px-8">
        <div className="h-px bg-[var(--accent)] w-24 mx-auto" />
      </div>

      {/* Servicios — lista numerada editorial */}
      <section id="servicios" className="max-w-5xl mx-auto px-8 py-28">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Nuestros Servicios</p>
          <h2 className="display text-5xl md:text-6xl">Once tratamientos, una sola filosofía</h2>
        </div>
        <ol className="space-y-px">
          {servicios.map((s, i) => (
            <li
              key={s.slug}
              className="grid grid-cols-12 gap-6 py-8 border-t border-[var(--border)] items-baseline"
            >
              <span className="display text-3xl text-[var(--accent)] col-span-1">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="display text-2xl col-span-4">{s.nombre}</h3>
              <p className="text-[var(--fg-muted)] col-span-7 leading-relaxed text-justify">
                {s.descripcionLarga}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Equipo — fotos verticales con texto al lado */}
      <section id="equipo" className="bg-[var(--bg-alt)] py-28">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Nuestro Equipo</p>
            <h2 className="display text-5xl md:text-6xl">Especialistas con alma</h2>
          </div>
          <div className="space-y-24">
            {equipo.map((d, i) => (
              <div
                key={d.nombre}
                className={`grid md:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? 'md:[direction:rtl]' : ''
                }`}
              >
                <div className="md:[direction:ltr]">
                  <img
                    src={d.foto}
                    alt={d.nombre}
                    className="w-full aspect-[4/5] object-cover"
                  />
                </div>
                <div className="md:[direction:ltr]">
                  <h3 className="display text-4xl mb-3">{d.nombre}</h3>
                  <p className="text-[var(--accent)] uppercase tracking-widest text-xs mb-6">{d.rol}</p>
                  <p className="text-[var(--fg-muted)] leading-relaxed text-justify text-lg mb-6">{d.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.especialidades.map((e) => (
                      <span
                        key={e}
                        className="text-xs uppercase tracking-wider px-3 py-1 border border-[var(--border)]"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="max-w-5xl mx-auto px-8 py-28">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-4">Pacientes</p>
          <h2 className="display text-5xl md:text-6xl">Voces que nos honran</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-12">
          {testimonios.slice(0, 4).map((t) => (
            <figure key={t.nombre} className="border-l-2 border-[var(--accent)] pl-6">
              <blockquote className="display text-2xl leading-relaxed text-justify italic mb-6">
                "{t.texto}"
              </blockquote>
              <figcaption>
                <div className="font-medium">{t.nombre}</div>
                <div className="text-sm text-[var(--fg-muted)]">{t.ciudad} · {t.servicio}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section id="contacto" className="bg-[var(--bg-alt)] py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">Comencemos</p>
          <h2 className="display text-5xl md:text-6xl mb-8">
            Tu próxima sonrisa <em>te está esperando</em>.
          </h2>
          <p className="text-lg text-[var(--fg-muted)] mb-12">
            Agenda tu valoración inicial. Te escuchamos sin compromiso.
          </p>
          <WhatsAppButton size="lg">Escríbenos por WhatsApp</WhatsAppButton>
          <div className="mt-16 grid md:grid-cols-3 gap-8 text-sm text-[var(--fg-muted)]">
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--fg)] mb-2">Teléfono</p>
              {clinica.whatsappDisplay}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--fg)] mb-2">Dirección</p>
              {clinica.direccion}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[var(--fg)] mb-2">Horario</p>
              {clinica.horario}
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-8 text-center text-xs text-[var(--fg-muted)] tracking-widest uppercase">
        © {new Date().getFullYear()} {clinica.nombre} · Todos los derechos reservados
      </footer>
    </main>
  )
}
