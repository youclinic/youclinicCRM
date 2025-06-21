import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.query("leads").order("desc").collect();
  },
});

export const getById = query({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
    firstName: v.string(),
    lastName: v.string(),
    email: v.string(),
    phone: v.string(),
    country: v.string(),
    treatmentType: v.string(),
    budget: v.optional(v.string()),
    source: v.string(),
    notes: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    medicalHistory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.db.insert("leads", {
      ...args,
      status: "new",
      assignedTo: userId,
      files: [],
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("leads"),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    country: v.optional(v.string()),
    treatmentType: v.optional(v.string()),
    budget: v.optional(v.string()),
    status: v.optional(v.string()),
    source: v.optional(v.string()),
    notes: v.optional(v.string()),
    preferredDate: v.optional(v.string()),
    medicalHistory: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const { id, ...updates } = args;
    return await ctx.db.patch(id, updates);
  },
});

export const addFile = mutation({
  args: {
    leadId: v.id("leads"),
    fileId: v.id("_storage"),
    fileName: v.string(),
    fileType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }
    
    const newFile = {
      fileId: args.fileId,
      fileName: args.fileName,
      fileType: args.fileType,
      uploadedAt: Date.now(),
    };
    
    const updatedFiles = [...(lead.files || []), newFile];
    
    return await ctx.db.patch(args.leadId, { files: updatedFiles });
  },
});

export const removeFile = mutation({
  args: {
    leadId: v.id("leads"),
    fileId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }
    
    const updatedFiles = (lead.files || []).filter(file => file.fileId !== args.fileId);
    
    await ctx.db.patch(args.leadId, { files: updatedFiles });
    await ctx.storage.delete(args.fileId);
    
    return { success: true };
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.storage.generateUploadUrl();
  },
});

export const getFileUrl = query({
  args: { fileId: v.id("_storage") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    return await ctx.storage.getUrl(args.fileId);
  },
});

export const remove = mutation({
  args: { id: v.id("leads") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const lead = await ctx.db.get(args.id);
    if (lead?.files) {
      // Delete all associated files
      for (const file of lead.files) {
        await ctx.storage.delete(file.fileId);
      }
    }
    
    return await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }
    
    const leads = await ctx.db.query("leads").collect();
    
    const stats = {
      total: leads.length,
      new: leads.filter(l => l.status === "new").length,
      contacted: leads.filter(l => l.status === "contacted").length,
      qualified: leads.filter(l => l.status === "qualified").length,
      converted: leads.filter(l => l.status === "converted").length,
      lost: leads.filter(l => l.status === "lost").length,
    };
    
    return stats;
  },
});
