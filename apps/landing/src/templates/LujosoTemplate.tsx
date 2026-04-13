import { clinica } from '~/data/clinica'
import { servicios } from '~/data/servicios'
import { equipo } from '~/data/equipo'
import { testimonios } from '~/data/testimonios'
import { WhatsAppButton } from '~/components/WhatsAppButton'
import { VideoHero } from '~/components/VideoHero'

// Familia: Lujoso y Premium
// Composición: dark mode dramático, hero asimétrico (texto izquierda + foto grande derecha),
// servicios con números romanos en grid de 2 columnas con bordes finos, tipografía Cormorant italic.

const romanos = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI']

export function LujosoTemplate({ video }: { video?: string }) {
  return (
    <main className="min-h-screen">
      {/* Header — barra delgada con borde inferior dorado */}
      <header className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-10 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 border border-[var(--accent)] flex items-center justify-center">
              <span className="display text-[var(--accent)] text-lg italic">A</span>
            </div>
            <div>
              <div className="display text-lg tracking-[0.15em] uppercase">{clinica.nombre}</div>
              <div className="text-[10px] tracking-widest text-[var(--fg-muted)] uppercase">By {clinica.doctor}</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-xs tracking-[0.2em] uppercase">
            <a href="#servicios">Servicios</a>
            <a href="#equipo">Maestros</a>
            <a href="#testimonios">Pacientes</a>
            <a href="#contacto">Reservar</a>
          </nav>
          <WhatsAppButton size="sm">Reservar cita</WhatsAppButton>
        </div>
      </header>

      {/* Hero */}
      {video ? (
        <VideoHero src={video} overlay="dark">
          <div className="max-w-5xl mx-auto px-10 py-32">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-8">— Atelier Odontológico —</p>
            <h1 className="display text-6xl md:text-8xl leading-[0.95] font-light italic mb-8 text-white">
              Una sonrisa<br />
              <span className="text-[var(--accent)]">extraordinaria</span><br />
              merece manos<br />
              extraordinarias.
            </h1>
            <p className="text-lg text-white/70 max-w-md mb-12 leading-relaxed text-justify">
              Cada tratamiento en {clinica.nombre} es una obra hecha a medida. Tecnología
              alemana, materiales suizos, atención de boutique.
            </p>
            <div className="flex flex-wrap gap-4">
              <WhatsAppButton size="lg">Reservar valoración</WhatsAppButton>
              <a href="#servicios" className="display italic text-lg text-[var(--accent)] underline-offset-8 hover:underline self-center">
                Conocer especialidades
              </a>
            </div>
          </div>
        </VideoHero>
      ) : (
        <section className="border-b border-[var(--border)]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-12 min-h-[80vh]">
            <div className="md:col-span-7 flex flex-col justify-center px-10 py-20 border-r border-[var(--border)]">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-8">— Atelier Odontológico —</p>
              <h1 className="display text-6xl md:text-8xl leading-[0.95] font-light italic mb-8">
                Una sonrisa<br />
                <span className="text-[var(--accent)]">extraordinaria</span><br />
                merece manos<br />
                extraordinarias.
              </h1>
              <p className="text-lg text-[var(--fg-muted)] max-w-md mb-12 leading-relaxed text-justify">
                Cada tratamiento en {clinica.nombre} es una obra hecha a medida. Tecnología
                alemana, materiales suizos, atención de boutique.
              </p>
              <div className="flex flex-wrap gap-4">
                <WhatsAppButton size="lg">Reservar valoración</WhatsAppButton>
                <a href="#servicios" className="display italic text-lg text-[var(--accent)] underline-offset-8 hover:underline self-center">
                  Conocer especialidades
                </a>
              </div>
            </div>
            <div className="md:col-span-5 relative bg-[var(--bg-alt)]">
              <img
                src="https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1000&q=85"
                alt="Clínica Axia"
                className="absolute inset-0 w-full h-full object-cover opacity-90"
              />
              <div className="absolute bottom-10 right-10 left-10 border border-[var(--accent)] p-6 backdrop-blur bg-[var(--bg)]/70">
                <p className="display italic text-2xl mb-2">"Una experiencia digna de un hotel cinco estrellas."</p>
                <p className="text-xs tracking-widest uppercase text-[var(--accent)]">— Vogue España, 2025</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Servicios — números romanos */}
      <section id="servicios" className="max-w-7xl mx-auto px-10 py-32">
        <div className="grid md:grid-cols-12 gap-10 mb-20">
          <div className="md:col-span-5">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">— Especialidades —</p>
            <h2 className="display text-5xl md:text-6xl italic font-light leading-tight">
              Once disciplinas, dominadas a la perfección.
            </h2>
          </div>
          <div className="md:col-span-7 md:col-start-6 flex items-end">
            <p className="text-lg text-[var(--fg-muted)] leading-relaxed text-justify">
              Cada especialidad en Axia está liderada por un maestro reconocido en su campo. No
              externalizamos, no derivamos: lo que hacemos, lo hacemos en casa.
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2">
          {servicios.map((s, i) => (
            <article
              key={s.slug}
              className="group p-10 border-t border-[var(--border)] md:[&:nth-child(odd)]:border-r"
            >
              <div className="flex items-start gap-8">
                <span className="display italic text-4xl text-[var(--accent)] min-w-12">{romanos[i]}</span>
                <div>
                  <h3 className="display text-3xl mb-3 italic">{s.nombre}</h3>
                  <p className="text-[var(--fg-muted)] leading-relaxed text-justify">{s.descripcionLarga}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Equipo — cards oscuras con marco dorado */}
      <section id="equipo" className="bg-[var(--bg-alt)] py-32 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-10">
          <div className="text-center mb-20">
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">— Los Maestros —</p>
            <h2 className="display text-5xl md:text-6xl italic">Quienes esculpen tu sonrisa</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {equipo.map((d) => (
              <div key={d.nombre} className="border border-[var(--border)] bg-[var(--bg)] p-8 hover:border-[var(--accent)] transition-colors">
                <div className="aspect-[3/4] mb-6 overflow-hidden">
                  <img src={d.foto} alt={d.nombre} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </div>
                <h3 className="display text-2xl italic mb-2">{d.nombre}</h3>
                <p className="text-[var(--accent)] text-xs uppercase tracking-widest mb-4">{d.rol}</p>
                <p className="text-[var(--fg-muted)] text-sm leading-relaxed text-justify">{d.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios — quote grande estilo editorial */}
      <section id="testimonios" className="max-w-5xl mx-auto px-10 py-32">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6 text-center">— Voces —</p>
        <div className="space-y-20">
          {testimonios.slice(0, 3).map((t) => (
            <figure key={t.nombre} className="text-center">
              <span className="display text-7xl text-[var(--accent)] leading-none">"</span>
              <blockquote className="display text-3xl md:text-4xl italic leading-relaxed text-justify font-light mb-8 -mt-4">
                {t.texto}
              </blockquote>
              <figcaption className="text-xs tracking-[0.25em] uppercase text-[var(--fg-muted)]">
                {t.nombre} · {t.ciudad}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* CTA + Contacto */}
      <section id="contacto" className="bg-[var(--bg-alt)] border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-10 py-32 grid md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-6">— Reservar —</p>
            <h2 className="display text-5xl md:text-6xl italic font-light leading-tight mb-8">
              Su sonrisa, nuestra obsesión.
            </h2>
            <p className="text-lg text-[var(--fg-muted)] mb-10 leading-relaxed text-justify">
              Atendemos por cita previa para garantizar la atención exclusiva que cada paciente merece.
            </p>
            <WhatsAppButton size="lg">Reservar valoración privada</WhatsAppButton>
          </div>
          <div className="space-y-8 md:border-l md:border-[var(--border)] md:pl-16">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-2">Dirección</p>
              <p className="display text-2xl italic">{clinica.direccion}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-2">Horario</p>
              <p className="display text-2xl italic">{clinica.horario}</p>
            </div>
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--accent)] mb-2">WhatsApp</p>
              <p className="display text-2xl italic">{clinica.whatsappDisplay}</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] py-10 text-center text-xs tracking-[0.25em] uppercase text-[var(--fg-muted)]">
        © {new Date().getFullYear()} · {clinica.nombre} · By {clinica.doctor}
      </footer>
    </main>
  )
}
