import { clinica } from '~/data/clinica'
import { servicios } from '~/data/servicios'
import { equipo } from '~/data/equipo'
import { testimonios } from '~/data/testimonios'
import { WhatsAppButton } from '~/components/WhatsAppButton'
import { VideoHero } from '~/components/VideoHero'

// Familia: Clínico y Profesional
// Composición: layout estructurado con stats arriba, hero con foto institucional,
// servicios en grid 3-up con iconos, denso, sans-serif Geist, jerarquía clara.

const stats = [
  { num: '12+', label: 'Años de experiencia' },
  { num: '8.500+', label: 'Pacientes atendidos' },
  { num: '11', label: 'Especialidades' },
  { num: '4.9★', label: 'Calificación Google' },
]

export function ClinicoTemplate({ video }: { video?: string }) {
  return (
    <main className="min-h-screen">
      {/* Top bar info */}
      <div className="bg-[var(--bg-alt)] border-b border-[var(--border)] text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6 text-[var(--fg-muted)]">
            <span>📍 {clinica.direccion}</span>
            <span className="hidden md:inline">⏱ {clinica.horario}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:+${clinica.whatsapp}`} className="text-[var(--primary)] font-medium">
              {clinica.whatsappDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[var(--border)] bg-[var(--bg)] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-fg)] font-bold text-lg">A</div>
            <div>
              <div className="font-semibold text-lg leading-tight">{clinica.nombre}</div>
              <div className="text-[10px] uppercase tracking-wider text-[var(--fg-muted)]">{clinica.doctor}</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#servicios" className="hover:text-[var(--primary)]">Servicios</a>
            <a href="#equipo" className="hover:text-[var(--primary)]">Equipo médico</a>
            <a href="#testimonios" className="hover:text-[var(--primary)]">Pacientes</a>
            <a href="#contacto" className="hover:text-[var(--primary)]">Contacto</a>
          </nav>
          <WhatsAppButton size="sm">Agendar cita</WhatsAppButton>
        </div>
      </header>

      {/* Hero */}
      {video ? (
        <VideoHero src={video} overlay="dark">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur text-xs font-medium text-white mb-6">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
              Atención certificada · Tecnología de vanguardia
            </div>
            <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6 text-white">
              Salud dental con la <span className="text-[var(--accent)]">precisión</span> que mereces.
            </h1>
            <p className="text-lg text-white/80 mb-8 leading-relaxed text-justify max-w-2xl">
              {clinica.nombre} reúne en Barranquilla especialistas certificados, tecnología de punta y un protocolo
              de atención centrado en ti. Resultados clínicos comprobables en cada visita.
            </p>
            <div className="flex flex-wrap gap-3">
              <WhatsAppButton size="lg">Agendar consulta</WhatsAppButton>
              <a href="#servicios" className="h-14 px-8 inline-flex items-center text-base font-medium text-white border border-white/30 hover:bg-white/10" style={{ borderRadius: 'var(--radius)' }}>
                Ver tratamientos
              </a>
            </div>
            <div className="flex items-center gap-6 mt-10 text-sm text-white/70">
              <div className="flex items-center gap-2">⭐⭐⭐⭐⭐ <strong className="text-white">4.9</strong> en Google</div>
              <div>·</div>
              <div>+8.500 pacientes</div>
            </div>
          </div>
        </VideoHero>
      ) : (
        <section className="bg-[var(--bg)]">
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-alt)] text-xs font-medium text-[var(--primary)] mb-6">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
                Atención certificada · Tecnología de vanguardia
              </div>
              <h1 className="text-5xl md:text-6xl font-bold leading-[1.05] mb-6">
                Salud dental con la <span className="text-[var(--primary)]">precisión</span> que mereces.
              </h1>
              <p className="text-lg text-[var(--fg-muted)] mb-8 leading-relaxed text-justify">
                {clinica.nombre} reúne especialistas certificados, tecnología de punta y un protocolo
                de atención centrado en ti. Resultados clínicos comprobables en cada visita.
              </p>
              <div className="flex flex-wrap gap-3">
                <WhatsAppButton size="lg">Agendar consulta</WhatsAppButton>
                <a href="#servicios" className="h-14 px-8 inline-flex items-center text-base font-medium text-[var(--primary)] border border-[var(--border)] hover:bg-[var(--bg-alt)]" style={{ borderRadius: 'var(--radius)' }}>
                  Ver tratamientos
                </a>
              </div>
              <div className="flex items-center gap-6 mt-10 text-sm text-[var(--fg-muted)]">
                <div className="flex items-center gap-2">⭐⭐⭐⭐⭐ <strong className="text-[var(--fg)]">4.9</strong> en Google</div>
                <div>·</div>
                <div>+8.500 pacientes</div>
              </div>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85" alt="Equipo médico Axia" className="w-full aspect-[4/5] object-cover" style={{ borderRadius: 'var(--radius)' }} />
              <div className="absolute -bottom-6 -left-6 bg-[var(--card)] border border-[var(--border)] p-5 shadow-xl" style={{ borderRadius: 'var(--radius)' }}>
                <div className="text-3xl font-bold text-[var(--primary)]">12+</div>
                <div className="text-xs text-[var(--fg-muted)] uppercase tracking-wider">Años cuidando sonrisas</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-alt)]">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-2">{s.num}</div>
              <div className="text-sm text-[var(--fg-muted)]">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Servicios — grid 3-up */}
      <section id="servicios" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">Especialidades</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Tratamientos para cada necesidad</h2>
          <p className="text-lg text-[var(--fg-muted)]">
            Once especialidades clínicas bajo un mismo techo, lideradas por profesionales certificados.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((s) => (
            <article
              key={s.slug}
              className="border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition-all"
              style={{ borderRadius: 'var(--radius)' }}
            >
              <div className="h-12 w-12 rounded-lg bg-[var(--bg-alt)] flex items-center justify-center text-[var(--primary)] mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">{s.nombre}</h3>
              <p className="text-[var(--fg-muted)] text-sm leading-relaxed text-justify mb-4">{s.descripcionLarga}</p>
              <WhatsAppButton servicio={s.nombre} variant="ghost" size="sm">
                Consultar →
              </WhatsAppButton>
            </article>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="bg-[var(--bg-alt)] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">Equipo Médico</p>
            <h2 className="text-4xl md:text-5xl font-bold">Profesionales certificados</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {equipo.map((d) => (
              <div key={d.nombre} className="bg-[var(--card)] border border-[var(--border)] overflow-hidden" style={{ borderRadius: 'var(--radius)' }}>
                <img src={d.foto} alt={d.nombre} className="w-full aspect-[4/3] object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{d.nombre}</h3>
                  <p className="text-sm text-[var(--primary)] font-medium mb-3">{d.rol}</p>
                  <p className="text-sm text-[var(--fg-muted)] leading-relaxed text-justify mb-4">{d.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {d.especialidades.map((e) => (
                      <span key={e} className="text-[10px] uppercase tracking-wider px-2 py-1 bg-[var(--bg-alt)] text-[var(--fg-muted)] font-medium" style={{ borderRadius: 'calc(var(--radius) / 2)' }}>
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
      <section id="testimonios" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[var(--primary)] mb-3">Pacientes</p>
          <h2 className="text-4xl md:text-5xl font-bold">Lo que dicen quienes nos visitan</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonios.map((t) => (
            <figure key={t.nombre} className="border border-[var(--border)] bg-[var(--card)] p-6" style={{ borderRadius: 'var(--radius)' }}>
              <div className="text-[var(--accent)] mb-4">{'★'.repeat(t.rating)}</div>
              <blockquote className="text-[var(--fg)] leading-relaxed text-justify mb-6">"{t.texto}"</blockquote>
              <figcaption className="border-t border-[var(--border)] pt-4">
                <div className="font-semibold">{t.nombre}</div>
                <div className="text-sm text-[var(--fg-muted)]">{t.ciudad} · {t.servicio}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section id="contacto" className="bg-[var(--primary)] text-[var(--primary-fg)] py-20">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Agenda tu cita hoy</h2>
            <p className="text-lg opacity-90 mb-8">
              Atención el mismo día disponible. Respuesta inmediata por WhatsApp.
            </p>
            <WhatsAppButton size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90">
              Escribir por WhatsApp
            </WhatsAppButton>
          </div>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3">📍 <span>{clinica.direccion}</span></div>
            <div className="flex items-center gap-3">⏱ <span>{clinica.horario}</span></div>
            <div className="flex items-center gap-3">📞 <span>{clinica.whatsappDisplay}</span></div>
            <div className="flex items-center gap-3">✉️ <span>{clinica.email}</span></div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-[var(--bg)] py-8 text-center text-sm text-[var(--fg-muted)]">
        © {new Date().getFullYear()} {clinica.nombre} · {clinica.doctor} · Todos los derechos reservados
      </footer>
    </main>
  )
}
