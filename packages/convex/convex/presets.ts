import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

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

const defaultContent: Record<string, Record<string, unknown>> = {
  header: {
    clinicName: "Clínica Demo",
    navItems: [
      { label: { es: "Inicio" }, href: "#" },
      { label: { es: "Servicios" }, href: "#servicios" },
      { label: { es: "Equipo" }, href: "#equipo" },
      { label: { es: "Contacto" }, href: "#contacto" },
    ],
    ctaLabel: { es: "Agendar cita" },
    ctaHref: "#contacto",
    overlay: false,
  },
  hero: {
    heading: { es: "Tu sonrisa merece lo mejor" },
    headingAccent: { es: "lo mejor" },
    subheading: { es: "Odontología de alta calidad con tecnología de vanguardia y un equipo humano comprometido con tu bienestar." },
    ctas: [
      { label: { es: "Agendar cita" }, href: "#contacto", variant: "primary" },
      { label: { es: "Conocer servicios" }, href: "#servicios", variant: "secondary" },
    ],
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=900&q=85",
  },
  services: {
    eyebrow: { es: "Nuestros servicios" },
    heading: { es: "Cuidado dental integral" },
    subheading: { es: "Ofrecemos una amplia gama de tratamientos para toda la familia." },
    items: [
      { name: { es: "Limpieza dental" }, description: { es: "Limpieza profesional para mantener tu sonrisa saludable." } },
      { name: { es: "Blanqueamiento" }, description: { es: "Recupera el blanco natural de tus dientes." } },
      { name: { es: "Ortodoncia" }, description: { es: "Alinea tu sonrisa con las últimas técnicas." } },
    ],
  },
  team: {
    eyebrow: { es: "Nuestro equipo" },
    heading: { es: "Profesionales comprometidos" },
    subheading: { es: "Un equipo multidisciplinario dedicado a tu salud dental." },
    members: [
      { name: "Dr. Ejemplo", role: { es: "Odontólogo General" }, bio: { es: "10 años de experiencia." }, photoUrl: "" },
    ],
  },
  testimonials: {
    eyebrow: { es: "Testimonios" },
    heading: { es: "Lo que dicen nuestros pacientes" },
    items: [
      { name: "María G.", location: "Barranquilla", service: "Blanqueamiento", text: { es: "Excelente servicio, muy profesionales." }, rating: 5 },
      { name: "Carlos R.", location: "Barranquilla", service: "Limpieza", text: { es: "Me sentí muy cómodo durante todo el proceso." }, rating: 5 },
    ],
  },
  stats: {
    items: [
      { value: "10+", label: { es: "Años de experiencia" } },
      { value: "5000+", label: { es: "Pacientes felices" } },
      { value: "15+", label: { es: "Especialistas" } },
    ],
  },
  "cta-contact": {
    heading: { es: "¿Listo para tu nueva sonrisa?" },
    subheading: { es: "Agenda tu cita hoy y da el primer paso." },
    cta: { label: { es: "Agendar cita" }, href: "#", variant: "primary" },
    details: [
      { icon: "phone", text: { es: "+57 300 123 4567" } },
      { icon: "clock", text: { es: "Lun - Sáb: 8:00 - 18:00" } },
      { icon: "map", text: { es: "Calle 84 #53-100, Barranquilla" } },
    ],
  },
  footer: {
    clinicName: "Clínica Demo",
  },
};

export const resolvePreview = query({
  args: { presetSlug: v.string() },
  handler: async (ctx, { presetSlug }) => {
    const preset = await ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", presetSlug))
      .first();
    if (!preset) return null;

    const sections = [];
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
        content = defaultContent[comp.type] ?? {};
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

    for (const comp of preset.sectionComposition) {
      let content = {};
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
        if (seed) content = seed.content;
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
