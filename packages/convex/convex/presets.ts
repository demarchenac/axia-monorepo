import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

const FAMILIA_VIDEOS: Record<string, string> = {
  calido: "https://uto3ti0wqm.ufs.sh/f/W7XvdHwCCg5Doazq8PBXcXNn8FCzQM9bTy4BedivlkpsRUwm",
  elegante: "https://uto3ti0wqm.ufs.sh/f/W7XvdHwCCg5DKQQEqDMNY9kd8fWFj7AX0DnR3VMweUBT4gHE",
  lujoso: "https://uto3ti0wqm.ufs.sh/f/W7XvdHwCCg5D9EyxTm2UKMLxod1C4WjAcsqSlpFmbOgtziGT",
  clinico: "https://uto3ti0wqm.ufs.sh/f/W7XvdHwCCg5DVaY0YarmN21v3p5XSbUlezhQ7L4kwFPGZCnE",
};

export const getByIndustry = query({
  args: { industry: v.string() },
  handler: async (ctx, { industry }) => {
    return ctx.db
      .query("previewPresets")
      .withIndex("by_industry_active", (q) =>
        q.eq("industry", industry).eq("active", true),
      )
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

type FamiliaCopy = {
  header: {
    navItems: { label: string; href: string }[];
    ctaLabel?: string;
  };
  hero: {
    heading: string;
    headingAccent: string;
    subheading: string;
    badge: string;
    ctaLabel: string;
    ctaSecondaryLabel?: string;
    imageUrl?: string;
    socialProof?: {
      rating: string;
      ratingSource: string;
      extraText: string;
    };
    highlightStat?: { value: string; label: string };
    quote?: string;
    quoteAttribution?: string;
  };
  services: { eyebrow: string; heading: string; subheading: string };
  team: { eyebrow: string; heading: string; subheading: string };
  testimonials: { eyebrow: string; heading: string };
  stats?: { items: { value: string; label: string }[] };
  cta: {
    eyebrow?: string;
    emoji?: string;
    heading: string;
    subheading: string;
    ctaLabel: string;
    phoneLabel?: string;
  };
};

const familyCopies: Record<string, FamiliaCopy> = {
  calido: {
    header: {
      navItems: [
        { label: "Lo que hacemos", href: "#servicios" },
        { label: "Nuestro equipo", href: "#equipo" },
        { label: "Historias", href: "#testimonios" },
      ],
    },
    hero: {
      heading: "Acá no hay miedo al dentista.",
      headingAccent: "Solo sonrisas.",
      subheading:
        "En {name} te recibimos como a alguien de la familia. Tomamos café juntos, te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.",
      badge: "Atención cálida desde 2013",
      ctaLabel: "Agendar mi visita",
      ctaSecondaryLabel: "¿Qué hacemos?",
      imageUrl:
        "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85",
    },
    services: {
      eyebrow: "¿Qué hacemos?",
      heading: "Cuidamos tu sonrisa, completa.",
      subheading:
        "{count} tratamientos pensados para acompañarte en cada etapa de tu vida.",
    },
    team: {
      eyebrow: "El equipo",
      heading: "Caras amigas",
      subheading:
        "Personas reales, cercanas y profundamente buenas en lo que hacen.",
    },
    testimonials: {
      eyebrow: "Historias reales",
      heading: "Lo que cuentan nuestros pacientes",
    },
    cta: {
      emoji: "😊",
      heading: "¿Listos para sonreír juntos?",
      subheading:
        "Escríbenos por WhatsApp y te ayudamos a agendar tu primera visita. Te respondemos rapidito 🌸",
      ctaLabel: "¡Quiero agendar! 💌",
    },
  },
  elegante: {
    header: {
      navItems: [
        { label: "Servicios", href: "#servicios" },
        { label: "Equipo", href: "#equipo" },
        { label: "Pacientes", href: "#testimonios" },
        { label: "Contacto", href: "#contacto" },
      ],
      ctaLabel: "Agendar",
    },
    hero: {
      heading: "La sonrisa, una obra de arte personal.",
      headingAccent: "una obra",
      subheading:
        "Diseñamos cada sonrisa como una pieza única. Combinamos tecnología de vanguardia con la atención artesanal que mereces.",
      badge: "By {doctor}",
      ctaLabel: "Agendar consulta",
      ctaSecondaryLabel: "Servicios",
    },
    services: {
      eyebrow: "Nuestros Servicios",
      heading: "Once tratamientos, una sola filosofía",
      subheading: "",
    },
    team: {
      eyebrow: "Nuestro Equipo",
      heading: "Especialistas con alma",
      subheading: "",
    },
    testimonials: { eyebrow: "Pacientes", heading: "Voces que nos honran" },
    cta: {
      eyebrow: "Comencemos",
      heading: "Tu próxima sonrisa te está esperando.",
      subheading:
        "Agenda tu valoración inicial. Te escuchamos sin compromiso.",
      ctaLabel: "Escríbenos por WhatsApp",
    },
  },
  lujoso: {
    header: {
      navItems: [
        { label: "Servicios", href: "#servicios" },
        { label: "Maestros", href: "#equipo" },
        { label: "Pacientes", href: "#testimonios" },
        { label: "Reservar", href: "#contacto" },
      ],
      ctaLabel: "Reservar cita",
    },
    hero: {
      heading: "Una sonrisa extraordinaria merece manos",
      headingAccent: "extraordinarias.",
      subheading:
        "Cada tratamiento en {name} es una obra hecha a medida. Tecnología alemana, materiales suizos, atención de boutique.",
      badge: "— Atelier Odontológico —",
      ctaLabel: "Reservar valoración",
      ctaSecondaryLabel: "Conocer especialidades",
      imageUrl:
        "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1000&q=85",
      quote: "Una experiencia digna de un hotel cinco estrellas.",
      quoteAttribution: "Vogue España, 2025",
    },
    services: {
      eyebrow: "Especialidades",
      heading: "Once disciplinas, dominadas a la perfección.",
      subheading:
        "Cada especialidad en {name} está liderada por un maestro reconocido en su campo. No externalizamos, no derivamos: lo que hacemos, lo hacemos en casa.",
    },
    team: {
      eyebrow: "Los Maestros",
      heading: "Quienes esculpen tu sonrisa",
      subheading: "",
    },
    testimonials: { eyebrow: "Voces", heading: "" },
    cta: {
      eyebrow: "Reservar",
      heading: "Su sonrisa, nuestra obsesión.",
      subheading:
        "Atendemos por cita previa para garantizar la atención exclusiva que cada paciente merece.",
      ctaLabel: "Reservar valoración privada",
      phoneLabel: "WhatsApp",
    },
  },
  clinico: {
    header: {
      navItems: [
        { label: "Servicios", href: "#servicios" },
        { label: "Equipo médico", href: "#equipo" },
        { label: "Pacientes", href: "#testimonios" },
        { label: "Contacto", href: "#contacto" },
      ],
      ctaLabel: "Agendar cita",
    },
    hero: {
      heading: "Salud dental con la",
      headingAccent: "precisión que mereces.",
      subheading:
        "{name} reúne especialistas certificados, tecnología de punta y un protocolo de atención centrado en ti. Resultados clínicos comprobables en cada visita.",
      badge: "Atención certificada · Tecnología de vanguardia",
      ctaLabel: "Agendar consulta",
      ctaSecondaryLabel: "Ver tratamientos",
      imageUrl:
        "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85",
      socialProof: {
        rating: "4.9",
        ratingSource: "en Google",
        extraText: "+8,500 pacientes",
      },
      highlightStat: { value: "12+", label: "Años cuidando sonrisas" },
    },
    services: {
      eyebrow: "Especialidades",
      heading: "Tratamientos para cada necesidad",
      subheading:
        "Once especialidades clínicas bajo un mismo techo, lideradas por profesionales certificados.",
    },
    team: {
      eyebrow: "Equipo Médico",
      heading: "Profesionales certificados",
      subheading: "",
    },
    testimonials: {
      eyebrow: "Pacientes",
      heading: "Lo que dicen quienes nos visitan",
    },
    stats: {
      items: [
        { value: "12+", label: "Años de experiencia" },
        { value: "8.500+", label: "Pacientes atendidos" },
        { value: "11", label: "Especialidades" },
        { value: "4.9★", label: "Calificación Google" },
      ],
    },
    cta: {
      heading: "Agenda tu cita hoy",
      subheading:
        "Atención el mismo día disponible. Respuesta inmediata por WhatsApp.",
      ctaLabel: "Agendar por WhatsApp",
    },
  },
};

const whatsappLink = (servicio?: string) => {
  const msg = servicio
    ? `Hola, quiero agendar una cita en Axia Odontología para ${servicio}.`
    : "Hola, quiero agendar una cita en Axia Odontología.";
  return `https://wa.me/573043218666?text=${encodeURIComponent(msg)}`;
};

const defaultContent: Record<string, Record<string, unknown>> = {
  header: {
    clinicName: "Axia Odontología",
    doctorName: "Dr. Francisco Díaz",
    navItems: [
      { label: { es: "Lo que hacemos" }, href: "#servicios" },
      { label: { es: "Nuestro equipo" }, href: "#equipo" },
      { label: { es: "Historias" }, href: "#testimonios" },
    ],
    overlay: false,
  },
  hero: {
    heading: { es: "Acá no hay miedo al dentista." },
    headingAccent: { es: "Solo sonrisas." },
    subheading: {
      es: "En Axia Odontología te recibimos como a alguien de la familia. Tomamos café juntos, te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.",
    },
    badge: { es: "Atención cálida desde 2013" },
    ctas: [
      { label: { es: "Agendar mi visita" }, href: whatsappLink(), variant: "primary" },
      { label: { es: "¿Qué hacemos?" }, href: "#servicios", variant: "secondary" },
    ],
    imageUrl:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=900&q=85",
    promiseCards: [
      {
        emoji: "☕",
        title: { es: "Café de bienvenida" },
        description: { es: "Llegas, te recibimos, conversamos." },
      },
      {
        emoji: "👶",
        title: { es: "Amigos de los niños" },
        description: { es: "Sin lágrimas, lo prometemos." },
      },
      {
        emoji: "💬",
        title: { es: "Sin tecnicismos" },
        description: { es: "Te explicamos como a un amigo." },
      },
    ],
  },
  services: {
    eyebrow: { es: "¿Qué hacemos?" },
    heading: { es: "Cuidamos tu sonrisa, completa." },
    subheading: {
      es: "Once tratamientos pensados para acompañarte en cada etapa de tu vida.",
    },
    items: [
      {
        name: { es: "Diseño de Sonrisa" },
        description: {
          es: "Combinamos planeación digital, carillas de porcelana y un análisis facial completo para crear una sonrisa que se ve natural y se siente tuya.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Diseño de Sonrisa") },
      },
      {
        name: { es: "Implantes Dentales" },
        description: {
          es: "Implantes de titanio de grado médico colocados con guías quirúrgicas digitales para máxima precisión, mínima invasión y resultados estéticos impecables.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Implantes Dentales") },
      },
      {
        name: { es: "Ortodoncia / Brackets" },
        description: {
          es: "Tratamientos de ortodoncia para todas las edades, desde brackets metálicos hasta alineadores transparentes invisibles para adultos.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Ortodoncia") },
      },
      {
        name: { es: "Blanqueamiento" },
        description: {
          es: "Blanqueamiento profesional en consultorio con luz LED y fórmulas seguras para el esmalte. Resultados visibles desde la primera sesión.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Blanqueamiento") },
      },
      {
        name: { es: "Endodoncia" },
        description: {
          es: "Endodoncias modernas con instrumentación rotatoria, microscopio y anestesia avanzada para una experiencia confortable y resultados duraderos.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Endodoncia") },
      },
      {
        name: { es: "Periodoncia" },
        description: {
          es: "Diagnóstico, prevención y tratamiento de enfermedades de las encías. La salud periodontal es la base de todo tratamiento estético.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Periodoncia") },
      },
      {
        name: { es: "Odontología Pediátrica" },
        description: {
          es: "Una experiencia diseñada para niños: lenguaje amigable, técnicas de manejo conductual y un ambiente que vuelve la visita al dentista algo divertido.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Odontología Pediátrica") },
      },
      {
        name: { es: "Prótesis y Coronas" },
        description: {
          es: "Prótesis fijas y removibles fabricadas con cerámicas de última generación, indistinguibles de los dientes naturales en color y translucidez.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Prótesis y Coronas") },
      },
      {
        name: { es: "Cirugía Oral" },
        description: {
          es: "Procedimientos quirúrgicos realizados con técnicas mínimamente invasivas para una recuperación más rápida y cómoda.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Cirugía Oral") },
      },
      {
        name: { es: "Limpieza y Profilaxis" },
        description: {
          es: "Eliminación de placa, sarro y manchas con ultrasonido y pulido profesional. La cita más importante para mantener tu sonrisa sana.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Limpieza") },
      },
      {
        name: { es: "Rehabilitación Oral" },
        description: {
          es: "Tratamientos integrales que combinan implantes, prótesis, periodoncia y estética para casos de pérdida dental múltiple o desgaste severo.",
        },
        cta: { label: { es: "Pregúntanos →" }, href: whatsappLink("Rehabilitación Oral") },
      },
    ],
  },
  team: {
    eyebrow: { es: "El equipo" },
    heading: { es: "Caras amigas" },
    subheading: {
      es: "Personas reales, cercanas y profundamente buenas en lo que hacen.",
    },
    members: [
      {
        name: "Dr. Francisco Díaz",
        role: { es: "Director Médico · Rehabilitación Oral" },
        bio: {
          es: "Especialista en rehabilitación oral con más de 12 años de experiencia. Fundador de Axia Odontología y referente en diseño de sonrisa en Barranquilla.",
        },
        photoUrl:
          "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
      },
      {
        name: "Dra. Camila Restrepo",
        role: { es: "Ortodoncia y Odontología Estética" },
        bio: {
          es: "Ortodoncista certificada en alineadores invisibles. Apasionada por crear sonrisas armónicas que respetan las facciones de cada paciente.",
        },
        photoUrl:
          "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
      },
      {
        name: "Dr. Mateo Vargas",
        role: { es: "Odontopediatría" },
        bio: {
          es: "Especialista en odontología infantil. Su enfoque cálido y paciente convierte cada visita en una experiencia positiva para los niños.",
        },
        photoUrl:
          "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
      },
    ],
  },
  testimonials: {
    eyebrow: { es: "Historias reales" },
    heading: { es: "Lo que cuentan nuestros pacientes" },
    items: [
      {
        name: "María Fernanda L.",
        location: "Barranquilla, Colombia",
        service: "Diseño de Sonrisa",
        text: {
          es: "Jamás imaginé sonreír así. El Dr. Francisco escuchó cada detalle de lo que quería y el resultado superó todas mis expectativas. Es como tener una sonrisa nueva que parece siempre haber sido mía.",
        },
        rating: 5,
      },
      {
        name: "Carlos A. Mendoza",
        location: "Miami, USA",
        service: "Implantes Dentales",
        text: {
          es: "Vine desde Miami por recomendación de un amigo. La atención fue impecable, el costo muchísimo más razonable que en Estados Unidos y el resultado de los implantes es de primera clase mundial.",
        },
        rating: 5,
      },
      {
        name: "Sofía Restrepo",
        location: "Medellín, Colombia",
        service: "Ortodoncia Invisible",
        text: {
          es: "Tres años usando los alineadores y nadie notó que los tenía puestos. La atención de la Dra. Camila siempre cálida, siempre puntual. 100% recomendados.",
        },
        rating: 5,
      },
      {
        name: "Andrés Pérez",
        location: "Barranquilla, Colombia",
        service: "Rehabilitación Oral",
        text: {
          es: "Llegué con un caso complejo después de años evitando al dentista. El equipo de Axia me devolvió la confianza para volver a sonreír sin tapar mi boca.",
        },
        rating: 5,
      },
      {
        name: "Laura Tatiana Gómez",
        location: "Cali, Colombia",
        service: "Blanqueamiento",
        text: {
          es: "Súper rápido y sin sensibilidad. Salí en una hora con varios tonos más claros. Las fotos del antes y después son sorprendentes.",
        },
        rating: 5,
      },
      {
        name: "Jennifer Walker",
        location: "Toronto, Canadá",
        service: "Coronas y Estética",
        text: {
          es: "They speak English perfectly and helped me coordinate my whole trip. The work is beautiful and the price was a fraction of what I would have paid back home.",
        },
        rating: 5,
      },
    ],
  },
  stats: {
    items: [
      { value: "12+", label: { es: "Años de experiencia" } },
      { value: "10,000+", label: { es: "Pacientes felices" } },
      { value: "3", label: { es: "Especialistas" } },
      { value: "98%", label: { es: "Pacientes satisfechos" } },
    ],
  },
  "cta-contact": {
    emoji: "😊",
    heading: { es: "¿Listos para sonreír juntos?" },
    subheading: {
      es: "Escríbenos por WhatsApp y te ayudamos a agendar tu primera visita. Te respondemos rapidito 🌸",
    },
    cta: {
      label: { es: "¡Quiero agendar! 💌" },
      href: whatsappLink(),
      className:
        "bg-white text-[var(--primary)] hover:bg-white/90 h-14 px-8 inline-flex items-center font-medium transition-all",
    },
    details: [
      { icon: "📍", label: { es: "Dirección" }, text: { es: "Calle 84 #53-100, Barranquilla, Colombia" } },
      { icon: "⏰", label: { es: "Horario" }, text: { es: "Lun - Sáb · 8:00 a.m. — 7:00 p.m." } },
      { icon: "📱", label: { es: "Teléfono" }, text: { es: "+57 304 321 8666" } },
    ],
  },
  footer: {
    clinicName: "Axia Odontología",
  },
};

