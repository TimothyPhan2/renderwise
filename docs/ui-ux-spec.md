

# **UI/UX Specification: ThumbPulse**

## **1\. Introduction**

This document defines the user experience goals, information architecture, user flows, and visual design specifications for the ThumbPulse user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

## **2\. Overall UX Goals & Principles**

#### **Target User Personas**

The primary personas are **'Sarah, The Aspiring Educator'** and **'Alex, The Gaming Enthusiast'**. Our design decisions will be focused on solving their core problems of time constraint, lack of design expertise, and the need for a high-speed, efficient workflow.

#### **Usability Goals**

* **Feel Fast and Effortless**: The workflow should feel so smooth and intuitive that the time it takes becomes unnoticeable.  
* **Build Creator Confidence**: The tool should empower users who are not professional designers to create thumbnails they are proud of.  
* **Provide Trustworthy Suggestions**: The AI's suggestions should be genuinely helpful and high-quality, acting as a valuable creative partner.

#### **Design Principles**

1. **Instantly Understandable**: The UI will be so clear that no tutorial is needed. Every element will have a clear purpose.  
2. **Focus on the Flow**: We will guide the user through their task one step at a time, showing only what is necessary to maintain a state of creative flow.  
3. **Intelligent, Not Just Automated**: The user will always have the final say and the ability to easily override any AI suggestion.

## **3\. Information Architecture (IA)**

#### **Site Map / Screen Inventory**

Code snippet

graph TD  
    subgraph Unauthenticated  
        A\[Landing Page\] \--\> B\[Pricing Page\]  
        B \--\> C\[Login / Register via Clerk\]  
        A \--\> C  
    end

    subgraph Authenticated  
        D(Onboarding Wizard) \-- First time only \--\> E\[My Videos Workspace\]  
        E \-- Select Video \--\> F\[Thumbnail Editor\]  
        E \-- Via Nav \--\> G\[Brand Settings\]  
        E \-- Via Nav \--\> H\[Subscription Management\]  
    end

    C \-- Success \--\> D

#### **Navigation Structure**

* **Primary Navigation:** After a user is logged in, a simple, persistent navigation bar will be visible, containing links to the **Workspace**, **Settings**, and **Subscription**.

## **4\. User Flows**

#### **Flow 1: New User Subscription & Onboarding**

* **User Goal:** To choose a plan, create an account, subscribe, and connect my YouTube channel to get started.  
* **Success Criteria:** The user has an active subscription (Free or Pro), has connected their channel, and lands on the main workspace.

#### **Flow 2: Thumbnail Creation & Export (MVP)**

* **User Goal:** To create a high-quality, AI-assisted thumbnail for a specific video and save the final image file to my computer.  
* **Success Criteria:** A 1280x720 PNG image file is successfully downloaded to the user's device.

#### **Flow 3: Subscription Management**

* **User Goal:** To view my current plan, see my billing history, and cancel my subscription.  
* **Success Criteria:** The user can successfully view their plan details or confirm their subscription cancellation.

## **5\. Wireframes & Mockups**

Our design process will leverage a generative, AI-native workflow.

* **Design Tool:** We will use 21st.dev to generate UI variants from detailed prompts.  
* **UI Library:** All components will be based on the shadcn/ui library.  
* **Authentication Screens:** For the Login, Registration, and User Profile management screens, we will use Clerk's pre-built React components. This is a significant advantage, as they are professionally designed, fully accessible, and handle all the complex logic for us.
* **Final Design Direction:** The chosen aesthetic is a modern, professional dark theme, using the color palette defined below. The "Creator Studio" / Dashboard design and the Landing Page design serve as our primary visual inspiration.

## **6\. Branding & Style Guide**

#### **Color Palette**

The project will use the following shadcn/ui compatible color palette. The dark theme is the default.

CSS

