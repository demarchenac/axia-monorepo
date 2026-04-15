# Migración a Talvu Multi-Tenant — Versión Híbrida

> **Top:** TL;DR + checklist por fase (para ejecución diaria)  
> **Apéndice:** racional + schema completo + ejemplos de código (para cuando dudes)
>
> Versiones alternativas:
> - `multi-tenant-migration-A.md` — exhaustive (todo el racional)
> - `multi-tenant-migration-B.md` — executive (solo decisiones + checklist)

---

# PARTE 1 — Top: Decisiones + Checklist

## TL;DR (1 párrafo)

Pivot de "Axia landing" a **Talvu**, plataforma SaaS multi-tenant para negocios de servicios (dental, estética, veterinaria, spas, etc.). Schema multi-tenant + multi-sede desde día 1. Page builder con secciones composables (token-agnostic, validadas con Storybook). Auth WorkOS (Organizations = tenants). Subdomains `*.talvu.app` por tenant. **Demo a Axia en ~6 semanas** con scope narrow: preview selector + chat widget + bot WhatsApp + Google Calendar. Post-demo: Portal + Auth + Blog + Email + Billing modular + eCommerce. **Pricing modular** con 10 módulos + 4 add-ons + 3 bundles, 76-82% margin annual.

## 20 decisiones core

1. **Rebrand** `@axia/*` → `@talvu/*` como Fase 0
2. **Multi-tenant** desde día 1 (`tenants` table, no `clinics` — soporta multi-industry)
3. **Multi-sede** desde día 1 (`tenantLocations`)
4. **Page builder** completo: solo `home` composable, resto templates fijos
5. **Token-agnostic variants** + `recommendedFamilies` soft hint + Storybook matrix
6. **Subdomains:** `*.talvu.app` (landing), `*.portal.talvu.app`, etc. — wildcards globales únicos
7. **Marketing en `talvu.com`**, app en `talvu.app`
8. **Custom domain** como upgrade premium
9. **Auth: WorkOS AuthKit embedded.** Organizations = tenants. Patients unaffiliated
10. **i18n:** `Record<locale, string>` + `SUPPORTED_LOCALES` constant + per-tenant `enabledLocales`
11. **UploadThing** para imágenes
12. **Storybook** para variant testing
13. **TipTap via Novel.sh** para blog
14. **Resend + React Email** para emails per-tenant branded
15. **Sentry** desde Fase 1, **PostHog** desde Fase 8+
16. **WhatsApp** Twilio Sandbox + Hono webhook en Cloudflare Workers
17. **Calendar:** Google Service Account + per-specialist + 30min slots + 10min buffer
18. **Wompi:** per-tenant merchants (eCommerce). Cuenta Talvu separada (billing)
19. **Pricing modular:** 10 módulos + 4 add-ons + 3 bundles (Essentials/Growth/Complete). 76-82% margin annual
20. **Demo Axia:** preview selector + chat widget + bot WhatsApp + Google Calendar. Resto post-demo.

## Plan por fases (one-liners + checklist)

### Fase 0 — Rebrand (2-3 horas)

```
□ pnpm talvu rename @axia @talvu
□ Update root package.json: "name": "talvu"
□ Verify build + dev
□ Commit + push
```

### Fase 1 — Cimientos (5-7 días)

```
□ Comprar talvu.com + talvu.app
□ DNS wildcards: *.talvu.app, *.portal.talvu.app, *.tienda.talvu.app, *.pacientes.talvu.app
□ Vercel: talvu.app + *.talvu.app a project landing
□ Refactor convex/schema.ts a multi-tenant (ver Apéndice A)
□ UploadThing setup + seed images upload
□ WorkOS setup + auth.config.ts
□ Convex env vars Fase 1: UPLOADTHING_*, WORKOS_*, ENCRYPTION_MASTER_KEY
```

### Fase 2 — Page builder (10-12 días)

```
□ Extraer 30+ section variants en packages/ui/src/sections/
□ Schemas Zod por section type
□ Storybook + matrix testing 360+ stories
□ TokenProvider + SectionRenderer
□ 12 dental presets seed + preset #13 cross-family validator
□ pnpm talvu tenant:create scripts/prospects/axia.json
□ i18n routing $locale primero en URL
□ /es/preview grid + preview individual con DemoBadge
□ SEO básico (meta tags, canonical, robots)
□ Lighthouse >85
```

### Fase 3 — Bot + Calendar + Chat (5-6 días)