export const resolvePreview = query({
  args: { presetSlug: v.string(), slug: v.optional(v.string()) },
  handler: async (ctx, { presetSlug, slug }) => {
    const preset = await ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", presetSlug))
      .first();
    if (!preset) return null;

    let contentMap: Record<string, Record<string, unknown>> = defaultContent;
    if (slug) {
      const tenant = await ctx.db
        .query("tenants")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .first();
      if (tenant) {
        contentMap = await buildContentFromTenant(ctx, tenant._id, preset.familia);
      }
    }

    const hasVideoHero = preset.sectionComposition.some(
      (c) => c.type === "hero" && c.variant.endsWith("-video"),
    );

    const sections = [];
    for (const comp of preset.sectionComposition) {
      let content = contentMap[comp.type] ?? defaultContent[comp.type] ?? {};
      if (comp.type === "header" && hasVideoHero) {
        content = { ...content, overlay: true };
      }
      if (comp.type === "hero" && comp.variant.endsWith("-video")) {
        content = {
          ...content,
          videoUrl: FAMILIA_VIDEOS[preset.familia] ?? FAMILIA_VIDEOS.calido,
        };
      }
      sections.push({
        type: comp.type,
        variant: comp.variant,
        order: comp.order,
        content,
        visible: true,
      });
    }

    return { preset, sections };
  },
});

