import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const dayOfWeek = v.union(
  v.literal("Monday"),
  v.literal("Tuesday"),
  v.literal("Wednesday"),
  v.literal("Thursday"),
  v.literal("Friday"),
  v.literal("Saturday"),
  v.literal("Sunday"),
);

export default defineSchema({
  // ─────────────────────────────────────────────────
  // TENANTS
  // ─────────────────────────────────────────────────

  tenants: defineTable({
    name: v.string(),
    slug: v.string(),
    legalName: v.optional(v.string()),
    tagline: v.optional(v.any()),
    description: v.optional(v.any()),
    industry: v.string(),

    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    headerVariant: v.optional(v.string()),
    footerVariant: v.optional(v.string()),

    email: v.string(),
    phone: v.string(),

    enabledLocales: v.array(v.string()),
    defaultLocale: v.string(),

    country: v.string(),
    nit: v.optional(v.string()),
    legalRepresentative: v.optional(
      v.object({
        name: v.string(),
        documentType: v.string(),
        documentNumber: v.string(),
      }),
    ),
    taxRegime: v.optional(
      v.union(
        v.literal("simplificado"),
        v.literal("comun"),
        v.literal("no_responsable_iva"),
        v.literal("gran_contribuyente"),
        v.literal("other"),
      ),
    ),
    economicActivityCode: v.optional(v.string()),
    healthRegistries: v.optional(
      v.array(
        v.object({
          type: v.string(),
          number: v.string(),
          validFrom: v.optional(v.string()),
          validUntil: v.optional(v.string()),
        }),
      ),
    ),
    taxInfo: v.optional(v.any()),

    status: v.union(
      v.literal("prospect"),
      v.literal("trial"),
      v.literal("active"),
      v.literal("past_due"),
      v.literal("cancelled"),
      v.literal("churned"),
    ),
    trialEndsAt: v.optional(v.number()),
    onboardingStep: v.optional(v.number()),
    onboardingCompletedAt: v.optional(v.number()),

    workosOrgId: v.optional(v.string()),

    customDomain: v.optional(v.string()),
    customDomainStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("active"),
        v.literal("failed"),
      ),
    ),

    previewToken: v.optional(v.string()),
    previewData: v.optional(v.any()),
    previewRevokedAt: v.optional(v.number()),
    previewRevokedReason: v.optional(v.string()),

    wompiPublicKey: v.optional(v.string()),
    wompiPrivateKeyEncrypted: v.optional(v.string()),
    wompiEventSecret: v.optional(v.string()),

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
    name: v.any(),
    slug: v.string(),
    isPrimary: v.boolean(),

    address: v.object({
      street: v.string(),
      city: v.string(),
      state: v.optional(v.string()),
      country: v.string(),
      postalCode: v.optional(v.string()),
    }),
    geo: v.optional(
      v.object({
        lat: v.number(),
        lng: v.number(),
      }),
    ),

    phone: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    email: v.optional(v.string()),

    openingHours: v.array(
      v.object({
        dayOfWeek,
        opens: v.string(),
        closes: v.string(),
        closedForLunch: v.optional(
          v.object({
            from: v.string(),
            to: v.string(),
          }),
        ),
      }),
    ),
    timezone: v.string(),

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
    workosOrgId: v.optional(v.string()),
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
    tenantId: v.optional(v.id("tenants")),
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
    userId: v.optional(v.id("users")),
    name: v.string(),
    specialty: v.any(),
    bio: v.optional(v.any()),
    photoUrl: v.optional(v.string()),
    calendarId: v.string(),
    locationSchedules: v.optional(
      v.array(
        v.object({
          locationId: v.id("tenantLocations"),
          weeklyHours: v.array(
            v.object({
              dayOfWeek,
              startTime: v.string(),
              endTime: v.string(),
            }),
          ),
        }),
      ),
    ),
    active: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_tenant", ["tenantId"])
    .index("by_user", ["userId"]),

  services: defineTable({
    tenantId: v.id("tenants"),
    locationIds: v.optional(v.array(v.id("tenantLocations"))),
    slug: v.string(),
    name: v.any(),
    shortDescription: v.any(),
    longDescription: v.optional(v.any()),
    category: v.optional(v.any()),
    priceCOP: v.number(),
    priceUSD: v.optional(v.number()),
    duration: v.number(),
    specialistIds: v.array(v.id("specialists")),
    faq: v.optional(
      v.array(
        v.object({
          question: v.any(),
          answer: v.any(),
        }),
      ),
    ),
    seoTitle: v.optional(v.any()),
    seoDescription: v.optional(v.any()),
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
    phone: v.string(),
    email: v.optional(v.string()),
    cedula: v.optional(v.string()),
    userId: v.optional(v.id("users")),
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
    locationId: v.id("tenantLocations"),
    patientId: v.id("patients"),
    serviceId: v.id("services"),
    specialistId: v.id("specialists"),
    datetime: v.number(),
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
    channelId: v.string(),
    phone: v.optional(v.string()),
    patientId: v.optional(v.id("patients")),
    language: v.optional(v.string()),
    historySummary: v.optional(v.string()),
    lastSummarizedAt: v.optional(v.number()),
    flaggedForHuman: v.boolean(),
    flaggedReason: v.optional(v.string()),
    flaggedUrgency: v.optional(
      v.union(v.literal("normal"), v.literal("urgent")),
    ),
    flaggedAt: v.optional(v.number()),
    resolvedByUserId: v.optional(v.id("users")),
    resolvedAt: v.optional(v.number()),
    previousChannels: v.optional(
      v.array(
        v.object({
          channel: v.string(),
          channelId: v.string(),
          mergedAt: v.number(),
        }),
      ),
    ),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_channelId", ["channel", "channelId"])
    .index("by_phone", ["phone"])
    .index("by_tenant_flagged", ["tenantId", "flaggedForHuman"]),

  messages: defineTable({
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system"),
    ),
    content: v.string(),
    toolCalls: v.optional(v.array(v.any())),
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  // ─────────────────────────────────────────────────
  // PAGES + SECTIONS (page builder)
  // ─────────────────────────────────────────────────

  tenantPages: defineTable({
    tenantId: v.id("tenants"),
    slug: v.literal("home"),
    seoTitle: v.optional(v.any()),
    seoDescription: v.optional(v.any()),
    seoOgImageUrl: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_tenant", ["tenantId"]),

  pageSections: defineTable({
    pageId: v.id("tenantPages"),
    type: v.string(),
    variant: v.string(),
    order: v.number(),
    content: v.any(),
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
    slug: v.string(),
    name: v.any(),
    description: v.any(),
    industry: v.string(),
    familia: v.string(),
    tokens: v.any(),
    sectionComposition: v.array(
      v.object({
        type: v.string(),
        variant: v.string(),
        order: v.number(),
        contentKey: v.optional(v.string()),
      }),
    ),
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
    customTokens: v.optional(v.any()),
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
    industry: v.string(),
    sectionType: v.string(),
    contentKey: v.string(),
    content: v.any(),
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
    tone: v.optional(
      v.union(
        v.literal("warm"),
        v.literal("cool"),
        v.literal("neutral"),
        v.literal("dark"),
        v.literal("bright"),
      ),
    ),
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
    tokens: v.any(),
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
  }).index("by_tenant_category", ["tenantId", "category"]),

  // ─────────────────────────────────────────────────
  // BLOG (post-demo)
  // ─────────────────────────────────────────────────

  blogPosts: defineTable({
    tenantId: v.id("tenants"),
    slug: v.string(),
    authorId: v.id("users"),
    title: v.any(),
    excerpt: v.any(),
    content: v.any(),
    coverImageUrl: v.optional(v.string()),
    coverImageAlt: v.optional(v.any()),
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
    name: v.any(),
    description: v.optional(v.any()),
    order: v.number(),
  }).index("by_tenant_slug", ["tenantId", "slug"]),

  // ─────────────────────────────────────────────────
  // PRODUCTS + ORDERS (eCommerce, post-demo)
  // ─────────────────────────────────────────────────

  products: defineTable({
    tenantId: v.id("tenants"),
    locationIds: v.optional(v.array(v.id("tenantLocations"))),
    slug: v.string(),
    name: v.any(),
    description: v.any(),
    priceCOP: v.number(),
    priceUSD: v.optional(v.number()),
    sku: v.optional(v.string()),
    category: v.optional(v.string()),
    isDigital: v.boolean(),
    imageUrls: v.array(v.string()),
    stockByLocation: v.optional(
      v.array(
        v.object({
          locationId: v.id("tenantLocations"),
          quantity: v.number(),
        }),
      ),
    ),
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
    shippingAddress: v.optional(
      v.object({
        street: v.string(),
        city: v.string(),
        state: v.optional(v.string()),
        country: v.string(),
        postalCode: v.optional(v.string()),
      }),
    ),
    items: v.array(
      v.object({
        productId: v.id("products"),
        quantity: v.number(),
        unitPriceCOP: v.number(),
      }),
    ),
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
    paymentReference: v.optional(v.string()),
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
  // SUBSCRIPTIONS + MODULE USAGE
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
    activeModules: v.array(v.string()),
    bundleKey: v.optional(v.string()),
    addons: v.array(
      v.object({
        key: v.string(),
        quantity: v.number(),
        addedAt: v.number(),
      }),
    ),
    billingCycle: v.union(v.literal("monthly"), v.literal("annual")),
    currentPeriodStart: v.number(),
    currentPeriodEnd: v.number(),
    trialEndsAt: v.optional(v.number()),
    cancelAtPeriodEnd: v.boolean(),
    autoOverage: v.boolean(),
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
    metric: v.string(),
    period: v.string(),
    count: v.number(),
    capacity: v.number(),
    overageQuantity: v.number(),
  })
    .index("by_tenant_period", ["tenantId", "period"])
    .index("by_tenant_module_period", ["tenantId", "moduleKey", "period"]),

  // ─────────────────────────────────────────────────
  // INVITATIONS / REVIEWS / GBP
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
    items: v.array(
      v.object({
        key: v.string(),
        status: v.union(
          v.literal("ok"),
          v.literal("warning"),
          v.literal("error"),
        ),
        lastCheckedAt: v.number(),
        note: v.optional(v.string()),
      }),
    ),
  }).index("by_location", ["tenantLocationId"]),
});
