import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function syncPresetCopy(ctx: any, pageId: Id<"tenantPages">) {
  const page = await ctx.db.get(pageId);
  if (!page) return;

  const activeTokens = await ctx.db
    .query("designTokens")
    .withIndex("by_tenant_active", (q: any) =>
      q.eq("tenantId", page.tenantId).eq("isActive", true),
    )
    .first();
  if (!activeTokens?.basedOnPresetSlug) return;

  const copy = await ctx.db
    .query("presetCopies")
    .withIndex("by_tenant_preset", (q: any) =>
      q.eq("tenantId", page.tenantId).eq("presetSlug", activeTokens.basedOnPresetSlug),
    )
    .first();
  if (!copy) return;

  const sections = await ctx.db
    .query("pageSections")
    .withIndex("by_page_order", (q: any) => q.eq("pageId", pageId))
    .collect();

  await ctx.db.patch(copy._id, {
    sections: sections
      .sort((a: any, b: any) => a.order - b.order)
      .map((s: any) => ({
        type: s.type,
        variant: s.variant,
        order: s.order,
        content: s.content,
        visible: s.visible,
      })),
    updatedAt: Date.now(),
  });
}

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
      await syncPresetCopy(ctx, args.pageId);
      return args.sectionId;
    }

    const id = await ctx.db.insert("pageSections", {
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
    await syncPresetCopy(ctx, args.pageId);
    return id;
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
    if (sectionIds.length > 0) {
      const first = await ctx.db.get(sectionIds[0]);
      if (first) await syncPresetCopy(ctx, first.pageId);
    }
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
    await syncPresetCopy(ctx, section.pageId);
  },
});

export const deleteSection = mutation({
  args: { sectionId: v.id("pageSections") },
  handler: async (ctx, { sectionId }) => {
    const section = await ctx.db.get(sectionId);
    const pageId = section?.pageId;
    await ctx.db.delete(sectionId);
    if (pageId) await syncPresetCopy(ctx, pageId);
  },
});

export const updateSectionContent = mutation({
  args: {
    sectionId: v.id("pageSections"),
    content: v.any(),
  },
  handler: async (ctx, { sectionId, content }) => {
    await ctx.db.patch(sectionId, { content, updatedAt: Date.now() });
  },
});

export const updateSectionVariant = mutation({
  args: {
    sectionId: v.id("pageSections"),
    variant: v.string(),
  },
  handler: async (ctx, { sectionId, variant }) => {
    await ctx.db.patch(sectionId, { variant, updatedAt: Date.now() });
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
