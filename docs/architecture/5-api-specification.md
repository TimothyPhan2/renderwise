# **5\. API Specification**

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
