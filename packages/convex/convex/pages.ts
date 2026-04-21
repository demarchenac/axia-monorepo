import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getByTenant = query({
  args: { tenantId: v.id("tenants") },
  handler: async (ctx, { tenantId }) => {
    const page = await ctx.db
      .query("tenantPages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();
    if (!page) return null;

    const sections = await ctx.db
      .query("pageSections")
      .withIndex("by_page_order", (q) => q.eq("pageId", page._id))
      .collect();

    return { ...page, sections: sections.sort((a, b) => a.order - b.order) };
  },
});

export const getSections = query({
  args: { pageId: v.id("tenantPages") },
  handler: async (ctx, { pageId }) => {
    const sections = await ctx.db
      .query("pageSections")
      .withIndex("by_page_visible", (q) =>
        q.eq("pageId", pageId).eq("visible", true),
      )
      .collect();

    return sections.sort((a, b) => a.order - b.order);
  },
});

export const createPage = mutation({
  args: {
    tenantId: v.id("tenants"),
    seoTitle: v.optional(v.any()),
    seoDescription: v.optional(v.any()),
  },
  handler: async (ctx, { tenantId, seoTitle, seoDescription }) => {
    const existing = await ctx.db
      .query("tenantPages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();
    if (existing) throw new Error("Page already exists for this tenant");

    const now = Date.now();
    return ctx.db.insert("tenantPages", {
      tenantId,
      slug: "home",
      seoTitle,
      seoDescription,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const upsertSection = mutation({
  args: {
    pageId: v.id("tenantPages"),
    sectionId: v.optional(v.id("pageSections")),
    type: v.string(),
    variant: v.string(),
    order: v.number(),
    content: v.any(),
    visible: v.optional(v.boolean()),
    hiddenOnLocales: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    if (args.sectionId) {
      await ctx.db.patch(args.sectionId, {
        type: args.type,
        variant: args.variant,
        order: args.order,
        content: args.content,
        visible: args.visible ?? true,
        hiddenOnLocales: args.hiddenOnLocales,
        updatedAt: now,
      });
      return args.sectionId;
    }

    return ctx.db.insert("pageSections", {
      pageId: args.pageId,
      type: args.type,
      variant: args.variant,
      order: args.order,
      content: args.content,
      visible: args.visible ?? true,
      hiddenOnLocales: args.hiddenOnLocales,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const reorderSections = mutation({
  args: {
    sectionIds: v.array(v.id("pageSections")),
  },
  handler: async (ctx, { sectionIds }) => {
    const now = Date.now();
    await Promise.all(
      sectionIds.map((id, index) =>
        ctx.db.patch(id, { order: index, updatedAt: now }),
      ),
    );
  },
});

export const toggleVisibility = mutation({
  args: { sectionId: v.id("pageSections") },
  handler: async (ctx, { sectionId }) => {
    const section = await ctx.db.get(sectionId);
    if (!section) throw new Error("Section not found");
    await ctx.db.patch(sectionId, {
      visible: !section.visible,
      updatedAt: Date.now(),
    });
  },
});

export const deleteSection = mutation({
  args: { sectionId: v.id("pageSections") },
  handler: async (ctx, { sectionId }) => {
    await ctx.db.delete(sectionId);
  },
});

export const applyFullPage = mutation({
  args: {
    tenantId: v.id("tenants"),
    sections: v.array(
      v.object({
        type: v.string(),
        variant: v.string(),
        order: v.number(),
        content: v.any(),
        visible: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, { tenantId, sections }) => {
    const now = Date.now();

    let page = await ctx.db
      .query("tenantPages")
      .withIndex("by_tenant", (q) => q.eq("tenantId", tenantId))
      .first();

    if (page) {
      const existing = await ctx.db
        .query("pageSections")
        .withIndex("by_page_order", (q) => q.eq("pageId", page!._id))
        .collect();
      await Promise.all(existing.map((s) => ctx.db.delete(s._id)));
      await ctx.db.patch(page._id, { updatedAt: now });
    } else {
      const pageId = await ctx.db.insert("tenantPages", {
        tenantId,
        slug: "home",
        createdAt: now,
        updatedAt: now,
      });
      page = (await ctx.db.get(pageId))!;
    }

    for (const s of sections) {
      await ctx.db.insert("pageSections", {
        pageId: page._id,
        type: s.type,
        variant: s.variant,
        order: s.order,
        content: s.content,
        visible: s.visible,
        createdAt: now,
        updatedAt: now,
      });
    }

    return page._id;
  },
});