```
□ Vercel AI SDK + Gemini wired
□ 7 bot tools + system prompt dinámico + escalate_to_human tool
□ Google Service Account + 3 calendarios prueba
□ Twilio Sandbox + Hono webhook deploy a bot.talvu.app
□ Chat widget en packages/ui (lazy load)
□ Phone validation + ContinueOnWhatsApp button
□ Phone-based merge web→WhatsApp
□ Smoke test 5 escenarios
```

### Fase 4 — Demo Axia (3-4 días)

```
□ Bug fixes
□ Cliente ficticio (Dental Pro)
□ Slides actualizadas
□ Dry run completo
```

### Fase 5+ — Post-demo

```
Fase 5 (~7 días) — Portal + Auth (WorkOS embedded)
Fase 6 (~6 días) — Blog (Novel.sh) + Email (Resend) + GBP Tier 1
Fase 7 (~6 días) — Billing modular (Wompi)
Fase 8 (~10 días) — eCommerce (apps/store + Wompi per-tenant)
```

## Checkpoint criteria

### Fin Fase 4 (demo ready)
- [ ] /es/preview muestra 12 variantes dinámicas
- [ ] Idénticas a hardcoded actual
- [ ] Chat widget funcional
- [ ] Bot agenda en Calendar real
- [ ] Bot ES + EN
- [ ] Cliente ficticio en <5min via CLI
- [ ] Lighthouse >85

### Fin Fase 7 (billing live)
- [ ] Trial 30d → upgrade
- [ ] Feature gating funciona
- [ ] Wompi sandbox flow OK
- [ ] Past_due grace 7 días

### Fin Fase 8 (eCommerce live)
- [ ] Productos CRUD
- [ ] Checkout E2E con dinero a clínica
- [ ] Webhook diferencia billing vs commerce
- [ ] Emails branded per-tenant

## Pricing draft (PRICING_DRAFT)

| Bundle | Monthly COP | Annual COP/año |
|---|---|---|
| Essentials (landing+portal+bot+calendar+web-chat) | 230,000 | 2,300,000 |
| Growth (+ blog+ai-translation+seo+reviews) | 360,000 | 3,600,000 |
| Complete (+ store+1 domain+2 sedes) | 530,000 | 5,300,000 |

Annual = monthly × 10 (descuento 17%, 2 meses gratis). Margen anual 76-82%.

**Validar pricing antes de exposure público:** customer interviews + Van Westendorp + competitor analysis + cost data Axia.

## Convex env vars cheat sheet

```bash
# Fase 1
UPLOADTHING_SECRET, UPLOADTHING_APP_ID
WORKOS_DOMAIN, WORKOS_CLIENT_ID, WORKOS_API_KEY
ENCRYPTION_MASTER_KEY  # openssl rand -base64 32

# Fase 3
GEMINI_API_KEY
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
GOOGLE_SERVICE_ACCOUNT_KEY_B64  # base64 del JSON completo

# Fase 5+
RESEND_API_KEY, SENTRY_DSN, PORTAL_URL, LANDING_URL

# Fase 7
WOMPI_BILLING_PRIVATE_KEY, WOMPI_BILLING_EVENT_SECRET

# Fase 8+
GOOGLE_PLACES_API_KEY, POSTHOG_API_KEY
```

## Comandos CLI Talvu

```bash
pnpm talvu setup                                # Bootstrap
pnpm talvu rename @axia @talvu                  # Rebrand
pnpm talvu seed:images --industry dental        # Upload seed images
pnpm talvu seed:base                            # Run base seed
pnpm talvu tenant:create scripts/prospects/x.json   # Generate previews
pnpm talvu tenant:info <slug>                   # Tenant details
pnpm talvu tenant:rotate <slug>                 # Rotate preview token
pnpm talvu tenant:revoke <slug>                 # Revoke preview access
pnpm talvu env:check                            # Verify env vars
pnpm talvu domain:verify                        # Check DNS + Vercel
pnpm talvu blog:seed <slug>                     # Seed blog posts
pnpm talvu backup:export                        # Convex snapshot
```

---

# PARTE 2 — Apéndice: detalle por decisión

## Apéndice A — Schema multi-tenant

Tablas (32 totales). Campos clave de cada una. Para schema completo con todos los campos + indexes ver `multi-tenant-migration-A.md` sección 3.

