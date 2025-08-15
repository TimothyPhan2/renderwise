"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSignUp, useSignIn } from "@clerk/nextjs";

export default function SSOCallbackPage() {
  const { signUp } = useSignUp();
  const { signIn } = useSignIn();
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Handle the OAuth callback
        if (signUp?.status === "complete") {
          router.push("/dashboard");
        } else if (signIn?.status === "complete") {
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        router.push("/sign-in");
      }
    };

    handleCallback();
  }, [signUp, signIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </div>
  );
}