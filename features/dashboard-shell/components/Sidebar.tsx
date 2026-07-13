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
  Sparkles,
} from "lucide-react";

/* ── Navigation structure with groups ── */
const NAV_GROUPS = [
  {
    items: [
      { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "PREPARE",
    items: [
      { title: "Subjects", href: "/subjects", icon: BookOpen },
      { title: "Practice", href: "/practice", icon: Dumbbell },
    ],
  },
  {
    label: "TEST",
    items: [
      { title: "Mock Tests", href: "/tests", icon: FileText },
    ],
  },
  {
    label: "REVIEW",
    items: [
      { title: "Bookmarks", href: "/bookmarks", icon: Bookmark },
      { title: "Revision", href: "/revision", icon: RotateCcw },
      { title: "Analytics", href: "/analytics", icon: BarChart2 },
    ],
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col h-full w-full md:w-64 overflow-hidden",
        "bg-sidebar text-sidebar-foreground",
        className
      )}
      style={{ boxShadow: "var(--shadow-sidebar)" }}
    >
      {/* Dot-pattern texture overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          opacity: 0.03,
        }}
      />

      {/* Subtle radial glow near logo */}
      <div
        className="pointer-events-none absolute -top-16 -left-16 z-0 h-64 w-64 rounded-full"
        aria-hidden="true"
        style={{
          background: "radial-gradient(circle, rgba(0,82,255,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Header / Wordmark ── */}
      <div className="relative z-10 px-5 py-6">
        <Link href="/dashboard" className="inline-flex items-center gap-1">
          <span className="font-heading text-xl text-white tracking-tight">
            GATE
          </span>
          <span className="font-heading text-xl gradient-text tracking-tight">
            Prep
          </span>
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav
        className="relative z-10 flex-1 overflow-y-auto px-3 space-y-1"
        aria-label="Main navigation"
      >
        {NAV_GROUPS.map((group, gi) => (
          <div key={gi}>
            {/* Group header */}
            {group.label && (
              <div className="px-3 pt-6 pb-2">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/40 select-none">
                  {group.label}
                </span>
              </div>
            )}

            {/* Nav items */}
            {group.items.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm",
                    isActive
                      ? "bg-[rgba(0,82,255,0.1)] text-white font-semibold"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white/90 font-medium"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive && (
                    <div
                      className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                      style={{
                        background: "linear-gradient(to bottom, var(--accent), var(--accent-secondary))",
                      }}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-md transition-colors duration-200",
                      isActive
                        ? "h-7 w-7 text-white"
                        : "h-5 w-5 text-white/50 group-hover:text-white/80"
                    )}
                    style={
                      isActive
                        ? {
                            background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                          }
                        : undefined
                    }
                  >
                    <item.icon
                      className={cn(isActive ? "h-4 w-4" : "h-5 w-5")}
                    />
                  </div>

                  {/* Label */}
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Settings (pinned bottom) ── */}
      <div className="relative z-10 px-3 pb-2 border-t border-sidebar-border">
        {(() => {
          const isSettingsActive =
            pathname === "/settings" || pathname.startsWith("/settings/");
          return (
            <Link
              href="/settings"
              aria-current={isSettingsActive ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 mt-2 rounded-lg transition-all duration-200 text-sm",
                isSettingsActive
                  ? "bg-[rgba(0,82,255,0.1)] text-white font-semibold"
                  : "text-white/70 hover:bg-white/[0.06] hover:text-white/90 font-medium"
              )}
            >
              {isSettingsActive && (
                <div
                  className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-full"
                  style={{
                    background: "linear-gradient(to bottom, var(--accent), var(--accent-secondary))",
                  }}
                />
              )}
              <Settings
                className={cn(
                  "transition-colors duration-200",
                  isSettingsActive
                    ? "h-5 w-5 text-white"
                    : "h-5 w-5 text-white/50 group-hover:text-white/80"
                )}
              />
              <span>Settings</span>
            </Link>
          );
        })()}
      </div>

      {/* ── Upgrade Card (gradient border) ── */}
      <div className="relative z-10 px-4 pb-4">
        <div
          className="rounded-xl p-[1.5px]"
          style={{
            background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
          }}
        >
          <div className="rounded-[calc(0.75rem-1.5px)] bg-sidebar px-4 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-[var(--accent-secondary)]" />
              <p className="text-sm font-semibold text-white">Upgrade to Pro</p>
            </div>
            <p className="text-xs text-white/50 mb-3">
              Get access to all premium tests.
            </p>
            <button
              className="w-full gradient-bg text-white text-sm font-medium py-2 rounded-lg transition-all duration-200 hover:brightness-110 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]"
            >
              Coming Soon
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