async function buildContentFromTenant(
  ctx: any,
  tenantId: Id<"tenants">,
  familia?: string,
): Promise<Record<string, Record<string, unknown>>> {
  const tenant = await ctx.db.get(tenantId);
  if (!tenant) return defaultContent;

  const locale = tenant.defaultLocale ?? "es";
  const i = (text: string) => ({ [locale]: text });

  const locations = await ctx.db
    .query("tenantLocations")
    .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenantId))
    .collect();
  const primaryLoc = locations.find((l: any) => l.isPrimary) ?? locations[0];

  const specialists = await ctx.db
    .query("specialists")
    .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenantId))
    .collect();
  const activeSpecialists = specialists.filter((s: any) => s.active);

  const services = await ctx.db
    .query("services")
    .withIndex("by_tenant", (q: any) => q.eq("tenantId", tenantId))
    .collect();
  const activeServices = services.filter((s: any) => s.active);

  const whatsappNum =
    primaryLoc?.whatsappNumber ??
    tenant.phone?.replace(/[^0-9]/g, "") ??
    "";
  const makeWaLink = (servicio?: string) => {
    const msg = servicio
      ? `Hola, quiero agendar una cita en ${tenant.name} para ${servicio}.`
      : `Hola, quiero agendar una cita en ${tenant.name}.`;
    return `https://wa.me/${whatsappNum}?text=${encodeURIComponent(msg)}`;
  };

  const countryName = primaryLoc
    ? (countryCodes[primaryLoc.address.country] ?? primaryLoc.address.country)
    : "";
  const address = primaryLoc
    ? `${primaryLoc.address.street}, ${primaryLoc.address.city}, ${countryName}`
    : "";
  const phone = primaryLoc?.phone ?? tenant.phone ?? "";
  const phoneDisplay =
    primaryLoc?.phone ?? tenant.phone ?? "";
  const hours = primaryLoc?.openingHours?.length
    ? formatHours(primaryLoc.openingHours)
    : "";

  const ownerSpecialist = activeSpecialists[0];
  const base = defaultContent;

  const resolveI18n = (val: any): Record<string, string> =>
    typeof val === "object" && val !== null ? val : { [locale]: String(val ?? "") };

  const copy = familyCopies[familia ?? "calido"] ?? familyCopies.calido;
  const numToWord: Record<number, string> = {
    1: "Un", 2: "Dos", 3: "Tres", 4: "Cuatro", 5: "Cinco",
    6: "Seis", 7: "Siete", 8: "Ocho", 9: "Nueve", 10: "Diez",
    11: "Once", 12: "Doce", 13: "Trece", 14: "Catorce", 15: "Quince",
  };
  const serviceCount = activeServices.length || 11;
  const serviceCountText = numToWord[serviceCount] ?? String(serviceCount);

  const sub = (text: string) =>
    text
      .replace(/\{name\}/g, tenant.name)
      .replace(/\{tagline\}/g, tenant.tagline ?? "")
      .replace(/\{doctor\}/g, ownerSpecialist?.name ?? "")
      .replace(/\{count\}/g, serviceCountText);

  // --- Header ---
  const header: Record<string, unknown> = {
    clinicName: tenant.name,
    ...(ownerSpecialist ? { doctorName: ownerSpecialist.name } : {}),
    navItems: copy.header.navItems.map((n) => ({
      label: i(sub(n.label)),
      href: n.href,
    })),
    ...(copy.header.ctaLabel
      ? { ctaLabel: i(sub(copy.header.ctaLabel)), ctaHref: makeWaLink() }
      : {}),
    overlay: false,
  };

  if (familia === "clinico" && primaryLoc) {
    header.topBar = {
      address: i(address),
      schedule: i(hours),
      phone: whatsappNum,
      phoneDisplay: phoneDisplay,
    };
  }

  // --- Hero ---
  const baseHero = base.hero as Record<string, any>;
  const hero = {
    ...baseHero,
    heading: i(sub(copy.hero.heading)),
    headingAccent: i(sub(copy.hero.headingAccent)),
    subheading: i(sub(copy.hero.subheading)),
    badge: i(sub(copy.hero.badge)),
    ctas: [
      { label: i(sub(copy.hero.ctaLabel)), href: makeWaLink(), variant: "primary" },
      ...(copy.hero.ctaSecondaryLabel
        ? [{ label: i(sub(copy.hero.ctaSecondaryLabel)), href: "#servicios", variant: "secondary" }]
        : []),
    ],
    ...(copy.hero.imageUrl ? { imageUrl: copy.hero.imageUrl } : { imageUrl: undefined }),
    ...(copy.hero.socialProof
      ? {
          socialProof: {
            rating: copy.hero.socialProof.rating,
            ratingSource: i(sub(copy.hero.socialProof.ratingSource)),
            extraText: i(sub(copy.hero.socialProof.extraText)),
          },
        }
      : {}),
    ...(copy.hero.highlightStat
      ? {
          highlightStat: {
            value: copy.hero.highlightStat.value,
            label: i(sub(copy.hero.highlightStat.label)),
          },
        }
      : {}),
    ...(copy.hero.quote ? { quote: i(sub(copy.hero.quote)) } : {}),
    ...(copy.hero.quoteAttribution ? { quoteAttribution: i(sub(copy.hero.quoteAttribution)) } : {}),
  };

  // --- Services ---
  const dbServiceItems =
    activeServices.length > 0
      ? activeServices.map((s: any) => {
          const name = resolveI18n(s.name);
          const desc = resolveI18n(s.longDescription ?? s.shortDescription);
          const nameStr = name[locale] ?? Object.values(name)[0] ?? "";
          return {
            name,
            description: desc,
            cta: { label: i("Pregúntanos →"), href: makeWaLink(nameStr) },
          };
        })
      : null;
  const serviceItems = dbServiceItems ?? (base.services as any).items;
  const servicesContent = {
    eyebrow: i(sub(copy.services.eyebrow)),
    heading: i(sub(copy.services.heading)),
    subheading: i(sub(copy.services.subheading)),
    items: serviceItems,
  };

  // --- Team ---
  const richSpecialists = activeSpecialists.filter(
    (s: any) => s.photoUrl && s.bio,
  );
  const teamMembers =
    richSpecialists.length > 0
      ? richSpecialists.map((s: any) => ({
          name: s.name,
          role: resolveI18n(s.specialty),
          bio: resolveI18n(s.bio),
          photoUrl: s.photoUrl,
        }))
      : (base.team as any).members;
  const team = {
    eyebrow: i(sub(copy.team.eyebrow)),
    heading: i(sub(copy.team.heading)),
    subheading: i(sub(copy.team.subheading)),
    members: teamMembers,
  };

  // --- Testimonials ---
  const testimonials = {
    ...(base.testimonials ?? {}),
    eyebrow: i(sub(copy.testimonials.eyebrow)),
    ...(copy.testimonials.heading ? { heading: i(sub(copy.testimonials.heading)) } : {}),
  };

  // --- CTA ---
  const useLabels = familia === "elegante" || familia === "lujoso" || familia === "clinico";
  const ctaContact = {
    ...(copy.cta.eyebrow ? { eyebrow: i(sub(copy.cta.eyebrow)) } : {}),
    ...(copy.cta.emoji ? { emoji: copy.cta.emoji } : {}),
    heading: i(sub(copy.cta.heading)),
    subheading: i(sub(copy.cta.subheading)),
    cta: {
      label: i(sub(copy.cta.ctaLabel)),
      href: makeWaLink(),
    },
    details: [
      ...(address
        ? [{ icon: "📍", ...(useLabels ? { label: i("Dirección") } : {}), text: i(address) }]
        : []),
      ...(hours
        ? [{ icon: "⏰", ...(useLabels ? { label: i("Horario") } : {}), text: i(hours) }]
        : []),
      ...(phoneDisplay
        ? [{ icon: "📱", ...(useLabels ? { label: i(copy.cta.phoneLabel ?? "Teléfono") } : {}), text: i(phoneDisplay) }]
        : []),
    ],
  };

  // --- Footer ---
  const footer = {
    clinicName: tenant.name,
    ...(ownerSpecialist ? { doctorName: ownerSpecialist.name } : {}),
  };

  return {
    header,
    hero,
    services: servicesContent,
    team,
    testimonials,
    stats: copy.stats
      ? { items: copy.stats.items.map((s) => ({ value: s.value, label: i(sub(s.label)) })) }
      : (base.stats ?? {}),
    "cta-contact": ctaContact,
    footer,
  };
}

