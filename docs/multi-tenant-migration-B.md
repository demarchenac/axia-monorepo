# Migración a Talvu Multi-Tenant — Versión Ejecutiva

> Decisiones + checklist por fase. Sin racional. Para ejecución diaria.
>
> Para el racional completo: ver `multi-tenant-migration-A.md`.

---

## Decisiones core (1 línea cada una)

1. **Rebrand** `@axia/*` → `@talvu/*` como Fase 0
2. **Multi-tenant** desde día 1 (tabla `tenants`, no `clinics` — soporta multi-industry)
3. **Multi-sede** desde día 1 (`tenantLocations` con `isPrimary`)
4. **Page builder** completo: `pageSections` composables solo en `home`; resto templates fijos
5. **Token-agnostic variants** + `recommendedFamilies` soft hint + Storybook matrix testing
6. **Subdomains**: `*.talvu.app` (landing), `*.portal.talvu.app`, `*.tienda.talvu.app`, `*.pacientes.talvu.app`
7. **Marketing en `talvu.com`**, app en `talvu.app`
8. **Custom domain** como upgrade premium
9. **Auth: WorkOS AuthKit embedded**. Organizations = tenants. Patients unaffiliated
10. **i18n**: `Record<locale, string>`. `SUPPORTED_LOCALES` constant. `tenants.enabledLocales`
11. **UploadThing** para imágenes (URLs en Convex, binarios en UT CDN)
12. **Storybook** para variant matrix testing
13. **TipTap via Novel.sh** para blog editor
14. **Resend + React Email** para emails transaccionales (per-tenant branded)
15. **Sentry** para error tracking (Fase 1+), **PostHog** para analytics (Fase 8+)
16. **WhatsApp**: Twilio Sandbox para demo, Cloudflare Workers + Hono webhook
17. **Calendar**: Google Service Account, per-specialist calendars, slots 30min + 10min buffer
18. **Wompi**: per-tenant merchant para eCommerce. Cuenta Talvu separada para billing SaaS
19. **Pricing modular**: 10 módulos + 4 add-ons + 3 bundles (Essentials/Growth/Complete). 76-82% margin annual
20. **Demo a Axia** (~6 semanas): solo preview selector + chat widget + bot WhatsApp + Google Calendar

---

## Plan por fases

### Fase 0 — Rebrand (2-3 horas)

```
□ Crear scripts/talvu-cli/ con comando rename-namespace
□ Ejecutar pnpm talvu rename @axia @talvu
□ Update root package.json: "name": "talvu"
□ Verify: pnpm turbo build + dev
□ Commit + push + verify Vercel deploy
□ (Opcional) Vercel Team "Talvu" + project rename
```

### Fase 1 — Cimientos multi-tenant (5-7 días)

```
□ Comprar talvu.com + talvu.app
□ DNS wildcards: *.talvu.app, *.portal.talvu.app, *.tienda.talvu.app, *.pacientes.talvu.app
□ Vercel: agregar talvu.app y *.talvu.app a project landing
□ Refactor convex/schema.ts a multi-tenant
   - tenants, tenantLocations, users, specialists, services, patients,
     patientTenantRelations, appointments, conversations, messages,
     tenantPages, pageSections, previewPresets, tenantPreviews,
     seedContent, seedImages, designTokens, tenantImages,
     blogPosts, blogCategories, products, orders, subscriptions,
     moduleUsage, invitations, reviewRequests, gbpChecklist
□ Update convex/seed.ts: crear tenant Axia con primary location
□ UploadThing setup + scripts/seed-images/dental/ + pnpm talvu seed:images
□ WorkOS setup: auth.talvu.app, npx convex env set WORKOS_*
□ Generar ENCRYPTION_MASTER_KEY
□ Update convex/auth.config.ts con WorkOS provider
□ Smoke test: token JWT valida en query autenticada
```

### Fase 2 — Page builder + sections (10-12 días)

