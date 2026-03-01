"use client";

import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TabProvider } from "@/contexts/TabContext";
import Navbar from "@/components/Navbar";
import LoginScreen from "@/components/LoginScreen";

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <TabProvider>
      <Navbar />
      <main>{children}</main>
    </TabProvider>
  );
}

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
