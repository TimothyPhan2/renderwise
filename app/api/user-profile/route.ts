import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { handleAuthError, createStandardErrorResponse } from "@/lib/auth/errors";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return createStandardErrorResponse("Authentication required", 401);
    }

    const authResult = await auth();
    const token = await authResult.getToken({ template: "convex" });
    if (!token) {
      return createStandardErrorResponse("Failed to generate authentication token", 500);
    }

    convex.setAuth(token);

    const dbUser = await convex.query(api.users.getCurrentUser, {});

    if (!dbUser) {
      await convex.mutation(api.users.createUser, {
        clerkId: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || 
              user.username || 
              "User",
      });

      const createdUser = await convex.query(api.users.getCurrentUser, {});
      
      return NextResponse.json({
        user: createdUser,
        isNew: true,
      });
    }

    return NextResponse.json({
      user: dbUser,
      isNew: false,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return createStandardErrorResponse("Authentication required", 401);
    }

    const authResult = await auth();
    const token = await authResult.getToken({ template: "convex" });
    if (!token) {
      return createStandardErrorResponse("Failed to generate authentication token", 500);
    }

    const body = await request.json();
    const { youtubeChannelId, youtubeChannelName, stripeCustomerId } = body;

    convex.setAuth(token);

    await convex.mutation(api.users.updateUser, {
      ...(youtubeChannelId !== undefined && { youtubeChannelId }),
      ...(youtubeChannelName !== undefined && { youtubeChannelName }),
      ...(stripeCustomerId !== undefined && { stripeCustomerId }),
    });

    const updatedUser = await convex.query(api.users.getCurrentUser, {});

    return NextResponse.json({
      user: updatedUser,
      success: true,
    });
  } catch (error) {
    return handleAuthError(error);
  }
}