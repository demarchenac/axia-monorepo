import { v } from "convex/values";
import { internalAction } from "../_generated/server";
import { internal } from "../_generated/api";

// TODO: Import and configure when Vercel AI SDK is installed
// import { generateText } from "ai";
// import { google } from "@ai-sdk/google";

// System prompt is inlined here — the .md file is the source of truth for editing,
// but Convex runtime doesn't support raw file imports.
// TODO: Keep in sync with system-prompt.md or load from Convex storage
const SYSTEM_PROMPT_PLACEHOLDER = "See convex/bot/system-prompt.md";

const TIMEOUT_MS = 15_000;

export const processMessage = internalAction({
  args: {
    conversationId: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    // Load conversation and messages
    const conversation = await ctx.runQuery(
      internal.bot.queries.getConversation,
      { conversationId: args.conversationId },
    );
    if (!conversation) return;

    const messages = await ctx.runQuery(
      internal.bot.queries.getMessages,
      { conversationId: args.conversationId },
    );

    // Build message history for Gemini
    const chatMessages = messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    let responseText: string;

    try {
      // TODO: Replace with actual Vercel AI SDK call when configured
      // const { text } = await Promise.race([
      //   generateText({
      //     model: google("gemini-2.5-flash-preview-04-17"),
      //     system: systemPrompt,
      //     messages: chatMessages,
      //     tools: botTools,
      //   }),
      //   new Promise<never>((_, reject) =>
      //     setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
      //   ),
      // ]);
      // responseText = text;

      responseText =
        "Hola, soy el asistente de Axia Odontologia. Estoy en modo de prueba. Pronto podre ayudarte a agendar citas.";
    } catch (error) {
      if (error instanceof Error && error.message === "timeout") {
        responseText =
          "Disculpa, estoy teniendo dificultades en este momento. ¿Podrias intentar de nuevo en un momento?";
      } else {
        console.error("Error processing message:", error);
        responseText =
          "Lo siento, ocurrio un error. Por favor intenta de nuevo.";
      }
    }

    // Save assistant response
    await ctx.runMutation(internal.bot.queries.saveMessage, {
      conversationId: args.conversationId,
      role: "assistant",
      content: responseText,
    });

    // Send response via appropriate channel
    if (conversation.channel === "whatsapp" && conversation.phone) {
      await ctx.runAction(internal.bot.twilio.sendWhatsAppMessage, {
        to: conversation.phone,
        body: responseText,
      });
    }
  },
});
