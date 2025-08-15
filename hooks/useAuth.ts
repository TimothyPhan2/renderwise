"use client";

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuth() {
  const { isLoaded: clerkLoaded, userId, sessionId } = useClerkAuth();
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isAuthenticated: convexAuthenticated, isLoading: convexLoading } = useConvexAuth();
  
  const dbUser = useQuery(
    api.users.getCurrentUser,
    convexAuthenticated && userId ? {} : "skip"
  );
  
  const createUser = useMutation(api.users.createUser);
  
  const { 
    setUser, 
    setLoading, 
    setAuthenticated,
    user: storeUser,
    isAuthenticated,
    isLoading 
  } = useAuthStore();

  useEffect(() => {
    const updateAuthState = async () => {
      if (!clerkLoaded || !userLoaded) {
        setLoading(true);
        return;
      }

      if (!userId || !clerkUser) {
        setUser(null);
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      if (!convexAuthenticated || convexLoading) {
        setLoading(true);
        return;
      }

      if (dbUser === undefined) {
        setLoading(true);
        return;
      }

      if (dbUser === null && clerkUser) {
        try {
          const newUser = await createUser({
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || 
                  clerkUser.username || 
                  "User",
          });
          setUser({
            id: newUser,
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || "",
            name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || 
                  clerkUser.username || 
                  "User",
            youtubeChannelId: undefined,
            youtubeChannelName: undefined,
            stripeCustomerId: undefined,
          });
          setAuthenticated(true);
        } catch (error) {
          console.error("Failed to create user:", error);
          setAuthenticated(false);
        }
      } else if (dbUser) {
        setUser({
          id: dbUser._id,
          clerkId: dbUser.clerkId,
          email: dbUser.email,
          name: dbUser.name,
          youtubeChannelId: dbUser.youtubeChannelId,
          youtubeChannelName: dbUser.youtubeChannelName,
          stripeCustomerId: dbUser.stripeCustomerId,
        });
        setAuthenticated(true);
      }

      setLoading(false);
    };

    updateAuthState();
  }, [
    clerkLoaded,
    userLoaded,
    userId,
    clerkUser,
    convexAuthenticated,
    convexLoading,
    dbUser,
    createUser,
    setUser,
    setLoading,
    setAuthenticated
  ]);

  return {
    user: storeUser,
    isAuthenticated,
    isLoading,
    userId,
    sessionId,
    clerkUser,
  };
}