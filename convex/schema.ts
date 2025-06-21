import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  leads: defineTable({
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    country: v.string(),
    treatmentType: v.string(),
    budget: v.optional(v.string()),
    status: v.string(), // "new", "contacted", "qualified", "converted", "lost"
    source: v.string(), // "website", "referral", "social_media", "advertisement"
    notes: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    medicalHistory: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    files: v.optional(v.array(v.object({
      fileId: v.id("_storage"),
      fileName: v.string(),
      fileType: v.string(),
      uploadedAt: v.number(),
    }))),
  })
    .index("by_status", ["status"])
    .index("by_treatment", ["treatmentType"])
    .index("by_assigned", ["assignedTo"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
