import { internalMutation } from "./_generated/server";
import { api } from "./_generated/api";

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
      tagline: "Sonrisas que transforman vidas",
      description:
        "En Axia Odontología te recibimos como a alguien de la familia. Tomamos café juntos, te explicamos todo sin tecnicismos y cuidamos tu sonrisa con todo el cariño del mundo.",
      email: "contacto@axiaodontologia.com",
      phone: "+57 304 321 8666",
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
      phone: "+57 304 321 8666",
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

    // --- Specialists (with photos + bios) ---
    const drFrancisco = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dr. Francisco Díaz",
      specialty: {
        es: "Director Médico · Rehabilitación Oral",
        en: "Medical Director · Oral Rehabilitation",
      },
      bio: {
        es: "Especialista en rehabilitación oral con más de 12 años de experiencia. Fundador de Axia Odontología y referente en diseño de sonrisa en Barranquilla.",
        en: "Oral rehabilitation specialist with over 12 years of experience. Founder of Axia Odontología and a leading figure in smile design in Barranquilla.",
      },
      photoUrl:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=600&q=80",
      calendarId: "CALENDAR_ID_FRANCISCO",
      active: true,
      createdAt: now,
    });

    const draCamila = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dra. Camila Restrepo",
      specialty: {
        es: "Ortodoncia y Odontología Estética",
        en: "Orthodontics and Aesthetic Dentistry",
      },
      bio: {
        es: "Ortodoncista certificada en alineadores invisibles. Apasionada por crear sonrisas armónicas que respetan las facciones de cada paciente.",
        en: "Certified orthodontist in invisible aligners. Passionate about creating harmonious smiles that respect each patient's features.",
      },
      photoUrl:
        "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=600&q=80",
      calendarId: "CALENDAR_ID_CAMILA",
      active: true,
      createdAt: now,
    });

    const drMateo = await ctx.db.insert("specialists", {
      tenantId: axiaId,
      locationIds: [barraquillaId],
      name: "Dr. Mateo Vargas",
      specialty: {
        es: "Odontopediatría",
        en: "Pediatric Dentistry",
      },
      bio: {
        es: "Especialista en odontología infantil. Su enfoque cálido y paciente convierte cada visita en una experiencia positiva para los niños.",
        en: "Specialist in pediatric dentistry. His warm and patient approach turns every visit into a positive experience for children.",
      },
      photoUrl:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=600&q=80",
      calendarId: "CALENDAR_ID_MATEO",
      active: true,
      createdAt: now,
    });

    // --- Services (11, matching demo with longDescription) ---
    const serviceData = [
      {
        slug: "diseno-de-sonrisa",
        name: { es: "Diseño de Sonrisa", en: "Smile Design" },
        shortDescription: {
          es: "Diseñamos tu sonrisa ideal con tecnología digital y arte odontológico.",
          en: "We design your ideal smile with digital technology and dental artistry.",
        },
        longDescription: {
          es: "Combinamos planeación digital, carillas de porcelana y un análisis facial completo para crear una sonrisa que se ve natural y se siente tuya.",
          en: "We combine digital planning, porcelain veneers, and a complete facial analysis to create a smile that looks natural and feels like yours.",
        },
        duration: 120,
        priceCOP: 8_000_000,
        priceUSD: 2_150,
        specialistIds: [drFrancisco],
      },
      {
        slug: "implantes-dentales",
        name: { es: "Implantes Dentales", en: "Dental Implants" },
        shortDescription: {
          es: "Reemplaza dientes perdidos con implantes que duran toda la vida.",
          en: "Replace lost teeth with implants that last a lifetime.",
        },
        longDescription: {
          es: "Implantes de titanio de grado médico colocados con guías quirúrgicas digitales para máxima precisión, mínima invasión y resultados estéticos impecables.",
          en: "Medical-grade titanium implants placed with digital surgical guides for maximum precision, minimal invasion, and impeccable aesthetic results.",
        },
        duration: 90,
        priceCOP: 4_500_000,
        priceUSD: 1_200,
        specialistIds: [drFrancisco],
      },
      {
        slug: "ortodoncia",
        name: { es: "Ortodoncia / Brackets", en: "Orthodontics / Braces" },
        shortDescription: {
          es: "Brackets tradicionales, autoligados y alineadores invisibles.",
          en: "Traditional braces, self-ligating braces, and invisible aligners.",
        },
        longDescription: {
          es: "Tratamientos de ortodoncia para todas las edades, desde brackets metálicos hasta alineadores transparentes invisibles para adultos.",
          en: "Orthodontic treatments for all ages, from metal braces to invisible clear aligners for adults.",
        },
        duration: 45,
        priceCOP: 3_500_000,
        priceUSD: 950,
        specialistIds: [draCamila],
      },
      {
        slug: "blanqueamiento",
        name: { es: "Blanqueamiento", en: "Teeth Whitening" },
        shortDescription: {
          es: "Aclara tu sonrisa varios tonos en una sola sesión.",
          en: "Brighten your smile several shades in a single session.",
        },
        longDescription: {
          es: "Blanqueamiento profesional en consultorio con luz LED y fórmulas seguras para el esmalte. Resultados visibles desde la primera sesión.",
          en: "Professional in-office whitening with LED light and enamel-safe formulas. Visible results from the first session.",
        },
        duration: 60,
        priceCOP: 500_000,
        priceUSD: 135,
        specialistIds: [drFrancisco],
      },
      {
        slug: "endodoncia",
        name: { es: "Endodoncia", en: "Root Canal" },
        shortDescription: {
          es: "Tratamientos de conducto sin dolor con tecnología rotatoria.",
          en: "Painless root canal treatments with rotary technology.",
        },
        longDescription: {
          es: "Endodoncias modernas con instrumentación rotatoria, microscopio y anestesia avanzada para una experiencia confortable y resultados duraderos.",
          en: "Modern root canals with rotary instrumentation, microscope, and advanced anesthesia for a comfortable experience and lasting results.",
        },
        duration: 90,
        priceCOP: 400_000,
        priceUSD: 110,
        specialistIds: [drFrancisco],
      },
      {
        slug: "periodoncia",
        name: { es: "Periodoncia", en: "Periodontics" },
        shortDescription: {
          es: "Cuidamos las encías, fundamento de toda sonrisa saludable.",
          en: "We care for gums, the foundation of every healthy smile.",
        },
        longDescription: {
          es: "Diagnóstico, prevención y tratamiento de enfermedades de las encías. La salud periodontal es la base de todo tratamiento estético.",
          en: "Diagnosis, prevention, and treatment of gum diseases. Periodontal health is the foundation of all aesthetic treatments.",
        },
        duration: 60,
        priceCOP: 350_000,
        priceUSD: 95,
        specialistIds: [drFrancisco],
      },
      {
        slug: "odontologia-pediatrica",
        name: { es: "Odontología Pediátrica", en: "Pediatric Dentistry" },
        shortDescription: {
          es: "Atención especializada para los más pequeños de la casa.",
          en: "Specialized care for the little ones at home.",
        },
        longDescription: {
          es: "Una experiencia diseñada para niños: lenguaje amigable, técnicas de manejo conductual y un ambiente que vuelve la visita al dentista algo divertido.",
          en: "An experience designed for children: friendly language, behavioral management techniques, and an environment that makes the dentist visit fun.",
        },
        duration: 30,
        priceCOP: 180_000,
        priceUSD: 50,
        specialistIds: [drMateo],
      },
      {
        slug: "protesis",
        name: { es: "Prótesis y Coronas", en: "Prosthetics and Crowns" },
        shortDescription: {
          es: "Coronas y prótesis personalizadas con cerámicas de alta gama.",
          en: "Custom crowns and prosthetics with high-end ceramics.",
        },
        longDescription: {
          es: "Prótesis fijas y removibles fabricadas con cerámicas de última generación, indistinguibles de los dientes naturales en color y translucidez.",
          en: "Fixed and removable prosthetics made with next-generation ceramics, indistinguishable from natural teeth in color and translucency.",
        },
        duration: 60,
        priceCOP: 1_500_000,
        priceUSD: 400,
        specialistIds: [drFrancisco],
      },
      {
        slug: "cirugia-oral",
        name: { es: "Cirugía Oral", en: "Oral Surgery" },
        shortDescription: {
          es: "Extracciones, cordales y cirugía maxilofacial menor.",
          en: "Extractions, wisdom teeth, and minor maxillofacial surgery.",
        },
        longDescription: {
          es: "Procedimientos quirúrgicos realizados con técnicas mínimamente invasivas para una recuperación más rápida y cómoda.",
          en: "Surgical procedures performed with minimally invasive techniques for faster and more comfortable recovery.",
        },
        duration: 60,
        priceCOP: 300_000,
        priceUSD: 80,
        specialistIds: [drFrancisco],
      },
      {
        slug: "limpieza",
        name: { es: "Limpieza y Profilaxis", en: "Cleaning and Prophylaxis" },
        shortDescription: {
          es: "Higiene profesional cada 6 meses para una sonrisa radiante.",
          en: "Professional hygiene every 6 months for a radiant smile.",
        },
        longDescription: {
          es: "Eliminación de placa, sarro y manchas con ultrasonido y pulido profesional. La cita más importante para mantener tu sonrisa sana.",
          en: "Plaque, tartar, and stain removal with ultrasound and professional polishing. The most important appointment to keep your smile healthy.",
        },
        duration: 30,
        priceCOP: 150_000,
        priceUSD: 40,
        specialistIds: [draCamila],
      },
      {
        slug: "rehabilitacion-oral",
        name: { es: "Rehabilitación Oral", en: "Oral Rehabilitation" },
        shortDescription: {
          es: "Devolvemos forma, función y estética a casos complejos.",
          en: "We restore form, function, and aesthetics to complex cases.",
        },
        longDescription: {
          es: "Tratamientos integrales que combinan implantes, prótesis, periodoncia y estética para casos de pérdida dental múltiple o desgaste severo.",
          en: "Comprehensive treatments combining implants, prosthetics, periodontics, and aesthetics for multiple tooth loss or severe wear cases.",
        },
        duration: 120,
        priceCOP: 12_000_000,
        priceUSD: 3_200,
        specialistIds: [drFrancisco],
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

    console.log(
      "Seed complete: tenant Axia, 1 location, 3 specialists (with photos+bio), 11 services (with longDescription).",
    );
  },
});

export const applyDefaultPreset = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", "axia"))
      .first();
    if (!tenant) {
      console.log("Tenant axia not found, skipping preset apply.");
      return;
    }

    await ctx.runMutation(api.presets.applyToTenant, {
      tenantId: tenant._id,
      presetSlug: "calido-melocoton",
    });

    console.log("Applied preset calido-melocoton to Axia via applyToTenant.");
  },
});

export const reset = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "tenants",
      "tenantLocations",
      "specialists",
      "services",
      "tenantPages",
      "pageSections",
      "designTokens",
      "tenantPreviews",
      "tenantImages",
      "previewPresets",
    ] as const;

    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
    }

    console.log("Database cleared. Run seed:run to re-seed.");
  },
});