@layer base {  
  :root {  
    \--background: 0 0% 95%;  
    \--foreground: 0 0% 5%;  
    \--card: 0 0% 89%;  
    \--card-foreground: 0 0% 5%;  
    \--popover: 0 0% 89%;  
    \--popover-foreground: 0 0% 5%;  
    \--primary: 206 51% 84%;  
    \--primary-foreground: 0 0% 5%;  
    \--secondary: 236 51% 84%;  
    \--secondary-foreground: 0 0% 5%;  
    \--muted: 0 0% 75%;  
    \--muted-foreground: 0 0% 30%;  
    \--accent: 176 51% 84%;  
    \--accent-foreground: 0 0% 5%;  
    \--destructive: 348 100% 56%;  
    \--destructive-foreground: 0 0% 100%;  
    \--border: 0 0% 69%;  
    \--input: 0 0% 69%;  
    \--ring: 219 51% 61%;  
    \--chart-1: 206 51% 79%;  
    \--chart-2: 356 51% 79%;  
    \--chart-3: 56 51% 79%;  
    \--chart-4: 176 51% 79%;  
    \--chart-5: 236 51% 79%;  
    \--radius: 1rem;  
  }

  .dark {  
    \--background: 0 0% 5%;  
    \--foreground: 0 0% 95%;  
    \--card: 0 0% 13%;  
    \--card-foreground: 0 0% 95%;  
    \--popover: 0 0% 13%;  
    \--popover-foreground: 0 0% 95%;  
    \--primary: 206 51% 64%;  
    \--primary-foreground: 0 0% 5%;  
    \--secondary: 236 52% 74%;  
    \--secondary-foreground: 0 0% 5%;  
    \--muted: 0 0% 34%;  
    \--muted-foreground: 0 0% 70%;  
    \--accent: 176 51% 64%;  
    \--accent-foreground: 0 0% 5%;  
    \--destructive: 348 100% 39%;  
    \--destructive-foreground: 0 0% 100%;  
    \--border: 0 0% 23%;  
    \--input: 0 0% 20%;  
    \--ring: 219 51% 61%;  
    \--chart-1: 206 51% 79%;  
    \--chart-2: 356 51% 79%;  
    \--chart-3: 56 51% 79%;  
    \--chart-4: 176 51% 79%;  
    \--chart-5: 236 51% 79%;  
  }  
}

#### **Typography**

* **Primary Font:** Inter  
* **Monospace Font:** JetBrains Mono  
* **Type Scale:**

| Element | Font Size (rem/px) | Font Weight |
| :---- | :---- | :---- |
| **H1** | 2.25rem (36px) | Bold |
| **H2** | 1.875rem (30px) | Semi-Bold |
| **H3** | 1.25rem (20px) | Semi-Bold |
| **Body** | 1rem (16px) | Regular |
| **Small** | 0.875rem (14px) | Regular |

#### **Iconography**

* **Icon Library:** Lucide icon library.  
* **Usage Guidelines:** Icons will be used purposefully to clarify actions and represent concepts.

#### **Spacing & Layout**

* **Grid System:** An 8-point grid system will be used for all spacing values to ensure visual consistency.

#### **Branding & Component Styling**

* **Component Styling:** Clerk's components are highly customizable. We will style them to perfectly match our project's dark theme and color palette to ensure a seamless and consistent brand experience.

## **7\. Accessibility Requirements**

#### **Compliance Target**

* Our goal is to meet the **WCAG 2.1 Level AA** standard.

#### **Testing Strategy**

* We will use a blended approach. For automation, we will use **Google Lighthouse** to run audits. This will be supplemented by **manual keyboard and screen reader testing**.

## **8\. Responsiveness Strategy**

* **Strategy:** "Desktop-Optimized, Mobile-Responsive." The editor will be optimized for desktop, while the entire application will be responsive.  
* **Breakpoints:** We will use standard breakpoints for Mobile (320px+), Tablet (768px+), and Desktop (1024px+).

## **9\. Animation & Micro-interactions**

#### **Key Animations (for MVP)**

* **Interactive Feedback:** Smooth transitions for hover and focus states on all interactive elements.  
* **State Changes:** Gentle fade transitions when new elements appear (e.g., modals, loading states).

## **10\. Performance Considerations**

#### **Performance Goals**

* **Page Load:** Achieve "Good" scores on Google's Core Web Vitals (LCP \< 2.5 seconds).  
* **Interaction Response:** Provide instant visual feedback (under 100ms) for all user interactions.  
* **Animation Smoothness:** Maintain a consistent 60 frames per second (FPS).

#### **Design Strategies**

* **Optimistic UI:** The interface will respond instantly, even while background tasks are processing.  
* **Image Optimization:** All images will be appropriately sized and optimized.  
* **Lazy Loading:** Content not immediately visible will be loaded as the user scrolls.

