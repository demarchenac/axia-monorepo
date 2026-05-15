import { v } from "convex/values";
import { internalAction } from "../_generated/server";

export const sendWhatsAppMessage = internalAction({
  args: {
    to: v.string(),
    body: v.string(),
  },
  handler: async (_ctx, args) => {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      console.error("Meta WhatsApp credentials not configured");
      return;
    }

    const url = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: args.to,
        type: "text",
        text: { body: args.body },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Meta WhatsApp API error:", error);
      throw new Error(`Meta WhatsApp API error: ${response.status}`);
    }
  },
});
