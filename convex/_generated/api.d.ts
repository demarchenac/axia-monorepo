/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as bot_chat from "../bot/chat.js";
import type * as bot_process from "../bot/process.js";
import type * as bot_queries from "../bot/queries.js";
import type * as bot_tools from "../bot/tools.js";
import type * as bot_twilio from "../bot/twilio.js";
import type * as calendar_index from "../calendar/index.js";
import type * as cleanup from "../cleanup.js";
import type * as designTokens from "../designTokens.js";
import type * as pages from "../pages.js";
import type * as presets from "../presets.js";
import type * as seed from "../seed.js";
import type * as seedPresets from "../seedPresets.js";
import type * as tenants from "../tenants.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "bot/chat": typeof bot_chat;
  "bot/process": typeof bot_process;
  "bot/queries": typeof bot_queries;
  "bot/tools": typeof bot_tools;
  "bot/twilio": typeof bot_twilio;
  "calendar/index": typeof calendar_index;
  cleanup: typeof cleanup;
  designTokens: typeof designTokens;
  pages: typeof pages;
  presets: typeof presets;
  seed: typeof seed;
  seedPresets: typeof seedPresets;
  tenants: typeof tenants;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
