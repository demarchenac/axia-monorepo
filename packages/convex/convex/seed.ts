import { internalMutation } from "./_generated/server";

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("tenants").first();
    if (existing) {
      console.log("Database already seeded, skipping.");
      return;
    }

    const now = Date.now();

    // --- Tenant: Axia Odontología ---
    const axiaId = await ctx.db.insert("tenants", {
      name: "Axia Odontología",
      slug: "axia",
      industry: "dental",
      email: "contacto@axiaodontologia.com",
      phone: "573043218666",
      enabledLocales: ["es", "en"],
      defaultLocale: "es",
      country: "CO",
      status: "active",
      hasRealLogo: false,
      hasRealPhotos: false,
      reviewRequestsEnabled: false,
      createdAt: now,
      updatedAt: now,
    });

    // --- Location: Barranquilla (primary) ---
    const barraquillaId = await ctx.db.insert("tenantLocations", {
      tenantId: axiaId,
      name: { es: "Sede Barranquilla", en: "Barranquilla Branch" },
      slug: "barranquilla",
      isPrimary: true,
      address: {
        street: "Calle 84 #53-100",
        city: "Barranquilla",
        state: "Atlántico",
        country: "CO",
      },
      phone: "573043218666",
      whatsappNumber: "573043218666",
      email: "contacto@axiaodontologia.com",
      openingHours: [
        { dayOfWeek: "Monday", opens: "08:00", closes: "19:00" },
        { dayOfWeek: "Tuesday", opens: "08:00", closes: "19:00" },
        { dayOfWeek: "Wednesday", opens: "08:00", closes: "19:00" },
        { dayOfWeek: "Thursday", opens: "08:00", closes: "19:00" },
        { dayOfWeek: "Friday", opens: "08:00", closes: "19:00" },
        { dayOfWeek: "Saturday", opens: "08:00", closes: "19:00" },
      ],
      timezone: "America/Bogota",
      instagramHandle: "axiaodontologia",
      active: true,
      createdAt: now,
      updatedAt: now,
    });

    // --- Specialists ---
    const drFrancisco = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dr. Francisco Díaz",
      specialty: { es: "Odontología Estética", en: "Aesthetic Dentistry" },
      calendarId: "CALENDAR_ID_FRANCISCO",
      active: true,
      createdAt: now,
    });

    const draLopez = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dra. María López",
      specialty: { es: "Odontología General", en: "General Dentistry" },
      calendarId: "CALENDAR_ID_LOPEZ",
      active: true,
      createdAt: now,
    });

    const drHerrera = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dr. Andrés Herrera",
      specialty: { es: "Ortodoncia", en: "Orthodontics" },
      calendarId: "CALENDAR_ID_HERRERA",
      active: true,
      createdAt: now,
    });

    // --- Services ---
    const serviceData = [
      {
        slug: "limpieza-dental",
        name: { es: "Limpieza Dental", en: "Dental Cleaning" },
        shortDescription: { es: "Limpieza profesional", en: "Professional cleaning" },
        duration: 30,
        priceCOP: 150_000,
        priceUSD: 40,
        specialistIds: [draLopez],
      },
      {
        slug: "blanqueamiento",
        name: { es: "Blanqueamiento", en: "Teeth Whitening" },
        shortDescription: { es: "Blanqueamiento profesional", en: "Professional whitening" },
        duration: 60,
        priceCOP: 500_000,
        priceUSD: 135,
        specialistIds: [drFrancisco],
      },
      {
        slug: "carillas-porcelana",
        name: { es: "Carillas Porcelana (x1)", en: "Porcelain Veneers (x1)" },
        shortDescription: { es: "Carillas de porcelana", en: "Porcelain veneers" },
        duration: 60,
        priceCOP: 1_300_000,
        priceUSD: 350,
        specialistIds: [drFrancisco],
      },
      {
        slug: "diseno-de-sonrisa",
        name: { es: "Diseño de Sonrisa", en: "Smile Design" },
        shortDescription: { es: "Transformación completa de tu sonrisa", en: "Complete smile transformation" },
        duration: 120,
        priceCOP: 8_000_000,
        priceUSD: 2_150,
        specialistIds: [drFrancisco],
      },
      {
        slug: "brackets-metalicos",
        name: { es: "Brackets Metálicos", en: "Metal Braces" },
        shortDescription: { es: "Ortodoncia con brackets metálicos", en: "Metal braces orthodontics" },
        duration: 45,
        priceCOP: 3_500_000,
        priceUSD: 950,
        specialistIds: [drHerrera],
      },
      {
        slug: "alineadores-invisibles",
        name: { es: "Alineadores Invisibles", en: "Invisible Aligners" },
        shortDescription: { es: "Ortodoncia invisible", en: "Invisible orthodontics" },
        duration: 45,
        priceCOP: 6_000_000,
        priceUSD: 1_620,
        specialistIds: [drHerrera],
      },
      {
        slug: "endodoncia",
        name: { es: "Endodoncia", en: "Root Canal" },
        shortDescription: { es: "Tratamiento de conducto", en: "Root canal treatment" },
        duration: 90,
        priceCOP: 400_000,
        priceUSD: 110,
        specialistIds: [draLopez],
      },
      {
        slug: "extraccion-simple",
        name: { es: "Extracción Simple", en: "Simple Extraction" },
        shortDescription: { es: "Extracción dental simple", en: "Simple tooth extraction" },
        duration: 30,
        priceCOP: 150_000,
        priceUSD: 40,
        specialistIds: [draLopez],
      },
      {
        slug: "calza-resina",
        name: { es: "Calza Resina", en: "Resin Filling" },
        shortDescription: { es: "Restauración con resina", en: "Resin restoration" },
        duration: 30,
        priceCOP: 120_000,
        priceUSD: 32,
        specialistIds: [draLopez],
      },
    ];

    for (const s of serviceData) {
      await ctx.db.insert("services", {
        tenantId: axiaId,
        locationIds: [barraquillaId],
        active: true,
        createdAt: now,
        updatedAt: now,
        ...s,
      });
    }

    console.log("Seed complete: tenant Axia, 1 location, 3 specialists, 9 services.");
  },
});
