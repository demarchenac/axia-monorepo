import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("tenants").collect();
  },
});

const tenantStatus = v.union(
  v.literal("prospect"),
  v.literal("trial"),
  v.literal("active"),
  v.literal("past_due"),
  v.literal("cancelled"),
  v.literal("churned"),
);

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    industry: v.string(),
    email: v.string(),
    phone: v.string(),
    country: v.string(),
    defaultLocale: v.string(),
    enabledLocales: v.array(v.string()),
    status: tenantStatus,
    tagline: v.optional(v.any()),
    description: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) throw new Error(`Slug "${args.slug}" already exists`);

    const now = Date.now();
    return ctx.db.insert("tenants", {
      ...args,
      hasRealLogo: false,
      hasRealPhotos: false,
      reviewRequestsEnabled: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const generatePreviewToken = mutation({
  args: { id: v.id("tenants") },
  handler: async (ctx, { id }) => {
    const token = Array.from(crypto.getRandomValues(new Uint8Array(24)))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    await ctx.db.patch(id, {
      previewToken: token,
      previewRevokedAt: undefined,
      previewRevokedReason: undefined,
      updatedAt: Date.now(),
    });
    return token;
  },
});

export const revokePreviewToken = mutation({
  args: { id: v.id("tenants") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, {
      previewToken: undefined,
      previewRevokedAt: Date.now(),
      previewRevokedReason: "manual",
      updatedAt: Date.now(),
    });
  },
});

export const validatePreviewToken = query({
  args: { slug: v.string(), token: v.string() },
  handler: async (ctx, { slug, token }) => {
    const tenant = await ctx.db
      .query("tenants")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (!tenant) return null;
    if (tenant.previewToken !== token) return null;
    return tenant;
  },
});

const taxRegime = v.union(
  v.literal("simplificado"),
  v.literal("comun"),
  v.literal("no_responsable_iva"),
  v.literal("gran_contribuyente"),
  v.literal("other"),
);

export const update = mutation({
  args: {
    id: v.id("tenants"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    industry: v.optional(v.string()),
    country: v.optional(v.string()),
    status: v.optional(tenantStatus),
    defaultLocale: v.optional(v.string()),
    enabledLocales: v.optional(v.array(v.string())),
    hasRealLogo: v.optional(v.boolean()),
    hasRealPhotos: v.optional(v.boolean()),
    reviewRequestsEnabled: v.optional(v.boolean()),
    tagline: v.optional(v.any()),
    description: v.optional(v.any()),
    logoUrl: v.optional(v.string()),
    primaryColor: v.optional(v.string()),
    headerVariant: v.optional(v.string()),
    footerVariant: v.optional(v.string()),
    legalName: v.optional(v.string()),
    nit: v.optional(v.string()),
    taxRegime: v.optional(taxRegime),
    economicActivityCode: v.optional(v.string()),
    legalRepresentative: v.optional(
      v.object({
        name: v.string(),
        documentType: v.string(),
        documentNumber: v.string(),
      }),
    ),
  },
  handler: async (ctx, { id, ...fields }) => {
    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: Date.now() });
  },
});