```
□ Crear packages/ui/src/sections/ con 30+ components:
   hero (8), services (4), team (4), testimonials (4), cta-contact (4),
   features-cards (1), stats (1), header (4), footer (4)
□ Cada variant usa solo CSS vars abstractas (token-agnostic)
□ Schemas Zod por section type
□ Storybook setup en packages/ui/.storybook/
□ Stories programáticas: variant × paleta = 360+ stories
□ Fix combinations rotas según matrix testing
□ TokenProvider + SectionRenderer + SectionError components
□ convex/seed/dental-presets.ts: 12 presets + preset #13 cross-family validator
□ Mutation generatePreviews + pnpm talvu tenant:create scripts/prospects/axia.json
□ i18n routing: $locale primero en URL, middleware tenant-locale
□ Routes: $locale/index, $locale/preview/index, $locale/preview/$presetSlug
□ Switcher ES|EN en header + hreflang alternates
□ /es/preview grid + preview individual con DemoBadge
□ Token validation en middleware si tenant.status === "prospect"
□ Content resolver con joins runtime + fallback chain
□ SEO básico: meta tags + canonical + robots.txt
□ Lighthouse target >85
□ Verify cliente ficticio (Dental Pro) con previews distintos a Axia
```

### Fase 3 — Bot + Calendar + Chat widget (5-6 días)

```
□ pnpm add ai @ai-sdk/google
□ npx convex env set GEMINI_API_KEY
□ convex/bot/process.ts: generateText con Gemini 2.5 Flash
□ convex/bot/tools.ts: 7 tools (lookup, list_services, check_availability,
   book, cancel, reschedule, get_appointments)
□ System prompt dinámico (template + tenant data)
□ convex/bot/escalate-to-human tool
□ Google Cloud project + Calendar API + Service Account
□ npx convex env set GOOGLE_SERVICE_ACCOUNT_KEY_B64 (base64 del JSON)
□ convex/calendar/index.ts: checkAvailability, createEvent, deleteEvent
□ 3 calendarios prueba (compartidos con SA email)
□ Twilio cuenta + WhatsApp Sandbox activado
□ npx convex env set TWILIO_ACCOUNT_SID/AUTH_TOKEN/WHATSAPP_NUMBER
□ apps/bot/src/routes/webhook.ts + signature middleware
□ Deploy bot a Cloudflare: pnpm --filter @talvu/bot run deploy
□ Configure Twilio webhook URL: bot.talvu.app/webhook/twilio
□ packages/ui/src/components/chat-widget/ (lazy load)
   - usePhoneCollection con libphonenumber-js
   - ContinueOnWhatsApp button (arriba del input)
   - Phone validation E.164 + país dinámico
□ Phone-based merge logic (web → WhatsApp)
□ Conversation summarization >20 mensajes
□ Smoke test integral 5 escenarios
```

### Fase 4 — Demo a Axia (3-4 días)

```
□ Bug fixes from Fase 3 smoke test
□ Tuning system prompt según comportamiento real
□ Crear scripts/prospects/dental-pro.json (cliente ficticio)
□ pnpm talvu tenant:create dental-pro.json + visit dental-pro.talvu.app/es/preview
□ Verify 12 variantes distintas a Axia
□ Update slides ejecutivos
□ Dry run completo end-to-end
□ Tener Twilio Sandbox QR + Google Calendar visible
```

### Fase 5 — Portal + Auth (post-demo, ~7 días)

```
□ apps/portal scaffolding TanStack Start
□ WorkOS AuthKit embedded integration
□ Cookie .talvu.app cross-subdomain
□ Middleware: validate user.tenantId === clinicSlug || role === platform_admin
□ Onboarding wizard 3 pasos (logo, equipo, services)
□ Dashboard con resumen citas
□ Branding settings (edita designTokens, color picker, font selector)
□ Service settings CRUD
□ Appointments management (lista + calendar view)
□ Patients management
□ Conversation viewer (flagged-for-human)
□ Team invitations via WorkOS API
□ Permissions matrix enforcement (5 roles, ~25 permissions)
□ Auto-form para sections content edit (futuro)
```

