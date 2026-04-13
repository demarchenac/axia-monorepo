import { clinica } from '~/data/clinica'
import { servicios } from '~/data/servicios'
import { equipo } from '~/data/equipo'
import { testimonios } from '~/data/testimonios'
import { WhatsAppButton } from '~/components/WhatsAppButton'
import { VideoHero } from '~/components/VideoHero'

// Familia: Cálido y Amigable
// Composición: redondeces extremas, blob shapes, hero con foto orgánica, copy informal en
// segunda persona, cards muy redondeados con sombras suaves, tono familia.

export function CalidoTemplate({ video }: { video?: string }) {
  return (
    <main className="min-h-screen">
      {/* Header redondeado y aireado */}
      {video ? (
        <header className="absolute top-0 left-0 right-0 z-30 px-6 pt-6">
          <div className="max-w-7xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 flex items-center justify-between" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-xl" style={{ borderRadius: 'calc(var(--radius) * 0.7)' }}>
                ✦
              </div>
              <div>
                <div className="font-semibold text-lg leading-tight text-white">{clinica.nombre}</div>
                <div className="text-xs text-white/60">{clinica.doctor}</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm text-white/90">
              <a href="#servicios" className="hover:text-white">Lo que hacemos</a>
              <a href="#equipo" className="hover:text-white">Nuestro equipo</a>
              <a href="#testimonios" className="hover:text-white">Historias</a>
            </nav>
          </div>
        </header>
      ) : (
        <header className="px-6 pt-6">
          <div className="max-w-7xl mx-auto bg-[var(--card)] border border-[var(--border)] px-6 py-4 flex items-center justify-between" style={{ borderRadius: 'var(--radius)' }}>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-fg)] font-bold text-xl" style={{ borderRadius: 'calc(var(--radius) * 0.7)' }}>
                ✦
              </div>
              <div>
                <div className="font-semibold text-lg leading-tight">{clinica.nombre}</div>
                <div className="text-xs text-[var(--fg-muted)]">{clinica.doctor}</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8 text-sm">
              <a href="#servicios" className="hover:text-[var(--primary)]">Lo que hacemos</a>
              <a href="#equipo" className="hover:text-[var(--primary)]">Nuestro equipo</a>
              <a href="#testimonios" className="hover:text-[var(--primary)]">Historias</a>
            </nav>
          </div>
        </header>
      )}

      {/* Hero */}
      {video ? (
        <VideoHero src={video} overlay="dark">
          <div className="max-w-5xl mx-auto px-6 py-32">
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6 text-white">
              Acá no hay miedo al dentista. <br />
              <span className="text-[var(--accent)]">Solo</span> sonrisas.
            </h1>
            <p className="text-xl text-white/80 mb-10 max-w-xl leading-relaxed text-justify">
              En {clinica.nombre} te recibimos como a alguien de la familia. Tomamos café juntos,
              te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppButton size="lg">Agendar mi visita</WhatsAppButton>
              <a href="#servicios" className="h-14 px-8 inline-flex items-center bg-white/15 backdrop-blur text-white border border-white/30 hover:bg-white/25 transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                ¿Qué hacemos?
              </a>
            </div>
          </div>
        </VideoHero>
      ) : (
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 bg-[var(--bg-alt)] px-4 py-2 mb-6" style={{ borderRadius: '999px' }}>
                <span>✨</span>
                <span className="text-sm font-medium">Atención cálida desde 2013</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-[1.05] mb-6">
                Acá no hay miedo al dentista. <br />
                <span className="text-[var(--primary)]">Solo</span> sonrisas.
              </h1>
              <p className="text-xl text-[var(--fg-muted)] mb-10 max-w-xl leading-relaxed">
                En {clinica.nombre} te recibimos como a alguien de la familia. Tomamos café juntos,
                te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppButton size="lg">Agendar mi visita</WhatsAppButton>
                <a href="#servicios" className="h-14 px-8 inline-flex items-center bg-[var(--bg-alt)] text-[var(--fg)] hover:bg-[var(--accent)] hover:text-[var(--accent-fg)] transition-colors" style={{ borderRadius: 'var(--radius)' }}>
                  ¿Qué hacemos?
                </a>
              </div>
            </div>
            <div className="md:col-span-5 relative">
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-[var(--accent)] opacity-30" style={{ borderRadius: '50%' }} />
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-[var(--primary)] opacity-20" style={{ borderRadius: '50%' }} />
              <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85" alt="Familia sonriendo" className="relative w-full aspect-square object-cover" style={{ borderRadius: 'var(--radius)' }} />
            </div>
          </div>
        </section>
      )}

      {/* Pequeñas promesas (solo sin video — con video van dentro del hero) */}
      {!video && (
        <section className="max-w-7xl mx-auto px-6 mt-16 mb-20">
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { e: '☕', t: 'Café de bienvenida', d: 'Llegas, te recibimos, conversamos.' },
              { e: '👶', t: 'Amigos de los niños', d: 'Sin lágrimas, lo prometemos.' },
              { e: '💬', t: 'Sin tecnicismos', d: 'Te explicamos como a un amigo.' },
            ].map((c) => (
              <div key={c.t} className="bg-[var(--card)] border border-[var(--border)] p-6 flex items-start gap-4" style={{ borderRadius: 'var(--radius)' }}>
                <div className="text-4xl">{c.e}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{c.t}</h3>
                  <p className="text-sm text-[var(--fg-muted)]">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Servicios — cards XL redondeados */}
      <section id="servicios" className="bg-[var(--bg-alt)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">¿Qué hacemos?</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Cuidamos tu sonrisa, completa.</h2>
            <p className="text-lg text-[var(--fg-muted)]">
              Once tratamientos pensados para acompañarte en cada etapa de tu vida.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicios.map((s, i) => (
              <article
                key={s.slug}
                className="bg-[var(--card)] p-8 border border-[var(--border)] hover:shadow-2xl hover:-translate-y-1 transition-all"
                style={{ borderRadius: 'var(--radius)' }}
              >
                <div className="text-3xl font-bold text-[var(--primary)] mb-3">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <h3 className="text-xl font-bold mb-3">{s.nombre}</h3>
                <p className="text-[var(--fg-muted)] text-sm leading-relaxed mb-5">{s.descripcionLarga}</p>
                <WhatsAppButton servicio={s.nombre} variant="ghost" size="sm">
                  Pregúntanos →
                </WhatsAppButton>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Equipo — fotos redondas */}
      <section id="equipo" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">El equipo</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Caras amigas</h2>
          <p className="text-lg text-[var(--fg-muted)]">
            Personas reales, cercanas y profundamente buenas en lo que hacen.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {equipo.map((d) => (
            <div key={d.nombre} className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-[var(--accent)] opacity-30 -rotate-6" style={{ borderRadius: 'var(--radius)' }} />
                <img
                  src={d.foto}
                  alt={d.nombre}
                  className="relative w-56 h-56 object-cover mx-auto"
                  style={{ borderRadius: '50%' }}
                />
              </div>
              <h3 className="text-2xl font-bold mb-1">{d.nombre}</h3>
              <p className="text-[var(--primary)] font-medium mb-4">{d.rol}</p>
              <p className="text-sm text-[var(--fg-muted)] leading-relaxed max-w-xs mx-auto">{d.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <section id="testimonios" className="bg-[var(--bg-alt)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)] mb-3">Historias reales</p>
            <h2 className="text-4xl md:text-5xl font-bold">Lo que cuentan nuestros pacientes</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {testimonios.slice(0, 4).map((t) => (
              <figure key={t.nombre} className="bg-[var(--card)] border border-[var(--border)] p-8" style={{ borderRadius: 'var(--radius)' }}>
                <div className="text-[var(--accent)] text-xl mb-4">{'★'.repeat(t.rating)}</div>
                <blockquote className="text-lg leading-relaxed mb-6">"{t.texto}"</blockquote>
                <figcaption className="flex items-center gap-3">
                  <div
                    className="h-12 w-12 bg-[var(--accent)] flex items-center justify-center text-[var(--accent-fg)] font-bold"
                    style={{ borderRadius: '50%' }}
                  >
                    {t.nombre[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{t.nombre}</div>
                    <div className="text-xs text-[var(--fg-muted)]">{t.ciudad} · {t.servicio}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section id="contacto" className="max-w-5xl mx-auto px-6 py-24">
        <div className="bg-[var(--primary)] text-[var(--primary-fg)] p-12 md:p-20 text-center relative overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10" style={{ borderRadius: '50%' }} />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10" style={{ borderRadius: '50%' }} />
          <div className="relative">
            <div className="text-5xl mb-6">😊</div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6">¿Listos para sonreír juntos?</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto">
              Escríbenos por WhatsApp y te ayudamos a agendar tu primera visita. Te respondemos rapidito 🌸
            </p>
            <WhatsAppButton size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90">
              ¡Quiero agendar! 💌
            </WhatsAppButton>
            <div className="mt-12 grid md:grid-cols-3 gap-6 text-sm opacity-90">
              <div>📍 {clinica.direccion}</div>
              <div>⏰ {clinica.horario}</div>
              <div>📱 {clinica.whatsappDisplay}</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-[var(--fg-muted)]">
        Hecho con cariño · © {new Date().getFullYear()} {clinica.nombre}
      </footer>
    </main>
  )
}
