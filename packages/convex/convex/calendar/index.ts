import { v } from "convex/values";
import { internalAction } from "../_generated/server";

// Google Calendar API helpers using Service Account
// Requires GOOGLE_SERVICE_ACCOUNT_KEY env var in Convex

async function getAccessToken(): Promise<string> {
  const keyJson = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!keyJson) throw new Error("GOOGLE_SERVICE_ACCOUNT_KEY not configured");

  // TODO: Implement JWT signing for service account auth
  // For now, this is a placeholder — will use googleapis or manual JWT
  // when the Google Calendar integration is fully wired up
  throw new Error("Google Calendar auth not yet implemented");
}

export const checkAvailability = internalAction({
  args: {
    calendarId: v.string(),
    date: v.string(), // YYYY-MM-DD
    duration: v.number(), // minutes
  },
  handler: async (_ctx, args) => {
    // TODO: Implement when Google Calendar is configured
    // 1. Get access token via service account
    // 2. Call Calendar API freebusy endpoint
    // 3. Parse busy times and return available slots

    // Placeholder: return mock available slots
    const slots = [
      `${args.date}T09:00:00`,
      `${args.date}T10:00:00`,
      `${args.date}T11:00:00`,
      `${args.date}T14:00:00`,
      `${args.date}T15:00:00`,
      `${args.date}T16:00:00`,
    ];

    return {
      calendarId: args.calendarId,
      date: args.date,
      duration: args.duration,
      availableSlots: slots,
    };
  },
});

export const createEvent = internalAction({
  args: {
    calendarId: v.string(),
    summary: v.string(),
    description: v.string(),
    startTime: v.string(), // ISO 8601
    duration: v.number(), // minutes
  },
  handler: async (_ctx, args) => {
    // TODO: Implement when Google Calendar is configured
    // 1. Get access token
    // 2. Create event via Calendar API
    // 3. Return event ID

    // Placeholder
    const mockEventId = `mock_${Date.now()}`;
    console.log(
      `[Calendar] Would create event: ${args.summary} at ${args.startTime} on calendar ${args.calendarId}`,
    );

    return { eventId: mockEventId };
  },
});

export const deleteEvent = internalAction({
  args: {
    calendarId: v.string(),
    eventId: v.string(),
  },
  handler: async (_ctx, args) => {
    // TODO: Implement when Google Calendar is configured
    console.log(
      `[Calendar] Would delete event ${args.eventId} from calendar ${args.calendarId}`,
    );
  },
});
