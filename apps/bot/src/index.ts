import { Hono } from "hono";
import { healthRoute } from "./routes/health";
import { webhookRoute } from "./routes/webhook";

type Bindings = {
  CONVEX_URL: string;
  META_ACCESS_TOKEN: string;
  META_APP_SECRET: string;
  META_VERIFY_TOKEN: string;
  WHATSAPP_PHONE_NUMBER_ID: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.route("/health", healthRoute);
app.route("/webhook", webhookRoute);

export default app;
