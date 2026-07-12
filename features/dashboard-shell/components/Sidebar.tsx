"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Dumbbell,
  FileText,
  BookOpen,
  Bookmark,
  RotateCcw,
  BarChart2,
  Settings,
} from "lucide-react";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Practice", href: "/practice", icon: Dumbbell },
  { title: "Mock Tests", href: "/tests", icon: FileText },
  { title: "Subjects", href: "/subjects", icon: BookOpen },
  { title: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { title: "Revision", href: "/revision", icon: RotateCcw },
  { title: "Analytics", href: "/analytics", icon: BarChart2 },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col border-r bg-card h-full w-full md:w-64", className)}>
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">GATEPrep</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium text-sm",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t">
        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
          <p className="text-sm font-semibold mb-1">Upgrade to Pro</p>
          <p className="text-xs text-muted-foreground mb-3">
            Get access to all premium tests.
          </p>
          <button className="w-full bg-primary text-primary-foreground text-sm font-medium py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-glow">
            Coming Soon
          </button>
        </div>
      </div>
    </aside>
  );
}
