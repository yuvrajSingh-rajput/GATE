import React from "react";
import { Sidebar } from "@/features/dashboard-shell/components/Sidebar";
import { TopNav } from "@/features/dashboard-shell/components/TopNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar className="hidden md:flex shrink-0" />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-6 md:px-8 md:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
