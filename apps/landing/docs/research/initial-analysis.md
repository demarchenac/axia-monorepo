# Análisis Inicial — Axia Odontología

> Análisis competitivo de las cotizaciones recibidas por Axia Odontología y posicionamiento de nuestra propuesta.
> Fecha: 2026-04-07
> Cliente: Janne Raish Pacheco — Axia Odontología (by Dr. Francisco Díaz)

---

## 1. Cotizaciones recibidas por Axia

### 1.1 Frama Interactivo — `EST-000006` (17 ene 2026)

| Ítem | Valor (COP) |
|---|---|
| Branding Integral (ADN de marca, manual de identidad, fachada/señalética/papelería) | 5.500.000 |
| Sesión de fotografía de marca personal (Dr. Francisco + instalaciones) | 500.000 |
| Diseño y desarrollo web (10 secciones, blog, galería, formularios, dominio + hosting + Elementor Pro 1er año) | 3.800.000 |
| **Total** | **9.800.000** |

- **Anticipo:** 70% ($6.510.000)
- **Stack:** WordPress + Elementor Pro
- **Recurrente:** No declarado — solo cubre hosting + Elementor Pro el primer año (renovación a cargo del cliente)
- **Fortaleza:** Paquete completo (branding físico + digital + foto + web).
- **Debilidad:** El sitio es básicamente un tema Elementor — sin diferenciación técnica, sin agendamiento, sin chatbot, sin i18n. Branding y foto inflan el precio (~64% del total) y son entregables que el cliente puede no necesitar de inmediato si ya tiene logo.

### 1.2 Aurora — Propuesta "Ecosistema Web 3.0"

| Ítem | Valor (COP) |
|---|---|
| Desarrollo y producción (UI/UX, modelado 3D, foto + video in-house, SEO técnico) — pago único | 2.500.000 |
| Mantenimiento y Evolución Elite — mensual | 300.000 |
| **Total año 1** | **6.100.000** |
| **Total año 2 en adelante** | **3.600.000 / año** |

- **Stack:** WIX (hosting y dominio asumidos *directamente* por el cliente — Aurora no los incluye)
- **Diferenciales declarados:** elementos 3D interactivos, fotografía/B-roll in-house, arquitectura CRO con CTA "Agendar Cita"
- **Demo de referencia:** `auroraainfo.wixsite.com/axia` (subdominio gratuito de Wix)
- **Fortaleza:** Precio de entrada bajo (2.5M único) + propuesta narrativa fuerte ("3D", "vanguardia", "in-house").
- **Debilidad:**
  1. **WIX como plataforma** — limita SEO real, performance, integraciones serias y portabilidad. El cliente queda atrapado en una plataforma de drag-and-drop.
  2. **No incluye agendamiento real** ni chatbot ni portal de pacientes — apenas "integración con WhatsApp Business".
  3. **3D interactivo en WIX** es marketing — en la práctica son embeds de modelos prefabricados, no algo desarrollado a medida.
  4. **Recurrente obligatorio:** $300k/mes son ~$3.6M/año adicionales que el cliente paga **para siempre**, lo cual a 3 años suma $13.3M COP totales por un sitio Wix.
  5. **No cubre i18n, USD, ni ninguna de las necesidades de atención internacional** que el cliente marcó como prioridad.

---

## 2. Comparativa de cobertura vs. necesidades reales del cliente

Mapeamos lo que Janne pidió en el cuestionario contra lo que cada propuesta entrega:

