# Migración a Talvu Multi-Tenant — Versión Exhaustiva

> Documento de referencia completo. Cubre las 20 decisiones tomadas durante el grill, su razón, schema, ejemplos de código, fases de ejecución y consideraciones operativas.
>
> **Estado:** plan de ejecución. Algunas decisiones marcadas `PRICING_DRAFT` o `RESEARCH_NEEDED` requieren validación con datos antes de exponerse a clientes.
>
> **Fecha:** 2026-04-15. Revisar al inicio de cada nueva fase.

---

## Índice

1. [Contexto y visión](#1-contexto-y-visión)
2. [Decisiones arquitectónicas centrales](#2-decisiones-arquitectónicas-centrales)
3. [Schema de datos completo](#3-schema-de-datos-completo)
4. [Modularidad y pricing](#4-modularidad-y-pricing)
5. [Plan de ejecución por fases](#5-plan-de-ejecución-por-fases)
6. [Stack técnico](#6-stack-técnico)
7. [Decisiones operativas](#7-decisiones-operativas)
8. [Áreas pendientes de research](#8-áreas-pendientes-de-research)
9. [Apéndices](#9-apéndices)

---

## 1. Contexto y visión

### 1.1 De Axia a Talvu

El proyecto arrancó como landing para **Axia Odontología** (Barranquilla). Durante el grill se decidió pivotar a una plataforma SaaS multi-tenant llamada **Talvu**, donde:

- **Axia es el primer cliente** (caso de uso real para validar)
- **Una segunda clínica** (referida por la inversora) podría ser el segundo
- La visión a 12-18 meses es **horizontal**: dental → estética → veterinaria → spas → barberías → consultorios médicos privados

Talvu vende a estos negocios un stack modular: landing pública + chat widget + bot WhatsApp + portal de gestión + (opcionalmente) blog, store, SEO local, etc.

### 1.2 El demo a Axia

**Scope del demo (presentación a Axia, ~6+ semanas desde 2026-04-15):**

1. Selector de diseño con 12+ variantes preview cargadas con contenido de Axia
2. Chat widget en la variante seleccionada
3. Bot de WhatsApp funcional
4. Sincronización con Google Calendar

**Fuera del demo (post-Semana 6):**
- Portal admin, blog, store, SEO local, billing, eCommerce, multi-sede ejercitado, custom domains

### 1.3 Identidad visual

El landing actual tiene 4 templates × 3 paletas = 12 variantes hardcoded. Estas se refactorizan a un **page builder** modular: 6 secciones composables core (`hero, services, team, testimonials, cta-contact, features-cards`) + 2 opcionales (`stats, gallery`) + `header`/`footer` como layout-level. El portal del cliente puede componer su home eligiendo variants por sección.

---

## 2. Decisiones arquitectónicas centrales

### 2.1 Multi-tenant desde día 1

**Decisión:** schema multi-tenant completo en Convex desde la primera línea, no migración futura desde single-tenant.

**Razón:** la inversora reportó interés de una segunda clínica. Si validamos product-market fit con Axia, queremos onboardear cliente #2 sin refactor. El costo de multi-tenant ahora (~3 días extra) << costo de migrar producción después.

### 2.2 Page builder vs templates

**Decisión:** full page builder. Cada `tenantPage` se compone de N `pageSections` ordenadas. Cada sección tiene `type`, `variant`, `content` (i18n), y `order`.

**Razón:** los previews son la herramienta de venta principal. Si cada prospecto ve los "mismos 4 templates pero con sus colores", se siente plantilla. Composición por preset + contenido del prospecto = cada preview se siente personalizado.

**Trade-off:** mayor complejidad en Semana 2 (extracción de secciones + Storybook matrix). Aceptable porque se ejecuta una sola vez.

### 2.3 Solo home es composable

**Decisión:** páginas como `/servicios/{slug}`, `/sobre-nosotros`, `/contacto`, `/blog`, `/blog/{post}` son **templates fijos** que leen de DB. Solo `home` usa el page builder.

**Razón:** estas páginas tienen estructura predecible (servicio detalle = nombre + precio + descripción + especialista + FAQ + CTA). Composabilidad agregaría 0 valor al cliente y mucha superficie de edición. Si en V2 un cliente premium pide composición, se extiende sin refactor.

### 2.4 Variants token-agnostic con soft hints

**Decisión:** cada variant usa solo CSS vars abstractas (`--color-primary`, `--font-display`). Funciona con cualquier paleta. Cada variant en el registry declara `recommendedFamilies: string[]` para guiar al portal sobre combinaciones cohesivas, pero técnicamente cualquier mix es renderable.

**Razón:** rigidez por familia (option A) rompe la promesa "personalizado para cada uno". Token-agnostic puro (option B) produce 40% de combinaciones visuales rotas. Híbrido con hints (option C) da flexibilidad técnica + guía al editor.

**Implicación:** Storybook con matrix `variant × paleta` valida visualmente las ~300 combinaciones antes de exponerlas.

### 2.5 Tenants en lugar de clinics

**Decisión:** la tabla principal se llama `tenants`. Soporta múltiples industrias (dental, cosmetic, veterinary, spa, barber, physio, medical). UI labels son industry-adaptive: dental → "Clínica", barber → "Barbería", etc.

**Razón:** SaaS horizontal. Llamarlos `clinics` cierra la puerta a otras verticales prematuramente.

### 2.6 Multi-sede desde día 1

**Decisión:** tabla `tenantLocations` con `isPrimary: bool`. Cada tenant tiene 1+ ubicaciones. Most MVP tenants tendrán 1, pero el schema lo soporta.

**Razón:** tarde en el ciclo, agregar multi-sede requiere migrar `appointments`, `services`, `specialists`, schemas SEO, etc. Hacerlo desde día 1 es la diferencia entre "tabla extra" hoy vs. "migración masiva" en 6 meses.

### 2.7 Modular pricing

**Decisión:** stack se vende como **módulos individuales** + **bundles curados**. Cliente puede contratar `landing + bot + calendar` y dejar `blog + store` para después. Bundles (Essentials/Growth/Complete) son la ruta default para 90% del mercado.

**Razón:** flexibilidad de contratación + permite cobrar por valor entregado modularmente. Target: 75-80% margin annual por módulo. Requiere arquitectura limpia donde features son toggle-able, no monolíticas.

### 2.8 Dominios y subdominios

**Decisión final:**

```
talvu.com                         → marketing público + /admin para platform_admin
*.talvu.app                       → landing pública del tenant (axia.talvu.app)
portal.talvu.app                  → entry point unificado del portal
*.portal.talvu.app                → portal por tenant (axia.portal.talvu.app, themed)
admin.portal.talvu.app            → portal del platform_admin (vos)
pacientes.talvu.app               → login cross-clinic de pacientes (futuro)
*.pacientes.talvu.app             → portal del paciente por clínica (futuro)
tienda.talvu.app                  → catálogo SaaS de tiendas (futuro)
*.tienda.talvu.app                → store por clínica (axia.tienda.talvu.app)
bot.talvu.app                     → Cloudflare Workers (Hono webhook)
```

**Razón:** subdominio per-tenant para dar identidad visible (`axia.portal.talvu.app` se lee "el portal de Axia") sin nested wildcards complicados (DNS-mente es `*.portal.talvu.app` único). Custom domain como upgrade premium (`portal.dentalpro.com` CNAME a `axia.portal.talvu.app`).

**Cookie auth compartida** en `.talvu.app` para cross-subdomain SSO.

### 2.9 WorkOS para auth

**Decisión:** WorkOS AuthKit embedded. Organizations = tenants (1:1). Patients NO son members de Organizations (unaffiliated WorkOS users).

**Razón:**
- Organizations modelan multi-tenant nativamente
- Free 1M MAU (vs Clerk 10k)
- SAML/SSO ready para enterprise
- AuthKit embedded mantiene URL en `axia.portal.talvu.app/login` con branding per-org
- Patients fuera de Organizations evita confusión semantic ("paciente no trabaja en la clínica")

### 2.10 i18n locale-agnostic

**Decisión:** campos i18n usan `Record<string, string>` validado por Zod, no `v.object({ es, en })`. Locales soportados se controlan via constante `SUPPORTED_LOCALES`. Agregar `pt`/`fr` futuro = cambio en 1 constante, sin migration.

**Fallback chain configurable:** `LOCALE_FALLBACKS` por locale. ES → EN → cualquiera disponible.

**Per-tenant:** `tenants.enabledLocales: string[]` controla qué locales muestra ese tenant. Un tenant en Brasil habilita `["pt", "es"]`, uno en Colombia `["es", "en"]`.

---

## 3. Schema de datos completo

### 3.1 Tablas principales

```ts
// convex/schema.ts

import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // ─────────────────────────────────────────────────
  // TENANTS
  // ─────────────────────────────────────────────────
  
  tenants: defineTable({
    // Identidad
    name: v.string(),
    slug: v.string(),                           // único, validado vs reserved list
    legalName: v.optional(v.string()),
    tagline: v.optional(v.any()),               // i18n: Record<locale, string>
    description: v.optional(v.any()),           // i18n
    industry: v.string(),                       // "dental", "cosmetic", etc.
    
    // Branding
    logoUrl: v.optional(v.string()),            // UploadThing URL
    primaryColor: v.optional(v.string()),       // "#1a4d5c"
    headerVariant: v.optional(v.string()),      // "calido" | "clinico" | etc.
    footerVariant: v.optional(v.string()),
    
    // Contacto
    email: v.string(),
    phone: v.string(),
    
    // i18n del tenant
    enabledLocales: v.array(v.string()),        // ["es", "en"]
    defaultLocale: v.string(),                  // "es"
    
    // Regulatorio Colombia (opcional)
    country: v.string(),                        // "CO"
    nit: v.optional(v.string()),
    legalRepresentative: v.optional(v.object({
      name: v.string(),
      documentType: v.string(),                 // "CC", "CE", "PP"
      documentNumber: v.string(),
    })),
    taxRegime: v.optional(v.union(
      v.literal("simplificado"),
      v.literal("comun"),
      v.literal("no_responsable_iva"),
      v.literal("gran_contribuyente"),
      v.literal("other"),
    )),
    economicActivityCode: v.optional(v.string()),  // CIIU
    healthRegistries: v.optional(v.array(v.object({
      type: v.string(),
      number: v.string(),
      validFrom: v.optional(v.string()),
      validUntil: v.optional(v.string()),
    }))),
    taxInfo: v.optional(v.any()),               // futuro países no-CO
    
    // SaaS
    status: v.union(
      v.literal("prospect"),
      v.literal("trial"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("churned"),
    ),
    trialEndsAt: v.optional(v.number()),
    onboardingStep: v.optional(v.number()),     // 0-3, null=completed
    onboardingCompletedAt: v.optional(v.number()),
    
    // WorkOS
    workosOrgId: v.optional(v.string()),
    
    // Domain
    customDomain: v.optional(v.string()),
    customDomainStatus: v.optional(v.union(
      v.literal("pending"),
      v.literal("active"),
      v.literal("failed"),
    )),
    
    // Preview
    previewToken: v.optional(v.string()),       // null = revoked
    previewData: v.optional(v.any()),
    previewRevokedAt: v.optional(v.number()),
    previewRevokedReason: v.optional(v.string()),
    
    // Wompi (eCommerce per-tenant)
    wompiPublicKey: v.optional(v.string()),
    wompiPrivateKeyEncrypted: v.optional(v.string()),
    wompiEventSecret: v.optional(v.string()),
    
    // Flags
    hasRealLogo: v.boolean(),
    hasRealPhotos: v.boolean(),
    reviewRequestsEnabled: v.boolean(),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_custom_domain", ["customDomain"])
    .index("by_workos_org", ["workosOrgId"])
    .index("by_status", ["status"])
    .index("by_industry_status", ["industry", "status"]),
  
  // ─────────────────────────────────────────────────
  // TENANT LOCATIONS
  // ─────────────────────────────────────────────────
  
  tenantLocations: defineTable({
    tenantId: v.id("tenants"),
    name: v.any(),                              // i18n: "Sede Chapinero"
    slug: v.string(),                           // "chapinero"
    isPrimary: v.boolean(),
    
    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
      postalCode: v.optional(v.string()),
    }),
    geo: v.optional(v.object({
      lat: v.number(),
      lng: v.number(),
    })),
    
    phone: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    
    openingHours: v.array(v.object({
      dayOfWeek: v.union(
        v.literal("Monday"), v.literal("Tuesday"), v.literal("Wednesday"),
        v.literal("Thursday"), v.literal("Friday"), v.literal("Saturday"),
        v.literal("Sunday"),
      ),
      opens: v.string(),
      closes: v.string(),
      closedForLunch: v.optional(v.object({
        from: v.string(),
        to: v.string(),
      })),
    })),
    timezone: v.string(),                        // "America/Bogota"
    
    // SEO local por sede
    googlePlaceId: v.optional(v.string()),
    googleRating: v.optional(v.number()),
    googleReviewCount: v.optional(v.number()),
    instagramHandle: v.optional(v.string()),
    facebookPageUrl: v.optional(v.string()),
    
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_active", ["tenantId", "active"])
    .index("by_tenant_primary", ["tenantId", "isPrimary"]),
  
  // ─────────────────────────────────────────────────
  // USERS (mirror de WorkOS)
  // ─────────────────────────────────────────────────
  
  users: defineTable({
    workosUserId: v.string(),
    workosOrgId: v.optional(v.string()),        // null para patients
    email: v.string(),
    phone: v.optional(v.string()),
    name: v.string(),
    role: v.union(
      v.literal("platform_admin"),
      v.literal("clinic_owner"),
      v.literal("specialist"),
      v.literal("receptionist"),
      v.literal("patient"),
    ),
    tenantId: v.optional(v.id("tenants")),      // null para platform_admin y patients
    specialistId: v.optional(v.id("specialists")),
    patientRecordId: v.optional(v.id("patients")),
    avatarUrl: v.optional(v.string()),
    locale: v.optional(v.string()),
    createdAt: v.number(),
    lastLoginAt: v.optional(v.number()),
  })
    .index("by_workos_user_id", ["workosUserId"])
    .index("by_email", ["email"])
    .index("by_phone", ["phone"])
    .index("by_tenant", ["tenantId"]),
  
  // ─────────────────────────────────────────────────
  // SPECIALISTS / SERVICES / PATIENTS / APPOINTMENTS
  // ─────────────────────────────────────────────────
  
  specialists: defineTable({
    tenantId: v.id("tenants"),
    locationIds: v.array(v.id("tenantLocations")),
    userId: v.optional(v.id("users")),          // null hasta que el specialist crea cuenta
    name: v.string(),
    specialty: v.any(),                         // i18n
    bio: v.optional(v.any()),                   // i18n
    photoUrl: v.optional(v.string()),
    calendarId: v.string(),                     // Google Calendar ID
    locationSchedules: v.optional(v.array(v.object({
      locationId: v.id("tenantLocations"),
      weeklyHours: v.array(v.object({
        dayOfWeek: v.union(/* ... */),
        startTime: v.string(),
        endTime: v.string(),
      })),
    }))),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_user", ["userId"]),
  
  services: defineTable({
    tenantId: v.id("tenants"),
    locationIds: v.optional(v.array(v.id("tenantLocations"))),  // null = todas las sedes
    slug: v.string(),
    name: v.any(),                              // i18n
    shortDescription: v.any(),                  // i18n
    longDescription: v.optional(v.any()),       // i18n rich text
    category: v.optional(v.any()),              // i18n
    priceCOP: v.number(),
    priceUSD: v.optional(v.number()),
    duration: v.number(),                       // minutos
    specialistIds: v.array(v.id("specialists")),
    faq: v.optional(v.array(v.object({
      question: v.any(),                        // i18n
      answer: v.any(),                          // i18n
    }))),
    seoTitle: v.optional(v.any()),              // i18n
    seoDescription: v.optional(v.any()),        // i18n
    heroImageUrl: v.optional(v.string()),
    beforeAfterImageUrls: v.optional(v.array(v.string())),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_slug", ["tenantId", "slug"]),
  
  patients: defineTable({
    name: v.string(),
    phone: v.string(),                          // E.164 format
    email: v.optional(v.string()),
    cedula: v.optional(v.string()),
    userId: v.optional(v.id("users")),          // null hasta signup
    createdAt: v.number(),
  })
    .index("by_phone", ["phone"])
    .index("by_user", ["userId"]),
  
  patientTenantRelations: defineTable({
    patientId: v.id("patients"),
    tenantId: v.id("tenants"),
    firstVisitAt: v.number(),
    lastVisitAt: v.optional(v.number()),
    status: v.union(v.literal("active"), v.literal("inactive")),
    notes: v.optional(v.string()),
  })
    .index("by_patient", ["patientId"])
    .index("by_tenant", ["tenantId"])
    .index("by_patient_tenant", ["patientId", "tenantId"]),
  
  appointments: defineTable({
    tenantId: v.id("tenants"),
    locationId: v.id("tenantLocations"),        // required
    patientId: v.id("patients"),
    serviceId: v.id("services"),
    specialistId: v.id("specialists"),
    datetime: v.number(),                       // UTC timestamp
    durationMin: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("rescheduled"),
      v.literal("completed"),
      v.literal("no_show"),
    ),
    calendarEventId: v.optional(v.string()),
    completedBy: v.optional(v.union(v.literal("auto"), v.literal("staff"))),
    completedAt: v.optional(v.number()),
    completedByUserId: v.optional(v.id("users")),
    cancellationReason: v.optional(v.string()),
    cancelledByUserId: v.optional(v.id("users")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_patient", ["patientId"])
    .index("by_specialist", ["specialistId"])
    .index("by_status", ["status"])
    .index("by_tenant_datetime", ["tenantId", "datetime"]),
  
  // ─────────────────────────────────────────────────
  // CONVERSATIONS / MESSAGES
  // ─────────────────────────────────────────────────
  
  conversations: defineTable({
    tenantId: v.id("tenants"),
    channel: v.union(v.literal("whatsapp"), v.literal("web")),
    channelId: v.string(),                      // phone para whatsapp, sessionId para web
    phone: v.optional(v.string()),              // unified identifier
    patientId: v.optional(v.id("patients")),
    language: v.optional(v.string()),
    historySummary: v.optional(v.string()),
    lastSummarizedAt: v.optional(v.number()),
    flaggedForHuman: v.boolean(),
    flaggedReason: v.optional(v.string()),
    flaggedUrgency: v.optional(v.union(v.literal("normal"), v.literal("urgent"))),
    flaggedAt: v.optional(v.number()),
    resolvedByUserId: v.optional(v.id("users")),
    resolvedAt: v.optional(v.number()),
    previousChannels: v.optional(v.array(v.object({
      channel: v.string(),
      channelId: v.string(),
      mergedAt: v.number(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_channelId", ["channel", "channelId"])
    .index("by_phone", ["phone"])
    .index("by_tenant_flagged", ["tenantId", "flaggedForHuman"]),
  
  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(v.literal("user"), v.literal("assistant"), v.literal("system")),
    content: v.string(),
    toolCalls: v.optional(v.array(v.any())),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),
  
  // ─────────────────────────────────────────────────
  // PAGES + SECTIONS (page builder)
  // ─────────────────────────────────────────────────
  
  tenantPages: defineTable({
    tenantId: v.id("tenants"),
    slug: v.literal("home"),                    // por ahora solo "home"
    seoTitle: v.optional(v.any()),              // i18n
    seoDescription: v.optional(v.any()),        // i18n
    seoOgImageUrl: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_tenant", ["tenantId"]),
  
  pageSections: defineTable({
    pageId: v.id("tenantPages"),
    type: v.string(),                           // "hero", "services", etc.
    variant: v.string(),                        // "hero-calido-video"
    order: v.number(),
    content: v.any(),                           // validated by Zod runtime
    hiddenOnLocales: v.optional(v.array(v.string())),
    visible: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_page_order", ["pageId", "order"])
    .index("by_page_visible", ["pageId", "visible"]),
  
  // ─────────────────────────────────────────────────
  // PRESETS + PREVIEWS
  // ─────────────────────────────────────────────────
  
  previewPresets: defineTable({
    slug: v.string(),                           // "calido-rosa"
    name: v.any(),                              // i18n
    description: v.any(),                       // i18n
    industry: v.string(),                       // "dental"
    familia: v.string(),                        // "calido", "elegante", etc.
    tokens: v.any(),                            // embedded token set
    sectionComposition: v.array(v.object({
      type: v.string(),
      variant: v.string(),
      order: v.number(),
      contentKey: v.optional(v.string()),       // FK a seedContent
    })),
    headerVariant: v.string(),
    footerVariant: v.string(),
    thumbnailUrl: v.optional(v.string()),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_industry", ["industry"])
    .index("by_industry_active", ["industry", "active"]),
  
  tenantPreviews: defineTable({
    tenantId: v.id("tenants"),
    presetSlug: v.string(),
    status: v.union(
      v.literal("generated"),
      v.literal("selected"),
      v.literal("dismissed"),
    ),
    customTokens: v.optional(v.any()),          // si se generó con primaryColor del prospecto
    selectedAt: v.optional(v.number()),
    dismissedAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_status", ["tenantId", "status"]),
  
  // ─────────────────────────────────────────────────
  // SEED CONTENT
  // ─────────────────────────────────────────────────
  
  seedContent: defineTable({
    industry: v.string(),                       // "dental"
    sectionType: v.string(),                    // "hero"
    contentKey: v.string(),                     // "hero-promesa-natural"
    content: v.any(),                           // i18n object con shape de la section
    description: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_industry_section", ["industry", "sectionType"])
    .index("by_industry_section_key", ["industry", "sectionType", "contentKey"]),
  
  seedImages: defineTable({
    url: v.string(),
    utfsKey: v.string(),
    category: v.union(
      v.literal("hero"),
      v.literal("clinic"),
      v.literal("equipment"),
      v.literal("smile"),
      v.literal("team"),
      v.literal("lifestyle"),
      v.literal("procedure"),
    ),
    industry: v.string(),
    tags: v.array(v.string()),
    orientation: v.union(
      v.literal("landscape"),
      v.literal("portrait"),
      v.literal("square"),
    ),
    width: v.number(),
    height: v.number(),
    sourceUrl: v.optional(v.string()),
    sourceAuthor: v.optional(v.string()),
    sourceLicense: v.string(),
    priority: v.number(),
    tone: v.optional(v.union(
      v.literal("warm"),
      v.literal("cool"),
      v.literal("neutral"),
      v.literal("dark"),
      v.literal("bright"),
    )),
    createdAt: v.number(),
  })
    .index("by_industry_category", ["industry", "category"])
    .index("by_industry_category_tone", ["industry", "category", "tone"]),
  
  // ─────────────────────────────────────────────────
  // DESIGN TOKENS (per-tenant editable)
  // ─────────────────────────────────────────────────
  
  designTokens: defineTable({
    tenantId: v.id("tenants"),
    name: v.string(),
    tokens: v.any(),                            // shape de TokenSchema
    isActive: v.boolean(),
    basedOnPresetSlug: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_active", ["tenantId", "isActive"]),
  
  // ─────────────────────────────────────────────────
  // TENANT IMAGES (uploaded by clinic)
  // ─────────────────────────────────────────────────
  
  tenantImages: defineTable({
    tenantId: v.id("tenants"),
    url: v.string(),
    utfsKey: v.string(),
    category: v.string(),
    order: v.number(),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    uploadedAt: v.number(),
    uploadedByUserId: v.optional(v.id("users")),
  })
    .index("by_tenant_category", ["tenantId", "category"]),
  
  // ─────────────────────────────────────────────────
  // BLOG (post-demo)
  // ─────────────────────────────────────────────────
  
  blogPosts: defineTable({
    tenantId: v.id("tenants"),
    slug: v.string(),
    authorId: v.id("users"),
    title: v.any(),                             // i18n
    excerpt: v.any(),                           // i18n
    content: v.any(),                           // i18n: Record<locale, TipTapJSON>
    coverImageUrl: v.optional(v.string()),
    coverImageAlt: v.optional(v.any()),         // i18n
    category: v.string(),
    tags: v.array(v.string()),
    status: v.union(
      v.literal("draft"),
      v.literal("published"),
      v.literal("archived"),
    ),
    publishedAt: v.optional(v.number()),
    archivedAt: v.optional(v.number()),
    seoTitle: v.optional(v.any()),
    seoDescription: v.optional(v.any()),
    focusKeyword: v.optional(v.any()),
    readingTimeMin: v.number(),
    viewCount: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant_status", ["tenantId", "status"])
    .index("by_tenant_slug", ["tenantId", "slug"])
    .index("by_tenant_category", ["tenantId", "category"]),
  
  blogCategories: defineTable({
    tenantId: v.id("tenants"),
    slug: v.string(),
    name: v.any(),                              // i18n
    description: v.optional(v.any()),           // i18n
    order: v.number(),
  }).index("by_tenant_slug", ["tenantId", "slug"]),
  
  // ─────────────────────────────────────────────────
  // PRODUCTS + ORDERS (eCommerce, post-demo)
  // ─────────────────────────────────────────────────
  
  products: defineTable({
    tenantId: v.id("tenants"),
    locationIds: v.optional(v.array(v.id("tenantLocations"))),
    slug: v.string(),
    name: v.any(),                              // i18n
    description: v.any(),                       // i18n
    priceCOP: v.number(),
    priceUSD: v.optional(v.number()),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    isDigital: v.boolean(),
    imageUrls: v.array(v.string()),
    stockByLocation: v.optional(v.array(v.object({
      locationId: v.id("tenantLocations"),
      quantity: v.number(),
    }))),
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_slug", ["tenantId", "slug"])
    .index("by_tenant_active", ["tenantId", "active"]),
  
  orders: defineTable({
    tenantId: v.id("tenants"),
    locationId: v.optional(v.id("tenantLocations")),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
    shippingAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
      postalCode: v.optional(v.string()),
    })),
    items: v.array(v.object({
      productId: v.id("products"),
      quantity: v.number(),
      unitPriceCOP: v.number(),
    })),
    subtotalCOP: v.number(),
    taxCOP: v.number(),
    totalCOP: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("paid"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled"),
      v.literal("refunded"),
    ),
    paymentReference: v.optional(v.string()),    // wompi reference
    paidAt: v.optional(v.number()),
    shippedAt: v.optional(v.number()),
    deliveredAt: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_tenant_status", ["tenantId", "status"])
    .index("by_payment_reference", ["paymentReference"]),
  
  // ─────────────────────────────────────────────────
  // SUBSCRIPTIONS + MODULE USAGE (modular billing)
  // ─────────────────────────────────────────────────
  
  subscriptions: defineTable({
    tenantId: v.id("tenants"),
    status: v.union(
      v.literal("trial"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("paused"),
    ),
    activeModules: v.array(v.string()),         // ["landing", "portal", ...]
    bundleKey: v.optional(v.string()),
    addons: v.array(v.object({
      key: v.string(),
      quantity: v.number(),
      addedAt: v.number(),
    })),
    billingCycle: v.union(v.literal("monthly"), v.literal("annual")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEndsAt: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
    autoOverage: v.boolean(),                   // si activado, compra packs auto
    totalPriceCOP: v.number(),
    wompiSubscriptionId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_status", ["status"]),
  
  moduleUsage: defineTable({
    tenantId: v.id("tenants"),
    moduleKey: v.string(),
    metric: v.string(),                         // "bot_conversations", "storage_gb"
    period: v.string(),                         // "2026-04"
    count: v.number(),
    capacity: v.number(),
    overageQuantity: v.number(),
  })
    .index("by_tenant_period", ["tenantId", "period"])
    .index("by_tenant_module_period", ["tenantId", "moduleKey", "period"]),
  
  // ─────────────────────────────────────────────────
  // INVITATIONS / REVIEWS / GBP / OTROS
  // ─────────────────────────────────────────────────
  
  invitations: defineTable({
    workosInviteId: v.string(),
    tenantId: v.id("tenants"),
    email: v.string(),
    role: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("expired"),
      v.literal("revoked"),
    ),
    expiresAt: v.number(),
    invitedByUserId: v.id("users"),
    createdAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_workos_id", ["workosInviteId"]),
  
  reviewRequests: defineTable({
    patientId: v.id("patients"),
    appointmentId: v.id("appointments"),
    tenantId: v.id("tenants"),
    sentAt: v.number(),
    channel: v.union(v.literal("whatsapp"), v.literal("email")),
    clicked: v.optional(v.boolean()),
  })
    .index("by_patient", ["patientId"])
    .index("by_patient_sent", ["patientId", "sentAt"])
    .index("by_tenant", ["tenantId"]),
  
  gbpChecklist: defineTable({
    tenantLocationId: v.id("tenantLocations"),
    items: v.array(v.object({
      key: v.string(),
      status: v.union(v.literal("ok"), v.literal("warning"), v.literal("error")),
      lastCheckedAt: v.number(),
      note: v.optional(v.string()),
    })),
  }).index("by_location", ["tenantLocationId"]),
})
```

### 3.2 Reserved subdomains

```ts
// packages/shared/src/constants/reserved-subdomains.ts
export const RESERVED_SUBDOMAINS = new Set([
  "www", "api", "portal", "tienda", "store", "bot", "admin", "app", "mail",
  "staging", "preview", "demo", "dev", "test", "cdn", "static", "assets",
  "media", "images", "blog", "docs", "help", "support", "login", "signup",
  "billing", "account", "dashboard", "auth", "oauth",
  "pacientes", "patients", "sedes", "locations",
])
```

### 3.3 Locales soportados

```ts
// packages/shared/src/constants/locales.ts
export const SUPPORTED_LOCALES = ["es", "en"] as const
export type Locale = typeof SUPPORTED_LOCALES[number]
export const DEFAULT_LOCALE: Locale = "es"

export const LOCALE_FALLBACKS: Record<Locale, Locale[]> = {
  es: ["en"],
  en: ["es"],
}

export const LOCALE_LABELS: Record<Locale, { native: string; english: string }> = {
  es: { native: "Español", english: "Spanish" },
  en: { native: "English", english: "English" },
}
```

### 3.4 Industry labels

```ts
// packages/shared/src/i18n/tenant-labels.ts
export const TENANT_LABEL = {
  dental:      { es: "Clínica",     en: "Clinic"     },
  cosmetic:    { es: "Centro",      en: "Studio"     },
  veterinary:  { es: "Clínica",     en: "Clinic"     },
  spa:         { es: "Spa",         en: "Spa"        },
  barber:      { es: "Barbería",    en: "Barbershop" },
  physio:      { es: "Centro",      en: "Center"     },
  medical:     { es: "Consultorio", en: "Practice"   },
  default:     { es: "Negocio",     en: "Business"   },
}
```

---

## 4. Modularidad y pricing

### 4.1 Catálogo de módulos

```ts
// packages/shared/src/constants/modules.ts

/**
 * 🚧 PRICING_DRAFT — Precios provisionales basados en heurísticas + cost analysis aprox.
 * Antes de exponer al público:
 *   1. 5-10 customer interviews con clínicas dentales en Colombia
 *   2. Van Westendorp willingness-to-pay survey
 *   3. Análisis competidor 2026 (Doctoralia, Doc.cc, etc.)
 *   4. Cost data real del primer mes de Axia en producción
 * Ver docs/pricing-research.md para método.
 */

export const MODULES = {
  landing: {
    key: "landing",
    name: { es: "Landing", en: "Landing" },
    category: "base",
    required: true,
    priceCOP: 40_000,
    priceUSD: 10,
    dependsOn: [],
  },
  "bot-whatsapp": {
    key: "bot-whatsapp",
    name: { es: "Bot WhatsApp", en: "WhatsApp Bot" },
    category: "communication",
    priceCOP: 130_000,
    priceUSD: 32,
    dependsOn: ["landing"],
    includes: { conversationsPerMonth: 200 },
    overagePackKey: "conversation-pack-100",
  },
  "web-chat": {
    key: "web-chat",
    name: { es: "Chat Widget Web", en: "Web Chat Widget" },
    category: "communication",
    priceCOP: 25_000,
    priceUSD: 6,
    dependsOn: ["landing"],
    requiresAny: ["bot-whatsapp"],
  },
  "calendar-sync": {
    key: "calendar-sync",
    name: { es: "Sync Calendar", en: "Calendar Sync" },
    category: "communication",
    priceCOP: 15_000,
    priceUSD: 4,
    dependsOn: ["bot-whatsapp"],
  },
  portal: {
    key: "portal",
    name: { es: "Portal Admin", en: "Admin Portal" },
    category: "admin",
    priceCOP: 70_000,
    priceUSD: 17,
    dependsOn: ["landing"],
  },
  blog: {
    key: "blog",
    name: { es: "Blog", en: "Blog" },
    category: "content",
    priceCOP: 80_000,
    priceUSD: 20,
    dependsOn: ["portal"],
  },
  "ai-translation": {
    key: "ai-translation",
    name: { es: "Traducción AI", en: "AI Translation" },
    category: "content",
    priceCOP: 25_000,
    priceUSD: 6,
    dependsOn: ["portal"],
  },
  "seo-local": {
    key: "seo-local",
    name: { es: "SEO Local", en: "Local SEO" },
    category: "content",
    priceCOP: 25_000,
    priceUSD: 6,
    dependsOn: ["portal"],
  },
  "reviews-automation": {
    key: "reviews-automation",
    name: { es: "Reseñas Auto", en: "Reviews Auto" },
    category: "content",
    priceCOP: 25_000,
    priceUSD: 6,
    dependsOn: ["bot-whatsapp"],
  },
  store: {
    key: "store",
    name: { es: "Tienda", en: "Store" },
    category: "commerce",
    priceCOP: 75_000,
    priceUSD: 19,
    dependsOn: ["portal"],
  },
} as const

export const ADDONS = {
  "custom-domain": {
    key: "custom-domain",
    name: { es: "Dominio propio", en: "Custom domain" },
    perUnit: true,
    priceCOP: 50_000,
    priceUSD: 12,
  },
  "additional-location": {
    key: "additional-location",
    name: { es: "Sede adicional", en: "Additional location" },
    perUnit: true,
    priceCOP: 40_000,
    priceUSD: 10,
  },
  "conversation-pack-100": {
    key: "conversation-pack-100",
    name: { es: "100 conversaciones extra", en: "100 extra conversations" },
    perUnit: true,
    priceCOP: 50_000,
    priceUSD: 12,
  },
  "storage-pack-10gb": {
    key: "storage-pack-10gb",
    name: { es: "10 GB extra", en: "10 GB extra" },
    perUnit: true,
    priceCOP: 20_000,
    priceUSD: 5,
  },
} as const

export const BUNDLES = {
  essentials: {
    key: "essentials",
    name: { es: "Essentials", en: "Essentials" },
    modules: ["landing", "portal", "bot-whatsapp", "calendar-sync", "web-chat"],
    priceCOP: 230_000,
    priceUSD: 57,
    annualPriceCOP: 2_300_000,
    annualPriceUSD: 575,
  },
  growth: {
    key: "growth",
    name: { es: "Growth", en: "Growth" },
    modules: [
      "landing", "portal", "bot-whatsapp", "calendar-sync", "web-chat",
      "blog", "ai-translation", "seo-local", "reviews-automation",
    ],
    priceCOP: 360_000,
    priceUSD: 90,
    annualPriceCOP: 3_600_000,
    annualPriceUSD: 900,
  },
  complete: {
    key: "complete",
    name: { es: "Complete", en: "Complete" },
    modules: [
      "landing", "portal", "bot-whatsapp", "calendar-sync", "web-chat",
      "blog", "ai-translation", "seo-local", "reviews-automation", "store",
    ],
    includedAddons: [
      { key: "custom-domain", quantity: 1 },
      { key: "additional-location", quantity: 2 },
    ],
    priceCOP: 530_000,
    priceUSD: 132,
    annualPriceCOP: 5_300_000,
    annualPriceUSD: 1_320,
  },
} as const
```

### 4.2 Margin analysis (annual pricing)

| Módulo | Cost USD/mo | Annual ef. USD | Margen |
|---|---|---|---|
| landing | $1.50 | $8.30 | 82% |
| bot-whatsapp | $5.30 | $26.70 | 80% |
| web-chat | $1.00 | $5.00 | 80% |
| calendar-sync | $0.50 | $3.30 | 85% |
| portal | $3.00 | $14.20 | 79% |
| blog | $3.50 | $16.70 | 79% |
| ai-translation | $1.00 | $5.00 | 80% |
| seo-local | $1.00 | $5.00 | 80% |
| reviews-automation | $1.00 | $5.00 | 80% |
| store | $3.00 | $15.80 | 81% |
| custom-domain | $2.00 | $10.00 | 80% |
| additional-location | $0 | $8.30 | 100% |
| conversation-pack-100 | $2.15 | $10.00 | 79% |

**Bundles:**
- Essentials: 77% margen anual
- Growth: 76% margen anual
- Complete: 79% margen anual

### 4.3 Feature gating helper

```ts
// packages/shared/src/lib/modules.ts
export function hasModule(
  subscription: Subscription,
  moduleKey: string,
): boolean {
  return subscription.activeModules.includes(moduleKey)
}

// En mutations
export const createBlogPost = mutation({
  args: {...},
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx)
    const sub = await getActiveSubscription(ctx, user.tenantId!)
    
    if (!hasModule(sub, "blog")) {
      throw new ConvexError({
        code: "MODULE_NOT_SUBSCRIBED",
        message: "El módulo Blog no está activo en tu suscripción.",
        moduleKey: "blog",
        addModuleUrl: "/settings/billing/modules/blog",
      })
    }
    // ...
  }
})
```

### 4.4 Trial strategy

- Signup via "Me gusta esta preview" → tenant.status = "trial", plan = Essentials, trialEndsAt = +30 días
- 7 días antes: email "Tu trial termina en 7 días"
- 3 días antes: email + banner persistente en portal
- Día 30: si no upgrade → degrade a "Landing solo + Talvu branding visible". Tenant queda accesible pero limitado.

---

## 5. Plan de ejecución por fases

### Fase 0 — Rebrand a Talvu (2-3 horas)

**Single most important pre-requisite. Hacer ANTES de cualquier otro cambio.**

```
□ Crear scripts/talvu-cli/ con comando rename-namespace
□ Ejecutar pnpm talvu rename @axia @talvu
□ Update root package.json: "name": "talvu"
□ Verify build: pnpm turbo build
□ Verify dev: pnpm turbo dev
□ Commit: "rebrand: @axia/* → @talvu/*"
□ Push + verify Vercel auto-deploy succeeds
□ (Opcional) crear Vercel Team "Talvu" + migrar project actual: rename axia-landing → landing
```

### Fase 1 — Cimientos multi-tenant (~5-7 días)

**Objetivo:** monorepo con Convex multi-tenant + dominios reales + seed Axia funcional como tenant.

```
Día 1-2: Dominios + Vercel
  □ Comprar talvu.com + talvu.app (registrar: Cloudflare/Namecheap/Porkbun)
  □ DNS: configurar wildcards en registrar + delegar a Vercel
       talvu.com           → Vercel (futuro marketing)
       talvu.app           → Vercel landing (redirect a talvu.com)
       *.talvu.app         → Vercel landing
       portal.talvu.app    → Vercel portal (futuro)
       *.portal.talvu.app  → Vercel portal
       tienda.talvu.app    → Vercel store (futuro)
       *.tienda.talvu.app  → Vercel store
       bot.talvu.app       → Cloudflare Workers
  □ Vercel: agregar talvu.app y *.talvu.app al project landing
  □ Verify: axia.talvu.app responde con landing actual

Día 3-4: Schema multi-tenant
  □ Refactor convex/schema.ts a multi-tenant completo (sección 3.1)
  □ Crear convex/seed/runBase.ts: previewPresets dental + seedContent ES/EN
  □ Crear convex/seed/registerImage.ts (pre-condition para upload de imágenes)
  □ Update convex/bot/* para incluir tenantId en queries
  □ Update existing convex/seed.ts: crear tenant Axia con location primary

Día 5: UploadThing + seed images
  □ Crear cuenta UploadThing, obtener API key
  □ npx convex env set UPLOADTHING_SECRET ...
  □ Curar 50-60 imágenes dental en scripts/seed-images/dental/
  □ pnpm talvu seed:images → upload + register
  □ Verify imágenes accesibles en Convex

Día 6-7: WorkOS + env vars
  □ Crear proyecto WorkOS, obtener API key + AuthKit config
  □ Setup auth.talvu.app como custom auth domain
  □ npx convex env set WORKOS_DOMAIN/WORKOS_CLIENT_ID/WORKOS_API_KEY
  □ Generar ENCRYPTION_MASTER_KEY: openssl rand -base64 32
  □ Update convex/auth.config.ts con WorkOS provider
  □ Smoke test: token JWT valida en query autenticada
```

### Fase 2 — Page builder + sections (~10-12 días)

**Objetivo:** las 12 variantes de Axia se renderean dinámicamente desde DB. Preview grid funcional.

```
Día 1-2: Extracción de hero + services + team
  □ Crear packages/ui/src/sections/{hero,services,team}/
  □ Por familia (calido/clinico/elegante/lujoso), extraer variant del template original
  □ Reemplazar TODOS los colores hardcoded por var(--color-*)
  □ Reemplazar tipografías por var(--font-*), radios por var(--radius-*)
  □ Crear schemas Zod por tipo de sección
  □ Total: 8 hero variants + 4 services + 4 team = 16 components

Día 3: Extracción de testimonials + cta-contact + features-cards
  □ Otras 4+4+1 = 9 components
  
Día 4: Layout (header/footer) + opcionales
  □ 4 header variants, 4 footer variants, 1 stats variant
  □ TenantLayout component que envuelve outlet + selecciona header/footer por tenant.headerVariant

Día 5: Storybook setup + matrix testing
  □ pnpm add -D storybook @storybook/react @storybook/addon-essentials
  □ Setup .storybook/ en packages/ui/
  □ Generación programática de stories: variant × paleta = ~300 stories
  □ Manual review de combinations rotas, ajustes
  □ Deploy storybook a storybook.talvu.app (Vercel project aparte, opcional)

Día 6: TokenProvider + SectionRenderer
  □ packages/ui/src/components/TokenProvider.tsx — inyecta CSS vars
  □ packages/ui/src/components/SectionRenderer.tsx — picks component by variant + valida con Zod
  □ packages/ui/src/components/SectionError.tsx — fallback amigable

Día 7-8: previewPresets seed + tenantPreviews
  □ convex/seed/dental-presets.ts: 12 presets (4 familias × 3 paletas)
  □ Cada preset con sectionComposition + tokens embedded
  □ Preset #13 cross-family validator: hero-elegante + services-clinico + team-calido
  □ Mutation generatePreviews: crea 12 tenantPreviews para tenant
  □ Run para Axia: pnpm talvu tenant:create scripts/prospects/axia.json

Día 9: i18n routing
  □ apps/landing/src/middleware/tenant-locale.ts
  □ Routes: $locale/index.tsx, $locale/preview/index.tsx, $locale/preview/$presetSlug.tsx
  □ Detection de browser locale + redirect
  □ Switcher ES|EN en header
  □ hreflang alternates en <head>

Día 10: Preview grid + preview individual
  □ /es/preview: render grid de 12 cards thumbnails
  □ /es/preview/{presetSlug}: render full page con SectionRenderer
  □ Token validation en middleware si tenant.status === "prospect"
  □ DemoBadge component visible solo en /preview/

Día 11: Content resolver
  □ convex/content/resolver.ts: resolveContent por section type
  □ Joins runtime: services section → fetch services del tenant
  □ Fallback chain: tenant content > seed content
  □ Image picker: tenant photo > seedImage por categoría + tone

Día 12: SEO básico + smoke test
  □ Meta tags dinámicos por página (title/description/canonical)
  □ robots.txt con Disallow: /preview/
  □ Lighthouse score: target >85 en performance
  □ Verify 12 previews de Axia se ven coherentes
  □ Verify "cliente ficticio" (Dental Pro) genera 12 previews distintos
```

### Fase 3 — Bot + Calendar + Chat widget (~5-6 días)

```
Día 1-2: Vercel AI SDK + Gemini wired
  □ pnpm add ai @ai-sdk/google
  □ npx convex env set GEMINI_API_KEY ...
  □ convex/bot/process.ts: implementar generateText con Gemini 2.5 Flash
  □ convex/bot/tools.ts: 7 tools (lookup_patient, list_services, check_availability,
                                  book_appointment, cancel, reschedule, get_appointments)
  □ Cada tool implementada como Convex internal mutation/query
  □ System prompt dinámico: hidrata template con datos del tenant
  □ Test desde Convex dashboard

Día 3: Google Calendar real
  □ Crear proyecto Google Cloud, habilitar Calendar API
  □ Crear Service Account, descargar JSON key
  □ Encode key as base64, set as GOOGLE_SERVICE_ACCOUNT_KEY_B64
  □ convex/calendar/index.ts: checkAvailability, createEvent, deleteEvent
  □ Crear 3 calendarios prueba en Google Workspace propio
  □ Compartir cada uno con email del Service Account
  □ Update specialists.calendarId con IDs reales
  □ Test: book_appointment crea evento real

Día 4: Twilio + Hono webhook
  □ Crear cuenta Twilio trial
  □ Activar WhatsApp Sandbox
  □ npx convex env set TWILIO_ACCOUNT_SID/AUTH_TOKEN/WHATSAPP_NUMBER
  □ apps/bot/src/routes/webhook.ts: validate signature, llamar handleIncoming
  □ apps/bot/src/middleware/twilio-signature.ts
  □ Deploy: pnpm --filter @talvu/bot run deploy
  □ Configure Twilio webhook URL: bot.talvu.app/webhook/twilio
  □ Test: enviar "Hola" desde WhatsApp → bot responde

Día 5: Chat widget en packages/ui
  □ packages/ui/src/components/chat-widget/
       ChatBubble, ChatPanel, MessageList, MessageInput, TypingIndicator
       usePhoneCollection con libphonenumber-js
       ContinueOnWhatsApp button
  □ Lazy load via React.lazy
  □ Integrar en TenantLayout cuando subscription incluye web-chat module

Día 6: Smoke test integral
  □ Web chat: "Hola, quiero limpieza" → bot responde con slots
  □ Agendar → cita aparece en Google Calendar
  □ Continue on WhatsApp button → pre-filled message → handover funciona
  □ WhatsApp directo: "Hola" → respuesta + flow agendamiento
  □ Cancelar cita → bot confirma + Calendar event deleted
  □ Edge cases: fuera de horario, servicio inexistente, paciente sin nombre
```

### Fase 4 — Demo a Axia (~3-4 días)

```
Día 1: Bug fixes from Fase 3
  □ Cualquier issue surgido en smoke test
  □ Tuning del system prompt según comportamiento real

Día 2: Cliente ficticio + visual polish
  □ Crear scripts/prospects/dental-pro.json: clínica diferente a Axia
  □ pnpm talvu tenant:create dental-pro.json
  □ Visit dental-pro.talvu.app/es/preview
  □ Verify 12 variantes se ven distintas a las de Axia
  □ Si presets se ven idénticos: tweak content + image variation

Día 3: Presentation prep
  □ Update slides ejecutivos (apuntan a nueva URL preview)
  □ Slide nueva: "12 variantes hoy, infinitas mañana — cada cliente personalizado"
  □ Slide chatbot demo
  □ Slide multi-tenant futuro (sin revelar SaaS strategy completa)

Día 4: Dry run
  □ Ejecutar demo end-to-end como si fuera la reunión real
  □ Tener Twilio Sandbox QR impreso
  □ Tener Google Calendar abierto en pantalla secundaria
  □ Preparar 3 escenarios de demo:
      1. Paciente nuevo agenda limpieza (ES)
      2. Paciente internacional consulta carillas (EN)
      3. Reagendamiento de cita existente
```

### Fase 5+ — Post-demo (~13-15 días)

Portal + Auth + Blog + SEO Local + Email. Solo cuando demo aprobado por Axia.

```
Semana 1 (post-demo):
  □ apps/portal scaffolding con TanStack Start
  □ WorkOS AuthKit embedded integration
  □ Onboarding wizard 3 pasos
  □ Dashboard con resumen de citas
  □ Branding settings (edita designTokens)
  □ Service settings CRUD

Semana 2 (post-demo):
  □ Appointments management (lista + calendar view)
  □ Patients management
  □ Conversation viewer (flagged-for-human)
  □ Team invitations via WorkOS
  □ Permissions matrix enforcement

Semana 3 (post-demo):
  □ Resend setup + email templates con React Email
  □ Auto-complete de appointments + review request automation
  □ Blog: TipTap (via Novel.sh) + lectura pública en landing
  □ GBP Tier 1: Places API + checklist
  □ NAP consistency tools
```

### Fase 6 — Billing modular (~6 días)

```
□ Wompi billing account setup (cuenta Talvu, NO clínica)
□ convex/payments/wompi.ts: createSubscription, cancelSubscription, handleWebhook
□ convex/subscriptions/*.ts: activateModule, deactivateModule, switchToBundle
□ Module dependency resolver
□ Pricing page en apps/marketing
□ Feature gating en todas las mutations
□ Upgrade/downgrade flows
□ Trial expiration cron + email
□ Past_due grace period (7 días)
□ moduleUsage tracking + overage logic
```

### Fase 7 — eCommerce (~10 días)

```
Semana 1:
  □ Product CRUD en portal
  □ Order management
  □ Wompi per-tenant credentials encryption
  □ Tenant onboarding docs para Wompi merchant signup

Semana 2:
  □ apps/store con TanStack Start
  □ Catalog + product detail + cart + checkout
  □ Wompi widget integration con keys del tenant
  □ Webhook handling diferenciando billing vs eCommerce
  □ Email transaccionales (confirmación, shipping)
  □ SEO products: schema.org Product + sitemap
```

---

## 6. Stack técnico

### 6.1 Lista de tecnologías por capa

```
Frontend (apps/landing, apps/portal, apps/store):
  - Vite + TanStack Start (SSR + routing)
  - React 19
  - Tailwind v4 con @theme directive
  - Convex React client (useQuery, useMutation, real-time)
  - Base UI primitives (no Radix)
  - shadcn-style component patterns
  - Sentry para error tracking

Bot (apps/bot):
  - Hono on Cloudflare Workers
  - ConvexHTTPClient para llamar Convex
  - Twilio API para WhatsApp
  - Wompi webhook handling

UI Library (packages/ui):
  - Sections composables (page builder)
  - Chat widget
  - Auto-form para portal (a futuro)
  - Email templates (React Email)

Backend (convex/):
  - Convex (DB + functions + real-time)
  - WorkOS auth (JWT validation)
  - Vercel AI SDK + Gemini 2.5 Flash
  - Google Calendar API (Service Account JWT)
  - UploadThing API (server SDK)
  - Resend API (server SDK)
  - Wompi API
  - Sentry (error reporting)

Tooling:
  - Turborepo (monorepo orchestration + remote cache)
  - pnpm workspaces
  - TypeScript 5.9
  - Storybook 8
  - Zod 3 (runtime validation)
  - libphonenumber-js
  - sharp (image metadata)

CLI (packages/cli):
  - commander (parsing)
  - inquirer (prompts)
  - chalk + ora (UX)
  - execa (shell)

Observability:
  - Sentry (frontend + backend errors)
  - PostHog (analytics + session replay + feature flags) - Semana 8+
  - Vercel Analytics (built-in)
  - BetterStack (uptime)
```

### 6.2 Convex env vars completo

```bash
# Fase 1
UPLOADTHING_SECRET
UPLOADTHING_APP_ID
WORKOS_DOMAIN
WORKOS_CLIENT_ID
WORKOS_API_KEY
ENCRYPTION_MASTER_KEY

# Fase 3
GEMINI_API_KEY
TWILIO_ACCOUNT_SID
TWILIO_AUTH_TOKEN
TWILIO_WHATSAPP_NUMBER
GOOGLE_SERVICE_ACCOUNT_KEY_B64

# Fase 5+
RESEND_API_KEY
PORTAL_URL
LANDING_URL
SENTRY_DSN

# Fase 6 (billing)
WOMPI_BILLING_PRIVATE_KEY
WOMPI_BILLING_EVENT_SECRET

# Futuro
GOOGLE_PLACES_API_KEY
POSTHOG_API_KEY
```

### 6.3 Talvu CLI commands

```bash
pnpm talvu setup                                # Bootstrap inicial
pnpm talvu rename <old> <new>                   # Rename namespace
pnpm talvu seed:images [--industry dental]      # Upload seed images
pnpm talvu seed:base                            # Run base seed
pnpm talvu tenant:create <file>                 # Generate preview from JSON
pnpm talvu tenant:info <slug>                   # Print tenant info
pnpm talvu tenant:list [--status prospect]      # List tenants
pnpm talvu tenant:rotate <slug>                 # Rotate preview token
pnpm talvu tenant:revoke <slug>                 # Revoke preview access
pnpm talvu domain:verify [--tenant axia]        # Check DNS + Vercel domain
pnpm talvu env:check                            # Verify Convex env vars
pnpm talvu blog:seed <tenant-slug>              # Seed blog posts
pnpm talvu backup:export [--auto]               # Export Convex snapshot
pnpm talvu help
```

---

## 7. Decisiones operativas

### 7.1 Bot system prompt — directrices

El bot DEBE:
- Responder en idioma del paciente (auto-detect)
- Reconducir conversaciones off-topic al tema
- Comunicar limitaciones explícitas:
  - NO da diagnósticos
  - NO prescribe medicamentos
  - NO compara con clínicas competidoras
  - NO maneja emergencias (redirige a urgencias)
- Escalar a humano vía tool `escalate_to_human(reason, urgency)`
- Mencionar opción WhatsApp inmediatamente tras captura de teléfono (una sola vez, no insistir)

### 7.2 Bot conversation handling

- WhatsApp conversations: persistencia indefinida
- Web conversations: sessionId en localStorage, expira 30 días
- Context window: últimos 20 mensajes + rolling summary de viejos
- Phone-based merge: web session → WhatsApp se merge automático por teléfono
- Patient lookup primario por phone (no email)

### 7.3 Appointment lifecycle

- `pending` (recién creada por bot)
- `confirmed` (paciente confirmó, opcional)
- `cancelled` (cancelada antes de tiempo)
- `rescheduled` (cambió de fecha)
- `completed` (auto 3h post-datetime O manual desde portal)
- `no_show` (manual desde portal solo)

Auto-complete corre cada hora vía Convex cron. Review request scheduled +24h post-completion.

### 7.4 Patient privacy

- Bot NUNCA da info de OTROS pacientes
- WorkOS users de tipo `patient` están unaffiliated (no pertenecen a Organization)
- Patient puede tener relaciones con N tenants vía `patientTenantRelations`
- Cross-tenant sharing requiere consent explícito (futuro)

### 7.5 Phone validation

- Storage: siempre E.164 (`+573012345678`)
- Display: `formatNational()` o `formatInternational()` según contexto
- Default country: `tenantLocation.address.country`
- WhatsApp Sandbox limitations: solo números opt-in funcionan

### 7.6 Image strategy

- UploadThing CDN para todos los binarios
- Convex guarda solo URLs + metadata
- Seed images upload via script único (no via UI)
- Tenant images upload via portal (UploadThing UploadDropzone)
- Cleanup orphans: job futuro compara `blogPosts.content` URLs vs UT keys

### 7.7 i18n authoring

- Schema admite cualquier locale via `Record<string, string>`
- Constante `SUPPORTED_LOCALES` controla qué se acepta en prod
- Validación: al menos un locale presente
- Fallback chain configurable per-locale
- Per-tenant `enabledLocales` filtra qué se publica
- AI translation via Gemini en portal (Semana 5+)

---

## 8. Áreas pendientes de research

### 8.1 Pricing validation

**Prerequisito antes de exponer pricing público:**

```
□ 5-10 customer interviews con clínicas dentales en Colombia
  - "¿Cuánto pagás hoy por sitio + agenda + WhatsApp business?"
  - "Si te ahorrara 20h/mes de gestión, ¿cuánto valdría?"
  - "¿Cuánto cuesta perder paciente por no responder WhatsApp?"
  - "¿Tu socio aprobaría $X/mes sin pensarlo?"

□ Van Westendorp survey con 30+ respondents:
  - Too expensive (no compraría)
  - Expensive (consideraría)
  - Cheap (buena oferta)
  - Too cheap (sospechoso)

□ Competitor pricing 2026 actualizado:
  - Doctoralia Colombia
  - Doc.cc
  - Topmédicos
  - Wati / Respond.io (WhatsApp-only competitors)

□ Cost data real:
  - Run Axia un mes producción shadow
  - Medir Convex calls reales, Twilio messages reales, Gemini tokens
  - Recalcular margins con datos vs estimaciones

□ Conversion rates del demo:
  - Prospectos visitan preview → eligen variante (%)
  - Prospectos seleccionan → firman trial (%)
  - Trial → paid (%)
```

### 8.2 Otras decisiones para validar post-demo

- Patient portal scope (V2 confirmar features mínimas)
- Custom domain como upgrade sea de Pro o Enterprise
- Free tier con Talvu branding visible vs no-free
- Bot conversation overage automático vs manual approval
- WorkOS pricing al hit 1M MAU (seguramente nunca pero documentar)
- OAuth Google Calendar como alternativa al Service Account
- Multi-language portal UI (¿existe demanda EN/PT?)

---

## 9. Apéndices

### 9.1 Mapping de las 20 preguntas grilled

| # | Pregunta | Decisión |
|---|---|---|
| 1 | Status quo reconciliation | Audit primero, reconciliar plan con código existente |
| 2 | Multi-tenant desde día 1? | Sí, investor signal de cliente #2 |
| 3 | Page builder vs templates | Full page builder (option A) |
| 4 | previewPreset shape | Tokens + composición + content key referenciado |
| 5 | Prospect onboarding | (a) manual ahora → (c) portal Semana 5 → (b) self-service Semana 11+ |
| 6 | Section variants | Token-agnostic + recommendedFamilies + Storybook + preset #13 validator |
| 7 | URLs / dominios | Subdomain wildcard default + custom domain optional premium |
| 8 | Auth provider | WorkOS AuthKit embedded |
| 9 | Páginas composables | Solo home; resto templates fijos toggle-able |
| 10 | Wompi marketplace | Per-tenant merchants. eCommerce post-demo |
| 11 | Timing realism | Demo 6+ semanas, narrow scope |
| 12 | i18n strategy | Locale-agnostic Record<locale,string>, per-tenant enabledLocales |
| 13 | Tenants schema | tenants + tenantLocations multi-sede + regulatorio CO opcional |
| 14 | Sections inventory | 6 core + 2 opcionales + header/footer layout-level |
| 15 | Content schema | v.any() + Zod runtime + auto-form para portal |
| 16 | Preview tokens / CLI | UUID con rotate + revoke; pnpm talvu CLI master script; rename = Fase 0 |
| 17 | Bot/Calendar/Twilio | Service Account, per-specialist, 30min slots, 10min buffer |
| 18 | Portal auth | Self-service signup + WorkOS invitations + permissions matrix |
| 19 | Blog/Reviews/GBP | Novel.sh editor + auto-complete +3h + review +24h + GBP Tier 1 |
| 20 | Pricing modular | 10 módulos + 4 add-ons + 3 bundles, 76-82% margin annual |

### 9.2 Glossary

- **Tenant**: cliente de Talvu (clínica, spa, barbería, etc.)
- **Module**: feature pricing-able (landing, bot, blog, etc.)
- **Bundle**: combinación curada de modules con descuento
- **Preset**: template de diseño + composición de secciones (global, share by industry)
- **Variant**: implementación específica de una section (hero-calido, services-clinico)
- **Family**: agrupación visual (cálido, clínico, elegante, lujoso)
- **Locale-agnostic**: schema que soporta cualquier idioma sin migration
- **PRICING_DRAFT**: marker en código de precios provisionales
- **Page builder**: composición dinámica de pageSections
- **Token-agnostic**: variant que renderea con cualquier token set

### 9.3 Documentos relacionados (a crear)

```
docs/
  multi-tenant-migration-A.md       (este doc — exhaustive)
  multi-tenant-migration-B.md       (executive)
  multi-tenant-migration-C.md       (hybrid)
  pricing-research.md               (TODO: customer interviews, Van Westendorp)
  security.md                       (rotación secrets, encryption, leak playbook)
  disaster-recovery.md              (Convex restore procedure, UploadThing orphans)
  costos-produccion.md              (existente — actualizar con UploadThing/WorkOS/PostHog)
  module-catalog.md                 (descripción de cada módulo + features)
```

### 9.4 Roles y permissions matrix (resumen)

```
                              admin owner spec recep patient
tenant.read                     ✓     ✓    ✓    ✓
tenant.update                   ✓     ✓
design.update                   ✓     ✓
pages.update                    ✓     ✓
team.invite                     ✓     ✓
services.update                 ✓     ✓
appointments.read.all           ✓     ✓         ✓
appointments.read.own                      ✓
appointments.create             ✓     ✓    ✓    ✓
appointments.complete           ✓     ✓    ✓
patients.read                   ✓     ✓    ✓    ✓
conversations.respond           ✓     ✓    ✓    ✓
blog.write                      ✓     ✓    ✓
blog.publish                    ✓     ✓
billing.read                    ✓     ✓
analytics.read                  ✓     ✓
platform.tenants.all            ✓
platform.impersonate            ✓
```

### 9.5 Section variants iniciales (Semana 2 deliverable)

```
hero (8):
  hero-calido-image, hero-calido-video,
  hero-clinico-image, hero-clinico-video,
  hero-elegante-image, hero-elegante-video,
  hero-lujoso-image, hero-lujoso-video

services (4):
  services-calido-grid-xl, services-clinico-grid-icons,
  services-elegante-list-numbered, services-lujoso-grid-roman

team (4):
  team-calido-circular, team-clinico-card-grid,
  team-elegante-zigzag, team-lujoso-dark-grayscale

testimonials (4):
  testimonials-calido-cards-2col, testimonials-clinico-cards-3col,
  testimonials-elegante-border-italic, testimonials-lujoso-quote-centered

cta-contact (4):
  cta-calido-decorative-box, cta-clinico-split-info,
  cta-elegante-centered, cta-lujoso-split-bordered

features-cards (1, optional):
  features-cards-emoji-3col

stats (1, optional):
  stats-numbered-4col

header (4):
  header-calido-aireado, header-clinico-sticky-topbar,
  header-elegante-uppercase, header-lujoso-monogram

footer (4):
  footer-calido-simple, footer-clinico-bordered,
  footer-elegante-uppercase, footer-lujoso-uppercase

Total: 30+ components
Storybook stories: 30 × 12 paletas = 360+ stories
```

---

**Última actualización:** 2026-04-15  
**Próxima revisión:** post-demo Axia