### Fase 6 — Blog + Email + GBP (post-demo, ~6 días)

```
□ Resend cuenta + DNS records (SPF, DKIM, DMARC) en talvu.app
□ npx convex env set RESEND_API_KEY
□ packages/ui/src/emails/ con React Email components
□ Templates: welcome-tenant, welcome-staff, password-reset,
   appointment-confirmation, appointment-reminder, appointment-cancelled,
   appointment-completed, trial-ending, payment-failed, payment-succeeded,
   review-request, new-order, order-confirmed, order-shipped
□ Per-tenant branded emails (logo + primaryColor)
□ TipTap blog editor via Novel.sh
□ packages/ui/src/components/blog-editor/ con AI completion
□ apps/portal/src/routes/blog/ admin
□ apps/landing/src/routes/$locale/blog/ public
□ blogPosts seed templates parametrizables (6-8 temas)
□ Auto-complete appointments cron (cada 1h)
□ Review request scheduled +24h post-completion
□ Dedup: no enviar review request si último <30 días
□ Google Places API key + cron 6h
□ GBP Tier 1: Places API + checklist UI en portal
□ NAP consistency tools
□ Schema delta: gbpChecklist, reviewRequests
```

### Fase 7 — Billing modular (post-demo, ~6 días)

```
□ Wompi cuenta Talvu (separate from clinic accounts)
□ npx convex env set WOMPI_BILLING_PRIVATE_KEY/EVENT_SECRET
□ apps/bot/src/routes/webhook.ts: agregar /webhook/wompi
□ Diferenciar billing webhook vs eCommerce webhook
□ convex/payments/wompi.ts: createSubscription, cancelSubscription
□ convex/subscriptions/*.ts: activateModule, deactivateModule, switchToBundle
□ Module dependency resolver
□ Pricing page en apps/marketing (futuro project)
□ Feature gating en TODAS las mutations: hasModule(sub, "blog") check
□ Trial expiration cron + email +7d, +3d, día 30 degradación
□ Past_due grace period (7 días)
□ moduleUsage tracking + overage logic + autoOverage flag
□ Annual discount: pagar 10 meses por 12 (~17% off)
□ Schema delta: subscriptions, moduleUsage
```

### Fase 8 — eCommerce (post-demo, ~10 días)

```
Semana 1:
□ apps/portal/src/routes/products/ CRUD
□ apps/portal/src/routes/orders/ management
□ Convex schema: products, orders (multi-sede aware)
□ Wompi per-tenant credentials encryption (ENCRYPTION_MASTER_KEY)
□ Docs para clínicas: Wompi merchant signup walkthrough

Semana 2:
□ apps/store con TanStack Start
□ Routes: $locale/index (catalog), $locale/$productSlug, $locale/cart, $locale/checkout
□ Cart en zustand + localStorage
□ Wompi widget con keys del tenant
□ Webhook handling diferencia billing vs eCommerce vía reference
□ Email transaccionales (confirmación, shipping)
□ SEO products: schema.org Product + sitemap
□ Schema delta: products, orders + inventory tracking
```

---

## Stack técnico

```
Frontend:    Vite + TanStack Start + React 19 + Tailwind v4 + Convex + Sentry
Bot:         Hono + Cloudflare Workers + ConvexHTTPClient + Twilio + Wompi
UI:          packages/ui (sections, chat widget, email templates, blog editor)
Backend:     Convex + WorkOS + Vercel AI SDK + Gemini 2.5 + Google Calendar +
             UploadThing + Resend + Wompi
CLI:         packages/cli (commander + inquirer + chalk)
Tooling:     Turborepo + pnpm + TypeScript 5.9 + Storybook + Zod + libphonenumber-js
Observability: Sentry + PostHog (Fase 8+) + Vercel Analytics + BetterStack
```

