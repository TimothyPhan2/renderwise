"use client";

import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-2xl font-bold text-foreground">RenderWise Dashboard</h1>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10"
                }
              }}
            />
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-card overflow-hidden shadow-lg rounded-lg border border-border">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                Welcome back, {user?.name}!
              </h2>
              <div className="text-sm text-muted-foreground">
                <p>Email: {user?.email}</p>
                {user?.youtubeChannelName && (
                  <p>YouTube Channel: {user.youtubeChannelName}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}