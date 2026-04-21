import { internalMutation } from "./_generated/server";

type SectionComp = {
  type: string;
  variant: string;
  order: number;
};

function familySections(familia: string, hasVideo: boolean): SectionComp[] {
  const variant = familia;
  const sections: SectionComp[] = [
    { type: "header", variant, order: 0 },
    {
      type: "hero",
      variant: hasVideo ? `${variant}-video` : `${variant}-image`,
      order: 1,
    },
  ];

  let order = 2;

  if (familia === "clinico") {
    sections.push({ type: "stats", variant: "clinico", order: order++ });
  }

  sections.push(
    { type: "services", variant, order: order++ },
    { type: "team", variant, order: order++ },
    { type: "testimonials", variant, order: order++ },
    { type: "cta-contact", variant, order: order++ },
    { type: "footer", variant, order: order++ },
  );

  return sections;
}

const presets = [
  // Cálido
  {
    slug: "calido-melocoton",
    name: { es: "Cálido — Melocotón" },
    description: {
      es: "Calidez de hogar. Tonos durazno y terracota que invitan a quedarse.",
    },
    familia: "calido",
    tokens: {
      "--bg": "#fef6f0",
      "--bg-alt": "#fbe8d8",
      "--fg": "#3a2820",
      "--fg-muted": "#86695b",
      "--primary": "#d96b3a",
      "--primary-fg": "#ffffff",
      "--accent": "#f4a577",
      "--accent-fg": "#3a2820",
      "--border": "#f0d9c4",
      "--card": "#ffffff",
      "--card-fg": "#3a2820",
      "--radius": "20px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
  {
    slug: "calido-crema",
    name: { es: "Cálido — Crema" },
    description: {
      es: "Serenidad cálida. Crema y verde salvia para una clínica que abraza.",
    },
    familia: "calido",
    tokens: {
      "--bg": "#faf7f2",
      "--bg-alt": "#f0ebe1",
      "--fg": "#2d2a24",
      "--fg-muted": "#7a7468",
      "--primary": "#7c9a6e",
      "--primary-fg": "#ffffff",
      "--accent": "#c4a96a",
      "--accent-fg": "#2d2a24",
      "--border": "#e5dfd3",
      "--card": "#ffffff",
      "--card-fg": "#2d2a24",
      "--radius": "20px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
  {
    slug: "calido-lavanda",
    name: { es: "Cálido — Lavanda" },
    description: {
      es: "Dulzura y calma. Lavanda suave con coral para un espacio relajante.",
    },
    familia: "calido",
    tokens: {
      "--bg": "#f9f5fc",
      "--bg-alt": "#efe6f5",
      "--fg": "#2e2535",
      "--fg-muted": "#7a6d88",
      "--primary": "#9b6bb5",
      "--primary-fg": "#ffffff",
      "--accent": "#e8837c",
      "--accent-fg": "#ffffff",
      "--border": "#e4d8f0",
      "--card": "#ffffff",
      "--card-fg": "#2e2535",
      "--radius": "20px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
  // Elegante
  {
    slug: "elegante-gris",
    name: { es: "Elegante — Gris Perla" },
    description: {
      es: "Sutileza y refinamiento. Un susurro de oro sobre un lienzo de perla.",
    },
    familia: "elegante",
    tokens: {
      "--bg": "#f5f3f0",
      "--bg-alt": "#ebe7e1",
      "--fg": "#2a2724",
      "--fg-muted": "#7a756e",
      "--primary": "#2a2724",
      "--primary-fg": "#f5f3f0",
      "--accent": "#b89b5e",
      "--accent-fg": "#2a2724",
      "--border": "#ddd8d0",
      "--card": "#ffffff",
      "--card-fg": "#2a2724",
      "--radius": "2px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Playfair Display', Georgia, serif",
    },
  },
  {
    slug: "elegante-marfil",
    name: { es: "Elegante — Marfil" },
    description: {
      es: "Nobleza serena. Marfil y burdeos susurran tradición y excelencia.",
    },
    familia: "elegante",
    tokens: {
      "--bg": "#faf8f3",
      "--bg-alt": "#f2ede4",
      "--fg": "#2d2826",
      "--fg-muted": "#7a7370",
      "--primary": "#6b3040",
      "--primary-fg": "#faf8f3",
      "--accent": "#b89b5e",
      "--accent-fg": "#2d2826",
      "--border": "#e8e1d5",
      "--card": "#ffffff",
      "--card-fg": "#2d2826",
      "--radius": "2px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Playfair Display', Georgia, serif",
    },
  },
  {
    slug: "elegante-hueso",
    name: { es: "Elegante — Hueso" },
    description: {
      es: "Minimalismo editorial. Hueso y verde bosque para un atelier contemporáneo.",
    },
    familia: "elegante",
    tokens: {
      "--bg": "#f4f1ec",
      "--bg-alt": "#eae5dd",
      "--fg": "#1e2a22",
      "--fg-muted": "#6b756d",
      "--primary": "#2f5240",
      "--primary-fg": "#f4f1ec",
      "--accent": "#9e8654",
      "--accent-fg": "#1e2a22",
      "--border": "#ddd7cc",
      "--card": "#ffffff",
      "--card-fg": "#1e2a22",
      "--radius": "2px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Playfair Display', Georgia, serif",
    },
  },
  // Lujoso
  {
    slug: "lujoso-negro",
    name: { es: "Lujoso — Negro + Dorado" },
    description: {
      es: "El estándar de oro del lujo. Negro profundo, oro real, crema cálida.",
    },
    familia: "lujoso",
    tokens: {
      "--bg": "#0c0b0a",
      "--bg-alt": "#181614",
      "--fg": "#f5ede0",
      "--fg-muted": "#9a9080",
      "--primary": "#c9a84c",
      "--primary-fg": "#0c0b0a",
      "--accent": "#c9a84c",
      "--accent-fg": "#0c0b0a",
      "--border": "#2a2622",
      "--card": "#141210",
      "--card-fg": "#f5ede0",
      "--radius": "0px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Cormorant Garamond', Georgia, serif",
    },
  },
  {
    slug: "lujoso-carbon",
    name: { es: "Lujoso — Carbón + Plata" },
    description: {
      es: "Lujo gélido. Carbón con plata fría para una estética vanguardista.",
    },
    familia: "lujoso",
    tokens: {
      "--bg": "#111214",
      "--bg-alt": "#1a1c1e",
      "--fg": "#e8e8ea",
      "--fg-muted": "#8a8c90",
      "--primary": "#a0a4aa",
      "--primary-fg": "#111214",
      "--accent": "#c0c4ca",
      "--accent-fg": "#111214",
      "--border": "#2a2c30",
      "--card": "#18191c",
      "--card-fg": "#e8e8ea",
      "--radius": "0px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Cormorant Garamond', Georgia, serif",
    },
  },
  {
    slug: "lujoso-borgona",
    name: { es: "Lujoso — Borgoña" },
    description: {
      es: "Drama teatral. Borgoña profundo con oro rosa para un lujo más cálido.",
    },
    familia: "lujoso",
    tokens: {
      "--bg": "#120a0e",
      "--bg-alt": "#1e1218",
      "--fg": "#f2e6e8",
      "--fg-muted": "#9a848a",
      "--primary": "#c8a070",
      "--primary-fg": "#120a0e",
      "--accent": "#8b3a50",
      "--accent-fg": "#f2e6e8",
      "--border": "#2e1e24",
      "--card": "#180e14",
      "--card-fg": "#f2e6e8",
      "--radius": "0px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Cormorant Garamond', Georgia, serif",
    },
  },
  // Clínico
  {
    slug: "clinico-azul",
    name: { es: "Clínico — Azul Médico" },
    description: {
      es: "Confianza clínica. El azul que toda clínica seria necesita.",
    },
    familia: "clinico",
    tokens: {
      "--bg": "#ffffff",
      "--bg-alt": "#f0f4f8",
      "--fg": "#1a2332",
      "--fg-muted": "#5a6a7a",
      "--primary": "#1e5fa0",
      "--primary-fg": "#ffffff",
      "--accent": "#3a8fd4",
      "--accent-fg": "#ffffff",
      "--border": "#d8e2ec",
      "--card": "#ffffff",
      "--card-fg": "#1a2332",
      "--radius": "10px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
  {
    slug: "clinico-verde",
    name: { es: "Clínico — Verde Salud" },
    description: {
      es: "Salud y naturaleza. Verde institucional que comunica bienestar.",
    },
    familia: "clinico",
    tokens: {
      "--bg": "#ffffff",
      "--bg-alt": "#f0f5f2",
      "--fg": "#1a2b22",
      "--fg-muted": "#5a7068",
      "--primary": "#1d7a5a",
      "--primary-fg": "#ffffff",
      "--accent": "#2aa87a",
      "--accent-fg": "#ffffff",
      "--border": "#d2e4da",
      "--card": "#ffffff",
      "--card-fg": "#1a2b22",
      "--radius": "10px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
  {
    slug: "clinico-gris",
    name: { es: "Clínico — Gris Acero" },
    description: {
      es: "Autoridad neutral. Gris acero para clínicas que priorizan seriedad.",
    },
    familia: "clinico",
    tokens: {
      "--bg": "#ffffff",
      "--bg-alt": "#f2f3f5",
      "--fg": "#1c1e22",
      "--fg-muted": "#62656c",
      "--primary": "#3a3d44",
      "--primary-fg": "#ffffff",
      "--accent": "#5a8fd4",
      "--accent-fg": "#ffffff",
      "--border": "#dcdee2",
      "--card": "#ffffff",
      "--card-fg": "#1c1e22",
      "--radius": "10px",
      "--font-body": "'Geist Sans', system-ui, sans-serif",
      "--font-display": "'Geist Sans', system-ui, sans-serif",
    },
  },
];

export const run = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("previewPresets").first();
    if (existing) {
      console.log("Presets already seeded, skipping.");
      return;
    }

    const now = Date.now();

    for (const p of presets) {
      const isVideo = false;
      await ctx.db.insert("previewPresets", {
        slug: p.slug,
        name: p.name,
        description: p.description,
        industry: "dental",
        familia: p.familia,
        tokens: p.tokens,
        sectionComposition: familySections(p.familia, isVideo),
        headerVariant: p.familia,
        footerVariant: p.familia,
        active: true,
        thumbnailUrl: undefined,
        createdAt: now,
      });
    }

    console.log(`Seeded ${presets.length} preview presets.`);
  },
});
