import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getActive = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, { tenantId }) => {
    return ctx.db
      .query("designTokens")
      .withIndex("by_tenant_active", (q) =>
        q.eq("tenantId", tenantId).eq("isActive", true),
      )
      .first();
  },
});

export const upsert = mutation({
  args: {
    tenantId: v.id("tenants"),
    name: v.string(),
    tokens: v.any(),
    basedOnPresetSlug: v.optional(v.string()),
  },
  handler: async (ctx, { tenantId, name, tokens, basedOnPresetSlug }) => {
    const now = Date.now();

    const existing = await ctx.db
      .query("designTokens")
      .withIndex("by_tenant_active", (q) =>
        q.eq("tenantId", tenantId).eq("isActive", true),
      )
      .collect();

    await Promise.all(
      existing.map((t) =>
        ctx.db.patch(t._id, { isActive: false, updatedAt: now }),
      ),
    );

    return ctx.db.insert("designTokens", {
      tenantId,
      name,
      tokens,
      isActive: true,
      basedOnPresetSlug,
      createdAt: now,
      updatedAt: now,
    });
  },
});