```
tenants                  Identidad + branding + status SaaS + WorkOS + regulatorio CO + Wompi
tenantLocations          Sede(s) por tenant + horarios + GBP per-location
users                    Mirror de WorkOS + roles + tenantId + patientRecordId
specialists              Profesionales + locationIds + calendarId + schedules per location
services                 Servicios + i18n + locationIds + priceCOP/USD + FAQ + SEO fields
patients                 Sin tenantId directo (junction table)
patientTenantRelations   Relación N:M paciente↔tenant
appointments             Con locationId required + completedBy auto/staff
conversations            channel + channelId + flagged_for_human + history summary
messages                 Por conversación
tenantPages              Solo "home" por ahora; SEO meta per-locale
pageSections             type + variant + content (i18n via Record<locale,any>) + Zod validated
previewPresets           Globales por industry; tokens embedded + sectionComposition
tenantPreviews           Per-tenant instancias de presets; status generated/selected/dismissed
seedContent              Industry + sectionType + contentKey + i18n content
seedImages               UploadThing URL + categoría + tone + license
designTokens             Per-tenant editable; clonado del preset al seleccionar
tenantImages             Fotos uploadeadas por tenant
blogPosts                TipTap JSON content + i18n + SEO
blogCategories           Flat (no jerarquía)
products                 Para eCommerce + locationIds + stockByLocation
orders                   Status pending/paid/shipped/delivered + paymentReference
subscriptions            activeModules[] + bundleKey + addons[] + billingCycle
moduleUsage              Per-period tracking de quotas
invitations              Track WorkOS invitation lifecycle
reviewRequests           Anti-spam dedup 30 días por patient
gbpChecklist             Items con status ok/warning/error
```

## Apéndice B — Subdominios + DNS

```
talvu.com                     → Vercel marketing project (futuro)
talvu.app                     → Vercel landing (redirect a talvu.com)
*.talvu.app                   → Vercel landing project
portal.talvu.app              → Vercel portal (login universal)
*.portal.talvu.app            → Vercel portal (themed per tenant)
admin.portal.talvu.app        → Vercel portal (platform_admin UI)
pacientes.talvu.app           → Vercel portal (patient login universal)
*.pacientes.talvu.app         → Vercel portal (patient view per tenant)
tienda.talvu.app              → Vercel store (catalog)
*.tienda.talvu.app            → Vercel store (per tenant)
bot.talvu.app                 → Cloudflare Workers
auth.talvu.app                → WorkOS custom auth domain
```

**Reserved subdomains** (no se pueden usar como tenant slug):

```
www, api, portal, tienda, store, bot, admin, app, mail,
staging, preview, demo, dev, test, cdn, static, assets,
media, images, blog, docs, help, support, login, signup,
billing, account, dashboard, auth, oauth,
pacientes, patients, sedes, locations
```

## Apéndice C — Section variants inventory

```
hero (8 variants):
  hero-{calido|clinico|elegante|lujoso}-{image|video}

services (4): services-{calido-grid-xl, clinico-grid-icons, elegante-list-numbered, lujoso-grid-roman}

team (4): team-{calido-circular, clinico-card-grid, elegante-zigzag, lujoso-dark-grayscale}

testimonials (4): testimonials-{calido-cards-2col, clinico-cards-3col, elegante-border-italic, lujoso-quote-centered}

cta-contact (4): cta-{calido-decorative-box, clinico-split-info, elegante-centered, lujoso-split-bordered}

features-cards (1, optional): features-cards-emoji-3col

stats (1, optional): stats-numbered-4col

header (4): header-{calido-aireado, clinico-sticky-topbar, elegante-uppercase, lujoso-monogram}

footer (4): footer-{calido-simple, clinico-bordered, elegante-uppercase, lujoso-uppercase}

Total: 30+ components
Storybook stories: ~360 (variant × paleta)
```

## Apéndice D — Pricing detallado

### Módulos (mensual COP)

| Módulo | Mensual | Annual COP/mes ef. | Annual margin |
|---|---|---|---|
| landing | 40,000 | 33,300 | 82% |
| bot-whatsapp (200 conv inc) | 130,000 | 108,300 | 80% |
| web-chat | 25,000 | 20,800 | 81% |
| calendar-sync | 15,000 | 12,500 | 84% |
| portal | 70,000 | 58,300 | 79% |
| blog | 80,000 | 66,700 | 79% |
| ai-translation | 25,000 | 20,800 | 81% |
| seo-local | 25,000 | 20,800 | 81% |
| reviews-automation | 25,000 | 20,800 | 81% |
| store | 75,000 | 62,500 | 81% |