| Requerimiento del cuestionario | Frama | Aurora | Nosotros |
|---|:---:|:---:|:---:|
| Sitio web responsivo + secciones base | ✅ | ✅ | ✅ |
| Agenda de citas en línea (imprescindible) | ⚠️ formulario | ⚠️ WhatsApp | ✅ módulo real |
| Acceso del odontólogo a su agenda desde el celular (imprescindible) | ❌ | ❌ | ✅ |
| Chatbot con IA (importancia 5/5) | ❌ | ❌ | ✅ |
| Sitio en inglés / multidioma | ❌ | ❌ | ✅ |
| Precios en USD para pacientes internacionales | ❌ | ❌ | ✅ |
| Portal de pacientes | ❌ | ⚠️ "fase 2" | ✅ fase 2 real |
| Integración WhatsApp | ⚠️ link | ✅ | ✅ |
| Reseñas Google / Doctoralia | ❌ | ❌ | ✅ |
| Blog / artículos | ✅ | ❌ | ✅ |
| Galería antes/después | ✅ | ✅ | ✅ |
| Newsletter / captura de correos | ❌ | ❌ | ✅ |
| Analítica web (GA, Pixel) | ❌ | ❌ | ✅ |
| SEO técnico real (no solo "tema SEO-friendly") | ⚠️ | ⚠️ | ✅ |
| Performance (Core Web Vitals reales) | ❌ Elementor | ❌ Wix | ✅ Vercel/SSR |
| Propiedad real del código | ⚠️ WP | ❌ Wix | ✅ código propio |

**Lectura:** Ninguna de las dos propuestas cubre los **dos puntos imprescindibles** que Janne marcó textualmente ("agendar cita" y "que el odontólogo tenga acceso a su agenda desde su celular en cualquier momento"), ni el chatbot con IA que calificó 5/5, ni el flujo internacional. Hay una brecha real, no es solo precio.

---

## 3. Posicionamiento y propuesta de valor

### 3.1 Cómo nos diferenciamos

1. **Plataforma seria:** TanStack Start + Vercel + base de datos real, no Wix ni WordPress. Performance, SEO técnico, accesibilidad y propiedad total del código.
2. **Agendamiento real (no formulario):** sistema de citas con calendario, sincronización con Google Calendar del Dr. Francisco — accesible desde su celular en cualquier momento. Esto es el imprescindible #2 del cliente, y nadie más lo ofrece.
3. **Chatbot con IA real:** integrado con la base de servicios y la agenda, atiende fuera de horario, puede pre-agendar y responder precios. Janne lo calificó 5/5 y nadie lo cotizó.
4. **Internacionalización end-to-end:** sitio en ES/EN, precios en USD para pacientes internacionales, sección dedicada al turismo dental.
5. **Iteración visual antes de construir:** entregamos **12 variantes visuales navegables** (4 estilos × 3 paletas) para que Janne elija su dirección visual *antes* de invertir en el desarrollo final. Frama y Aurora cobran sin que el cliente pueda ver el resultado.
6. **Sin lock-in:** el código es de Axia. Si mañana cambia de proveedor, se lo lleva.

### 3.2 Riesgos a mitigar en la conversación con Janne

- **Ancla baja de Aurora ($2.5M):** Janne ya escuchó ese número. Hay que reframear: $2.5M es el costo del sitio Wix; el costo total a 3 años con su mantenimiento obligatorio es ~$13.3M COP **y sigue siendo Wix**. El nuestro es un activo que se valoriza, no un alquiler.
- **Aurora vendió "3D":** podemos neutralizar esto con animaciones reales y un visualizador de tratamientos genuino si es necesario, pero el verdadero diferencial es la **funcionalidad** (agendamiento, chatbot, i18n), no el wow factor visual.
- **Frama ofreció branding:** si Axia ya tiene logo (lo vimos en el deck de Aurora — el logo "AXIA ODONTOLOGÍA by Francisco Díaz" en negro/dorado), no necesita re-branding. Se puede ofrecer refinamiento de marca como add-on opcional.

---

## 4. Estructura de precio recomendada

Estrategia: **entrar por debajo de Aurora con un MVP honesto** y modularizar todo lo demás como add-ons claramente cotizados. Esto nos permite ganar al cliente con un precio competitivo sin comprometer el margen, y abre una conversación recurrente de upgrades.

### Fase 1 — Sitio Base (MVP)

