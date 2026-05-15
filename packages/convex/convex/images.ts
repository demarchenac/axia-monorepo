import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation(async (ctx) => {
  return ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
  args: {
    tenantId: v.id("tenants"),
    storageId: v.id("_storage"),
    category: v.string(),
  },
  handler: async (ctx, { tenantId, storageId, category }) => {
    const url = await ctx.storage.getUrl(storageId);
    if (!url) throw new Error("Failed to get storage URL");

    const existing = await ctx.db
      .query("tenantImages")
      .withIndex("by_tenant_category", (q) =>
        q.eq("tenantId", tenantId).eq("category", category),
      )
      .collect();

    return ctx.db.insert("tenantImages", {
      tenantId,
      url,
      utfsKey: storageId,
      category,
      order: existing.length,
      uploadedAt: Date.now(),
    });
  },
});

export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, { tenantId }) => {
    return ctx.db
      .query("tenantImages")
      .withIndex("by_tenant_category", (q) => q.eq("tenantId", tenantId))
      .collect();
  },
});

export const deleteImage = mutation({
  args: { imageId: v.id("tenantImages") },
  handler: async (ctx, { imageId }) => {
    const image = await ctx.db.get(imageId);
    if (!image) return;
    await ctx.storage.delete(image.utfsKey as any);
    await ctx.db.delete(imageId);
  },
});