### Add-ons

| Add-on | Mensual | Annual |
|---|---|---|
| custom-domain (per) | 50,000 | 500,000 |
| additional-location (per) | 40,000 | 400,000 |
| conversation-pack-100 | 50,000 | 500,000 |
| storage-pack-10gb | 20,000 | 200,000 |

### Bundles

| Bundle | Monthly | Annual | Annual margin |
|---|---|---|---|
| Essentials | 230,000 | 2,300,000 | 77% |
| Growth | 360,000 | 3,600,000 | 76% |
| Complete | 530,000 | 5,300,000 | 79% |

### Trial + free strategy

- Signup → 30 días trial Essentials full
- Día 23: email "termina en 7 días"
- Día 27: banner persistente en portal
- Día 30: degradación a "landing only + Talvu branding visible"

## Apéndice E — Auth flow (WorkOS)

### Signup post-preview-selection

```
1. Prospecto en /preview/{preset} click "Me gusta esta variante"
2. Modal: confirm email pre-llenado de tenant.email
3. Confirm:
   - UPDATE tenantPreview.status = "selected"
   - UPDATE other previews.status = "dismissed"
   - UPDATE tenant.status = "trial", trialEndsAt = +30d
   - Materialize tenantPages + pageSections (copy del preset)
   - Call WorkOS: create User + send invitation
4. Prospecto recibe email WorkOS → set password
5. Redirect a portal.talvu.app/onboarding
6. Wizard 3 pasos: logo, equipo, services
7. Dashboard
```

### Permissions matrix

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

## Apéndice F — Bot system prompt (estructura)

```markdown
Sos el asistente virtual de {{tenant.name}}, un(a) {{industry_label}} en {{location.city}}.

## Tu rol
Ayudás a pacientes a:
1. Conocer servicios
2. Consultar precios
3. Agendar/reagendar/cancelar citas
4. Info ubicación/horarios

## Reglas de enfoque
- Siempre reconducí a agendar o resolver
- No extiendas conversación off-topic
- Cada respuesta mueve al usuario un paso más cerca de resolución

## Lo que NO podés hacer (comunicá claro)
- NO diagnósticos médicos
- NO prescripciones
- NO comparaciones con competencia
- NO emergencias (redirigir a urgencias)
- NO info de otros pacientes

## Escalación
Tool: escalate_to_human(reason, urgency)

## Idioma
- Detectá del primer mensaje
- Mirror el idioma del paciente
- ES: tono cercano colombiano. EN: profesional cálido + USD
- Otro idioma: "Por ahora atiendo en ES o EN"

## Continuación a WhatsApp
Cuando recibás teléfono por primera vez, mencioná UNA vez la opción WhatsApp:
"💬 Tip: si preferís seguir por WhatsApp..."

## Datos del tenant (hidratados runtime)
Servicios: {{services_list}}
Especialistas: {{specialists_list}}
Sedes: {{locations_list}}
Horarios: {{hours_per_location}}
```

## Apéndice G — Email templates

```
transactional/
  welcome-tenant.tsx              - clinic_owner invite
  welcome-staff.tsx               - staff secundario
  password-reset.tsx              - WorkOS handles
  appointment-confirmation.tsx    - paciente
  appointment-reminder.tsx        - 24h antes
  appointment-cancelled.tsx
  appointment-completed.tsx       - con link reseña
  trial-ending.tsx                - 7d antes
  payment-failed.tsx
  payment-succeeded.tsx           - recibo mensual
  new-order.tsx                   - al owner
  order-confirmed.tsx             - al paciente
  order-shipped.tsx
  review-request.tsx              - email backup de WhatsApp
```

Cada template usa `tenant.primaryColor` + `tenant.logoUrl`. From: `${tenant.name} <appointments@talvu.app>`.

## Apéndice H — Bot tools (7 tools)

```ts
lookup_patient(phone: string)
list_services(tenantId: string, locationId?: string)
check_availability(specialistId, locationId, date, serviceDuration)
book_appointment(patientId, serviceId, specialistId, locationId, datetime)
cancel_appointment(appointmentId, reason?)
reschedule_appointment(appointmentId, newDatetime)
get_appointments_by_patient(patientId, status?)
escalate_to_human(reason: string, urgency: "normal" | "urgent")
```

## Apéndice I — Modules dependency graph