| Concepto | Valor (COP) |
|---|---|
| Demo navegable de 12 variantes visuales (4 estilos × 3 paletas) — entregable inmediato | Incluido |
| Sitio web responsive, ~10 secciones del cuestionario (Inicio, Sobre, Servicios, Equipo, Galería, Testimonios, Blog estático, FAQ, Contacto, Ubicación) | Incluido |
| **i18n bilingüe ES / EN** con switcher en el header (rutas `/es/...` y `/en/...`) — pensado para el target internacional (USA, Canadá, Europa, Latam) | Incluido |
| Integración WhatsApp + formulario de contacto + Google Analytics | Incluido |
| SEO técnico (meta tags, sitemap, schema dental clinic, Open Graph) | Incluido |
| Deploy en Vercel + configuración de dominio | Incluido |
| **Total pago único** | **2.000.000** |
| **Mantenimiento mensual** (cambios de contenido, monitoreo, actualizaciones de seguridad) | **300.000 / mes** |

> **Nota sobre el hosting:** Vercel es gratuito en el tier Hobby para sitios sin tráfico crítico. El dominio (~$50.000 COP/año en .com) es a cargo del cliente. Esto es una ventaja vs. Aurora, donde el cliente paga Wix además del fee mensual.

### Fase 2 — Módulos de Desarrollo Futuro (cotizados aparte cuando el cliente los pida)

| Módulo | Valor estimado (COP) |
|---|---|
| Agendamiento real + sincronización con Google Calendar del Dr. Francisco (acceso desde el celular) | 2.000.000 |
| Chatbot con IA (FAQs, info de servicios, pre-agendamiento, atención fuera de horario) | 1.500.000 |
| Precios en USD y flujo de pacientes internacionales (turismo dental, coordinación de viajes) | 800.000 |
| Portal de pacientes (área privada, historia clínica básica) | A cotizar |
| Tienda en línea / portal de pagos | A cotizar |

### Por qué este esquema gana

- **Entra por debajo de Aurora** ($2M vs $2.5M único) y muy por debajo de Frama ($2M vs $9.8M). Es el precio más bajo del mercado para Janne.
- **Mantenimiento idéntico al de Aurora** ($300k/mes), pero sobre código propio en Vercel, no sobre Wix.
- **Ningún competidor incluye una demo de 12 variantes navegables.** Esto es el cierre emocional: convierte la decisión de "¿en quién confío?" a "¿cuál me gusta más?".
- **Los imprescindibles del cliente (agendamiento + acceso móvil del doctor + chatbot) quedan claramente identificados como Fase 2.** Esto es honesto y crea un pipeline de venta natural — el cliente sabe que esos features existen, sabe cuánto cuestan, y puede contratarlos cuando esté listo. Aurora y Frama ni siquiera los mencionan.
- **Sin lock-in:** el cliente es dueño del código. A 3 años con mantenimiento, el costo total es $2M + $10.8M = $12.8M — *idéntico* a Aurora, pero entregando un sitio real y dejando la puerta abierta a sumar módulos en lugar de empezar desde cero.

### Riesgo y mitigación

A $2M únicos, el margen del MVP es ajustado (~$80 USD/semana de trabajo si tomamos 5 semanas). Esto se compensa con:
1. **Reutilización de la demo:** las 12 variantes ya son ~30% del trabajo del sitio final.
2. **Recurrente real:** $300k/mes × 12 meses = $3.6M/año, que cubren con holgura el costo de mantenimiento real.
3. **Pipeline de Fase 2:** los módulos add-on son donde está el margen real ($4.5M+ adicionales si el cliente activa los tres principales).

---

## 5. Próximos pasos

1. ✅ Análisis competitivo (este documento).
2. ⏭️ Construcción de la demo navegable: 4 plantillas (una por familia visual) × 3 paletas = 12 rutas.
3. ⏭️ Presentación a Janne: demo + propuesta económica (Opción A como recomendada, B como fallback).
4. ⏭️ Iteración visual con el cliente sobre la variante elegida.
5. ⏭️ Desarrollo del sitio final + agendamiento + chatbot + i18n.

---

## Apéndice: archivos fuente

- `../business-research/docs/quotes/Axia Odontología-Cotización-Marketing.pdf` — Frama Interactivo
- `../business-research/docs/quotes/PROPUESTA AXIA ODONTOLOGIA.pdf` — Aurora (slides)
- `../business-research/docs/quotes/Propuesta de Estrategia y Desarrollo Digital.pdf` — Aurora (documento)
- `../business-research/index.html` — formulario de exploración de negocio
