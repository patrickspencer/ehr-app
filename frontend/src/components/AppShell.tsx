"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TabProvider } from "@/contexts/TabContext";
import Navbar from "@/components/Navbar";
import LoginScreen from "@/components/LoginScreen";

const PUBLIC_PATHS = ["/guide"];

function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return <>{children}</>;
  }

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
    <TabProvider key={user.id} userId={user.id}>
      <Navbar />
      <main>{children}</main>
      <div className="fixed bottom-2 left-3 text-[10px] text-gray-400">
        v{process.env.APP_VERSION}
      </div>
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
