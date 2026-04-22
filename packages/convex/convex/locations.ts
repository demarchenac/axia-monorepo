import { query, mutation } from "./_generated/server";
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

const openingHourEntry = v.object({
  dayOfWeek,
  opens: v.string(),
  closes: v.string(),
  closedForLunch: v.optional(
    v.object({ from: v.string(), to: v.string() }),
  ),
});

const addressObj = v.object({
  street: v.string(),
  city: v.string(),
  state: v.optional(v.string()),
  country: v.string(),
  postalCode: v.optional(v.string()),
});

export const listByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, { tenantId }) => {
    return ctx.db
      .query("tenantLocations")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const getById = query({
  args: { id: v.id("tenantLocations") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.any(),
    slug: v.string(),
    isPrimary: v.boolean(),
    address: addressObj,
    geo: v.optional(v.object({ lat: v.number(), lng: v.number() })),
    phone: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    openingHours: v.array(openingHourEntry),
    timezone: v.string(),
    googlePlaceId: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    facebookPageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.isPrimary) {
      const existing = await ctx.db
        .query("tenantLocations")
        .withIndex("by_tenant", (q) => q.eq("tenantId", args.tenantId))
        .collect();
      for (const loc of existing) {
        if (loc.isPrimary) {
          await ctx.db.patch(loc._id, { isPrimary: false, updatedAt: now });
        }
      }
    }

    return ctx.db.insert("tenantLocations", {
      ...args,
      active: true,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("tenantLocations"),
    name: v.optional(v.any()),
    slug: v.optional(v.string()),
    isPrimary: v.optional(v.boolean()),
    address: v.optional(addressObj),
    geo: v.optional(v.object({ lat: v.number(), lng: v.number() })),
    phone: v.optional(v.string()),
    whatsappNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    openingHours: v.optional(v.array(openingHourEntry)),
    timezone: v.optional(v.string()),
    googlePlaceId: v.optional(v.string()),
    instagramHandle: v.optional(v.string()),
    facebookPageUrl: v.optional(v.string()),
    active: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    const now = Date.now();

    if (fields.isPrimary) {
      const loc = await ctx.db.get(id);
      if (loc) {
        const siblings = await ctx.db
          .query("tenantLocations")
          .withIndex("by_tenant", (q) => q.eq("tenantId", loc.tenantId))
          .collect();
        for (const s of siblings) {
          if (s._id !== id && s.isPrimary) {
            await ctx.db.patch(s._id, { isPrimary: false, updatedAt: now });
          }
        }
      }
    }

    const filtered = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined),
    );
    await ctx.db.patch(id, { ...filtered, updatedAt: now });
  },
});

export const remove = mutation({
  args: { id: v.id("tenantLocations") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
