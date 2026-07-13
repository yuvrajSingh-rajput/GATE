"use client";

import React, { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { SearchCommand } from "./SearchCommand";
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function TopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-md md:px-6">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Mobile wordmark */}
          <div className="md:hidden flex items-center">
            <span className="font-heading text-lg text-foreground tracking-tight">
              GATE
            </span>
            <span className="font-heading text-lg gradient-text tracking-tight">
              Prep
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <SearchCommand />
          <Button
            variant="ghost"
            size="icon"
            className="relative hidden sm:flex text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent animate-[pulse-dot_2s_ease-in-out_infinite]" />
          </Button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      {/* ── Mobile drawer overlay ── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div
            className={cn(
              "absolute inset-y-0 left-0 w-64 transition-transform duration-300 ease-out",
              mobileOpen ? "translate-x-0" : "-translate-x-full"
            )}
          >
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-20 rounded-full p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close navigation menu"
            >
              <X className="h-5 w-5" />
            </button>

            <Sidebar />
          </div>
        </div>
      )}
    </>
  );
}
