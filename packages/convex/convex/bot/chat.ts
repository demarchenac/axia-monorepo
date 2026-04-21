import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { internal } from "../_generated/api";

export const handleIncoming = mutation({
  args: {
    tenantId: v.id("tenants"),
    channel: v.union(v.literal("whatsapp"), v.literal("web")),
    channelId: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();

    let conversation = await ctx.db
      .query("conversations")
      .withIndex("by_channelId", (q) =>
        q.eq("channel", args.channel).eq("channelId", args.channelId),
      )
      .unique();

    if (!conversation) {
      const conversationId = await ctx.db.insert("conversations", {
        tenantId: args.tenantId,
        channel: args.channel,
        channelId: args.channelId,
        phone: args.channel === "whatsapp" ? args.channelId : undefined,
        flaggedForHuman: false,
        createdAt: now,
        updatedAt: now,
      });
      conversation = (await ctx.db.get(conversationId))!;
    }

    await ctx.db.insert("messages", {
      conversationId: conversation._id,
      role: "user",
      content: args.content,
      createdAt: now,
    });

    // Schedule async processing
    await ctx.scheduler.runAfter(0, internal.bot.process.processMessage, {
      conversationId: conversation._id,
    });

    return { conversationId: conversation._id };
  },
});
