# **4\. Database Schema**

This is the schema definition for our Convex database, which will be located in a convex/schema.ts file. It includes a timestamp to manage stale data, a status field for asynchronous jobs, and indexes for performance.

TypeScript

import { defineSchema, defineTable } from "convex/server";  
import { v } from "convex/values";

export default defineSchema({  
  users: defineTable({  
    name: v.string(),  
    email: v.string(),  
    clerkId: v.string(),  
    youtubeChannelId: v.optional(v.string()),  
    youtubeChannelName: v.optional(v.string()),  
    stripeCustomerId: v.optional(v.string()),  
  })  
    .index("by\_clerkId", \["clerkId"\])  
    .index("by\_email", \["email"\]),

  subscriptions: defineTable({  
    userId: v.id("users"),  
    stripeSubscriptionId: v.string(),  
    plan: v.union(v.literal("free"), v.literal("pro")),  
    status: v.union(v.literal("active"), v.literal("canceled"), v.literal("past\_due")),  
    currentPeriodEnd: v.number(),  
  })  
    .index("by\_userId", \["userId"\])  
    .index("by\_stripeSubscriptionId", \["stripeSubscriptionId"\]),

  videos: defineTable({  
    userId: v.id("users"),  
    youtubeVideoId: v.string(),  
    title: v.string(),  
    lastRefreshedAt: v.optional(v.number()), // Unix timestamp  
  }).index("by\_userId", \["userId"\]),

  thumbnails: defineTable({  
    videoId: v.id("videos"),  
    storageId: v.string(),  
    status: v.union(  
      v.literal("processing"),  
      v.literal("success"),  
      v.literal("failed")  
    ),  
    abTestId: v.optional(v.string()),  
    impressions: v.optional(v.number()),  
    clicks: v.optional(v.number()),  
    isPublished: v.boolean(),  
  })  
    .index("by\_videoId", \["videoId"\])  
    .index("by\_abTestId", \["abTestId"\]),

  brandProfiles: defineTable({  
    userId: v.id("users"),  
    primaryColor: v.string(),  
    fontFamily: v.string(),  
    logoStorageId: v.optional(v.string()),  
  }).index("by\_userId", \["userId"\]),  
});
