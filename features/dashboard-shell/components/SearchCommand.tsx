"use client";

import React from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SearchCommand() {
  return (
    <Button
      variant="outline"
      className="hidden sm:flex relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
      onClick={() => {
        // Mock command palette opening for Phase 1
        console.log("Open command palette");
      }}
    >
      <span className="hidden lg:inline-flex">Search topics...</span>
      <span className="inline-flex lg:hidden">Search...</span>
      <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
