import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getByIndustry = query({
  args: { industry: v.string() },
  handler: async (ctx, { industry }) => {
    return ctx.db
      .query("previewPresets")
      .withIndex("by_industry_active", (q) =>
        q.eq("industry", industry).eq("active", true),
      )
      .collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const applyToTenant = mutation({
  args: {
    tenantId: v.id("tenants"),
    presetSlug: v.string(),
  },
  handler: async (ctx, { tenantId, presetSlug }) => {
    const preset = await ctx.db
      .query("previewPresets")
      .withIndex("by_slug", (q) => q.eq("slug", presetSlug))
      .first();
    if (!preset) throw new Error("Preset not found");

    const now = Date.now();

    const existingPage = await ctx.db
      .query("tenantPages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();

    let pageId: Id<"tenantPages">;
    if (existingPage) {
      pageId = existingPage._id;
      const existingSections = await ctx.db
        .query("pageSections")
        .withIndex("by_page_order", (q) => q.eq("pageId", pageId))
        .collect();
      await Promise.all(existingSections.map((s) => ctx.db.delete(s._id)));
      await ctx.db.patch(pageId, { updatedAt: now });
    } else {
      pageId = await ctx.db.insert("tenantPages", {
        tenantId,
        slug: "home",
        createdAt: now,
        updatedAt: now,
      });
    }

    for (const comp of preset.sectionComposition) {
      let content = {};
      if (comp.contentKey) {
        const seed = await ctx.db
          .query("seedContent")
          .withIndex("by_industry_section_key", (q) =>
            q
              .eq("industry", preset.industry)
              .eq("sectionType", comp.type)
              .eq("contentKey", comp.contentKey!),
          )
          .first();
        if (seed) content = seed.content;
      }

      await ctx.db.insert("pageSections", {
        pageId,
        type: comp.type,
        variant: comp.variant,
        order: comp.order,
        content,
        visible: true,
        createdAt: now,
        updatedAt: now,
      });
    }

    await ctx.db.insert("tenantPreviews", {
      tenantId,
      presetSlug,
      status: "selected",
      selectedAt: now,
      createdAt: now,
    });

    return pageId;
  },
});