---

## Pricing draft (PRICING_DRAFT — validar post-demo)

### Módulos individuales (mensual COP)

| Módulo | Mensual | Anual (COP/año) |
|---|---|---|
| landing (required) | 40,000 | 400,000 |
| bot-whatsapp (200 conv inc) | 130,000 | 1,300,000 |
| web-chat | 25,000 | 250,000 |
| calendar-sync | 15,000 | 150,000 |
| portal | 70,000 | 700,000 |
| blog | 80,000 | 800,000 |
| ai-translation | 25,000 | 250,000 |
| seo-local | 25,000 | 250,000 |
| reviews-automation | 25,000 | 250,000 |
| store | 75,000 | 750,000 |

### Add-ons

| Add-on | Mensual |
|---|---|
| custom-domain (per) | 50,000 |
| additional-location (per) | 40,000 |
| conversation-pack-100 | 50,000 |
| storage-pack-10gb | 20,000 |

### Bundles

| Bundle | Monthly COP | Annual COP/año |
|---|---|---|
| Essentials | 230,000 | 2,300,000 |
| Growth | 360,000 | 3,600,000 |
| Complete | 530,000 | 5,300,000 |

**Annual discount: 17% (2 meses gratis).** Margen anual: 76-82% por módulo, 76-79% por bundle.

---

## Convex env vars

```bash
# Fase 1
UPLOADTHING_SECRET, UPLOADTHING_APP_ID
WORKOS_DOMAIN, WORKOS_CLIENT_ID, WORKOS_API_KEY
ENCRYPTION_MASTER_KEY

# Fase 3
GEMINI_API_KEY
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_NUMBER
GOOGLE_SERVICE_ACCOUNT_KEY_B64

# Fase 5+
RESEND_API_KEY
PORTAL_URL, LANDING_URL
SENTRY_DSN

# Fase 7
WOMPI_BILLING_PRIVATE_KEY, WOMPI_BILLING_EVENT_SECRET

# Fase 8+
GOOGLE_PLACES_API_KEY
POSTHOG_API_KEY
```

---

## Checkpoint criteria

### Fin Fase 4 (demo Axia ready)
- [ ] /es/preview muestra 12+ variantes dinámicamente desde DB
- [ ] Cada variante se ve idéntica a hardcoded actual
- [ ] Chat widget funciona en variante seleccionada
- [ ] Bot agenda cita real en Google Calendar
- [ ] Bot responde ES + EN
- [ ] i18n switcher visible y funcional
- [ ] Cliente ficticio creable en <5 minutos via CLI
- [ ] Cliente ficticio NO se ve igual a Axia
- [ ] Lighthouse landing >85 performance/SEO/accessibility

### Fin Fase 7 (billing live)
- [ ] Tenant nuevo signup → trial 30 días → upgrade a bundle
- [ ] Feature gating bloquea módulos no contratados
- [ ] Pago Wompi sandbox → subscription.status = "active"
- [ ] Past_due → grace 7 días → degradación

### Fin Fase 8 (eCommerce live)
- [ ] Productos CRUD funciona
- [ ] Checkout end-to-end con dinero a cuenta de la clínica (no Talvu)
- [ ] Webhook diferencia billing vs eCommerce correctamente
- [ ] Emails transaccionales se envían branded per-tenant

---

## Pendientes pre-launch (research)

```
□ 5-10 customer interviews validar pricing
□ Van Westendorp survey
□ Competitor analysis 2026 (Doctoralia, Doc.cc)
□ Cost data real Axia primer mes
□ Conversion data del demo (preview→trial→paid)
□ Free tier estrategia final
□ Custom domain plan tier (Pro o Enterprise)
□ Patient portal scope definitivo
```

---

**Última actualización:** 2026-04-15
