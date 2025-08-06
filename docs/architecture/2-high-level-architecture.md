# **2\. High Level Architecture**

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
