# **Fullstack Architecture Document: ThumbPulse**

## **1\. Introduction**

This document outlines the complete fullstack architecture for ThumbPulse. It serves as the single source of truth for development, ensuring consistency across the entire technology stack.

* **Starter Template:** This is a greenfield project. Our architectural foundation is the **Next.js framework**, complemented by the official starter guides from **Convex**, **Clerk**, and **Stripe**.  
* **Change Log:**  
  * v1.0 (2025-07-31): Initial architecture draft.  
  * v1.1 (2025-07-31): Paused to update PRD & UI/UX Spec with freemium model.  
  * v1.2 (2025-07-31): Resumed with updated inputs.  
  * v2.0 (2025-08-01): Final version approved with complete schema and API spec.  
  * v2.1 (2025-08-01): Added final Coding Standards section.

## **2\. High Level Architecture**

The architecture is a modern, serverless web application supporting a freemium model. It uses a **Unified Repository** with a **Next.js** application serving as both the frontend and a lightweight **Backend-for-Frontend (BFF)**. The BFF orchestrates logic, communicating with **Convex** for data, **Clerk** for identity, **Stripe** for billing, and third-party AI/YouTube APIs.

* **Architecture Diagram:**  
  Code snippet  
  graph TD  
      User\[Creator's Browser\] \--\> Vercel\[Vercel Edge Network / CDN\];  
      Vercel \--\> NextApp\[Next.js Application\];

      subgraph "Next.js on Vercel"  
          NextApp \-- Serves \--\> Frontend\[Frontend UI Components\];  
          NextApp \-- Contains \--\> BFF\[API Routes / BFF\];  
      end

      BFF \-- Authenticates via \--\> Clerk\[Clerk\];  
      BFF \-- Reads/Writes Data \--\> Convex\[Convex BaaS: Database & Storage\];  
      BFF \-- Processes Payments via \--\> StripeAPI\[Stripe API\];  
      BFF \-- Calls \--\> AI\_API\[Third-Party AI API\];  
      BFF \-- Calls \--\> YouTubeAPI\[YouTube API\];

## **3\. Tech Stack**

| Category | Technology | Version |
| :---- | :---- | :---- |
| **Runtime** | Node.js | ~22.15.1 |
| **Frontend Language** | TypeScript | ~5.8.2 |
| **Frontend Framework** | Next.js | ~15.4.4 |
| **UI Component Library** | shadcn/ui | ~2.9.3 (CLI) |
| **State Management** | Zustand | ~5.0.6 |
| **Backend Framework** | Next.js API Routes | ~15.4.4 |
| **Authentication** | Clerk | N/A |
| **Payment Processor** | Stripe | N/A |
| **Database & BaaS** | Convex | ~1.25.4 |
| **AI SDK** | Vercel AI SDK | ~4.3.19 |
| **AI Model Provider** | Together.ai | N/A |
| **E2E Testing** | Playwright | ~1.54.1 |
| **Deployment & Hosting** | Vercel | N/A |
| **CI/CD** | GitHub Actions | N/A |
| **Styling** | Tailwind CSS | ~4.1.11 |

## **4\. Database Schema**

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

## **5\. API Specification**

A REST API will be exposed via Next.js API Routes. The following OpenAPI 3.0 specification outlines the key endpoints.

YAML

openapi: 3.0.0  
info:  
  title: ThumbPulse API  
  version: 1.0.0  
  description: API for the ThumbPulse application, handling user data, thumbnails, and subscriptions.  
servers:  
  \- url: /api  
    description: Local API routes  
components:
  securitySchemes:
    clerkAuth: # Updated from bearerAuth
      type: http
      scheme: bearer
      bearerFormat: JWT # Clerk uses JWTs
security:
  - clerkAuth: []
paths:  
  /youtube/videos:  
    get:  
      summary: Get User's YouTube Videos  
      description: Fetches the list of videos from the user's connected YouTube channel.  
      responses:  
        '200':  
          description: A list of videos.  
  /thumbnails:  
    post:  
      summary: Generate a Thumbnail  
      description: Triggers the AI generation process for a new thumbnail for a specific video.  
      responses:  
        '202':  
          description: Accepted. The generation has started as a background job.  
  /stripe/checkout-session:  
    post:  
      summary: Create Stripe Checkout Session  
      description: Creates a new Stripe checkout session for a user to subscribe to a plan.  
      responses:  
        '200':  
          description: The Stripe session URL.  
  /stripe/portal-session:  
    post:  
      summary: Create Stripe Customer Portal Session  
      description: Creates a new Stripe customer portal session for a user to manage their subscription.  
      responses:  
        '200':  
          description: The Stripe portal URL.  
  /stripe/webhooks:  
    post:  
      summary: Stripe Webhook Handler  
      description: \>  
        Receives and processes webhook events from Stripe to keep subscription  
        data in sync with our database. This endpoint is public but must be  
        secured by verifying the Stripe signature in the request header.  
      security: \[\]  
      responses:  
        '200':  
          description: Acknowledged.  
        '400':  
          description: Bad request (e.g., invalid signature).  
  /user/subscription:  
    get:  
      summary: Get User's Subscription Status  
      description: Fetches the current subscription status for the logged-in user.  
      responses:  
        '200':  
          description: The user's subscription details.

## **6\. Components**

The system is composed of logical services within the Next.js application, including a Frontend Application (using **Dnd Kit** for drag-and-drop), a BFF, and wrappers for Authentication, Billing, Database, AI Generation, and YouTube interactions.

## **7\. External APIs**

The application depends on the external APIs of **Clerk**, **Stripe**, **YouTube**, and **Together.ai**. The architecture is designed to be resilient to their potential failures.

## **8\. Core Workflows**

Key workflows like New User Subscription and Asynchronous Thumbnail Generation are mapped out to ensure clear implementation logic.

## **9\. Unified Project Structure**

A domain-driven folder structure will be used to ensure the codebase is scalable and maintainable.

## **10\. Development Workflow**

The development workflow is standardized with clear prerequisites, setup commands, and a .env.example file for all required API keys.

## **11\. Coding Standards**

#### **Core Principles**

* **Language & Runtimes:** All code will be written in **TypeScript 5.8.2** and run on **Node.js 22.15.1**.  
* **Style & Linting:** We will use **ESLint** and **Prettier** for automated code formatting and quality checks.  
* **Test Organization:** All test files will be co-located with the source code they are testing and will have a .test.ts or .spec.ts suffix.

#### **Naming Conventions**

| Element | Convention | Example |
| :---- | :---- | :---- |
| **UI Components** | PascalCase | UserProfile.tsx |
| **React Hooks** | camelCase with 'use' prefix | useAuth.ts |
| **API Routes** | kebab-case folder/file names | /api/user-profile |
| **Database Tables** | camelCase | brandProfiles |
| **Functions/Variables** | camelCase | const userProfile \= ... |

#### **Critical Rules for Development**

1. **Type Safety is Paramount:** Avoid using any unless absolutely necessary and justified with a comment.  
2. **Environment Variables:** Never access environment variables directly. All must be loaded into a centralized, type-safe configuration object.  
3. **API Calls:** Frontend components must not make direct fetch calls. All communication must go through a dedicated service layer.  
4. **Error Handling:** All API routes must use a standardized error handler.  
5. **State Management:** Never mutate state directly. All state updates must go through the defined actions in our Zustand store.

## **12\. Final Checklist**

The architect-checklist has been run against this document. The architecture is deemed complete, robust, and aligned with all project goals.



