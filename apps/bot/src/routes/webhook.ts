import { Hono } from "hono";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@talvu/db";

type Bindings = {
  CONVEX_URL: string;
  META_APP_SECRET: string;
  META_VERIFY_TOKEN: string;
};

const webhook = new Hono<{ Bindings: Bindings }>();

webhook.get("/meta", async (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token === c.env.META_VERIFY_TOKEN) {
    return c.text(challenge ?? "", 200);
  }
  return c.text("Forbidden", 403);
});

webhook.post("/meta", async (c) => {
  const body = await c.req.json();

  if (body.object !== "whatsapp_business_account") {
    return c.text("Not a WhatsApp event", 200);
  }

  const convex = new ConvexHttpClient(c.env.CONVEX_URL);

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      if (change.field !== "messages") continue;
      const value = change.value;
      const phoneNumberId = value?.metadata?.phone_number_id;

      for (const message of value?.messages ?? []) {
        if (message.type !== "text") continue;

        const from = message.from;
        const text = message.text?.body;
        if (!from || !text) continue;

        const tenant = await convex.query(
          api.tenants.getByWhatsAppPhoneNumberId,
          { phoneNumberId: phoneNumberId ?? "" },
        );

        if (!tenant) {
          console.warn(`No tenant for phone_number_id: ${phoneNumberId}`);
          continue;
        }

        await convex.mutation(api.bot.chat.handleIncoming, {
          tenantId: tenant._id,
          channel: "whatsapp",
          channelId: from,
          content: text,
        });
      }
    }
  }

  return c.text("OK", 200);
});

export { webhook as webhookRoute };