```
landing (required)
  ├── portal (depends on landing)
  │     ├── blog (depends on portal)
  │     ├── ai-translation (depends on portal)
  │     ├── seo-local (depends on portal)
  │     └── store (depends on portal)
  └── bot-whatsapp (depends on landing)
        ├── web-chat (depends on landing, requiresAny: bot-whatsapp)
        ├── calendar-sync (depends on bot-whatsapp)
        └── reviews-automation (depends on bot-whatsapp)

Add-ons (per-unit):
  custom-domain
  additional-location
  conversation-pack-100
  storage-pack-10gb
```

Antes de unsubscribe módulo: verificar `getDependentModules()` no retorna nada.

## Apéndice J — Locale strategy

```ts
// packages/shared/src/constants/locales.ts
SUPPORTED_LOCALES = ["es", "en"]
DEFAULT_LOCALE = "es"
LOCALE_FALLBACKS = {
  es: ["en"],
  en: ["es"],
  // futuro: pt: ["es", "en"]
}
```

URL: `{slug}.talvu.app/{locale}/...` siempre. Locale como primer segmento.

Per-tenant: `tenants.enabledLocales` filtra qué locales se publican. Switcher visible solo si `enabledLocales.length > 1`.

Content shape: `Record<string, string>` por campo. Validation: al menos un locale presente.

AI translation: botón en portal que llama Gemini con prompt dental + sourceLocale + targetLocale.

## Apéndice K — Phone strategy

- libphonenumber-js para parse + validate + format
- Storage: E.164 (`+573012345678`)
- Display: contextual (national o international)
- Default country: `tenantLocation.address.country`
- Twilio Sandbox limitations: solo opt-in numbers funcionan en dev
- Producción: cualquier país pero costo Meta varía

## Apéndice L — Image strategy

- UploadThing CDN para todos los binarios
- Schema usa `v.string()` (URL) + `utfsKey` para delete
- Seed images upload via script (no UI)
- Tenant images via portal (UploadThing UploadDropzone)
- Free tier UT: 2GB. Paid: $10/mo 100GB
- Resize on upload (script genera 3 sizes); resize on-fly futuro vía Cloudflare Image Resizing

## Apéndice M — Areas pendientes

**Pre-launch validation:**
- 5-10 customer interviews dental Colombia
- Van Westendorp pricing survey (30+ respondents)
- Competitor analysis 2026 actualizado
- Cost data real Axia primer mes producción
- Conversion rates demo→trial→paid
- Free tier estrategia final
- Custom domain plan tier
- Patient portal scope V2

**Decisiones operativas a confirmar post-data:**
- Bot conversation overage automático vs manual
- WorkOS pricing al hit 1M MAU (siempre <)
- OAuth Google Calendar como alternativa al SA
- Multi-language portal UI (¿ES/PT/EN?)

## Apéndice N — Mapping de las 20 preguntas grilled

| # | Pregunta | Decisión |
|---|---|---|
| 1 | Status quo | Audit primero, reconciliar plan vs código |
| 2 | Multi-tenant día 1? | Sí |
| 3 | Page builder vs templates | Full builder |
| 4 | previewPreset shape | Tokens + composición + content key |
| 5 | Prospect onboarding | Manual ahora → portal Semana 5 → self-service Semana 11+ |
| 6 | Section variants | Token-agnostic + recommendedFamilies + Storybook |
| 7 | URLs / dominios | Subdomain wildcard + custom domain optional |
| 8 | Auth | WorkOS AuthKit embedded |
| 9 | Páginas composables | Solo home; resto templates |
| 10 | Wompi marketplace | Per-tenant merchants |
| 11 | Timing realism | Demo 6+ semanas narrow scope |
| 12 | i18n | Locale-agnostic Record<string,string> |
| 13 | Tenants schema | tenants + tenantLocations + regulatorio CO |
| 14 | Sections | 6 core + 2 opcionales + header/footer layout |
| 15 | Content schema | v.any() + Zod + auto-form |
| 16 | Preview tokens / CLI | UUID rotate+revoke + master CLI + rebrand Fase 0 |
| 17 | Bot/Calendar/Twilio | Service Account + per-specialist + 30min slots |
| 18 | Portal auth | Self-service signup + WorkOS invitations |
| 19 | Blog/Reviews/GBP | Novel.sh + auto-complete +3h + GBP Tier 1 |
| 20 | Pricing modular | 10 modules + 4 add-ons + 3 bundles, 76-82% margin |

---

**Última actualización:** 2026-04-15  
**Próxima revisión:** post-demo Axia (~Junio 2026)