function to12h(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "p.m." : "a.m.";
  const hour = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0 ? `${hour}:00 ${period}` : `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function formatHours(openingHours: any[]): string {
  if (!openingHours || openingHours.length === 0) return "";
  const dayAbbr: Record<string, string> = {
    Monday: "Lun",
    Tuesday: "Mar",
    Wednesday: "Mié",
    Thursday: "Jue",
    Friday: "Vie",
    Saturday: "Sáb",
    Sunday: "Dom",
  };
  const first = openingHours[0];
  const last = openingHours[openingHours.length - 1];
  const firstDay = dayAbbr[first.dayOfWeek] ?? first.dayOfWeek;
  const lastDay = dayAbbr[last.dayOfWeek] ?? last.dayOfWeek;
  return `${firstDay} - ${lastDay} · ${to12h(first.opens)} — ${to12h(first.closes)}`;
}

const countryCodes: Record<string, string> = {
  CO: "Colombia",
  MX: "México",
  AR: "Argentina",
  CL: "Chile",
  PE: "Perú",
  EC: "Ecuador",
  US: "Estados Unidos",
  ES: "España",
};

export const applyToTenant = mutation({
  args: {
    tenantId: v.id("tenants"),
    presetSlug: v.string(),
  },
  handler: async (ctx, { tenantId, presetSlug }) => {
    const preset = await ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", presetSlug))
      .first();
    if (!preset) throw new Error("Preset not found");

    const now = Date.now();

    const tenantContent = await buildContentFromTenant(ctx, tenantId, preset.familia);

    const existingPage = await ctx.db
      .query("tenantPages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();

    let pageId: Id<"tenantPages">;
    if (existingPage) {
      pageId = existingPage._id;
      const existingSections = await ctx.db
        .query("pageSections")
        .withIndex("by_page_order", (q) => q.eq("pageId", pageId))
        .collect();
      await Promise.all(existingSections.map((s) => ctx.db.delete(s._id)));
      await ctx.db.patch(pageId, { updatedAt: now });
    } else {
      pageId = await ctx.db.insert("tenantPages", {
        tenantId,
        slug: "home",
        createdAt: now,
        updatedAt: now,
      });
    }

    const hasVideoHero = preset.sectionComposition.some(
      (c) => c.type === "hero" && c.variant.endsWith("-video"),
    );

    for (const comp of preset.sectionComposition) {
      let content: Record<string, unknown> = {};

      if (comp.contentKey) {
        const seed = await ctx.db
          .query("seedContent")
          .withIndex("by_industry_section_key", (q) =>
            q
              .eq("industry", preset.industry)
              .eq("sectionType", comp.type)
              .eq("contentKey", comp.contentKey!),
          )
          .first();
        if (seed) content = seed.content as Record<string, unknown>;
      }

      if (Object.keys(content).length === 0) {
        content = tenantContent[comp.type] ?? defaultContent[comp.type] ?? {};
      }

      if (comp.type === "header" && hasVideoHero) {
        content = { ...content, overlay: true };
      }
      if (comp.type === "hero" && comp.variant.endsWith("-video")) {
        content = { ...content, videoUrl: FAMILIA_VIDEOS[preset.familia] ?? FAMILIA_VIDEOS.calido };
      }

      await ctx.db.insert("pageSections", {
        pageId,
        type: comp.type,
        variant: comp.variant,
        order: comp.order,
        content,
        visible: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Apply design tokens from preset
    const existingTokens = await ctx.db
      .query("designTokens")
      .withIndex("by_tenant_active", (q) =>
        q.eq("tenantId", tenantId).eq("isActive", true),
      )
      .collect();
    await Promise.all(
      existingTokens.map((t) =>
        ctx.db.patch(t._id, { isActive: false, updatedAt: now }),
      ),
    );
    await ctx.db.insert("designTokens", {
      tenantId,
      name: preset.slug,
      tokens: preset.tokens,
      isActive: true,
      basedOnPresetSlug: presetSlug,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.insert("tenantPreviews", {
      tenantId,
      presetSlug,
      status: "selected",
      selectedAt: now,
      createdAt: now,
    });

    return pageId;
  },
});
