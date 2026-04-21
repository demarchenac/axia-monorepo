import { internalMutation } from "./_generated/server";

export const clearAll = internalMutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "services",
      "specialists",
      "tenantLocations",
      "tenants",
      "conversations",
      "messages",
      "patients",
      "patientTenantRelations",
      "appointments",
      "tenantPages",
      "pageSections",
      "previewPresets",
      "tenantPreviews",
      "seedContent",
      "designTokens",
    ] as const;

    let total = 0;
    for (const table of tables) {
      const docs = await ctx.db.query(table).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      if (docs.length) {
        console.log(`Deleted ${docs.length} from ${table}`);
        total += docs.length;
      }
    }
    console.log(`Cleared ${total} documents total.`);
  },
});
