"use client";

import React from "react";
import { Bell, Menu } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { SearchCommand } from "./SearchCommand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Sidebar } from "./Sidebar";

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden" />
            }
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r-0">
            {/* Mobile Sidebar */}
            <div className="flex h-full flex-col">
              <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-primary">GATEPrep</h1>
              </div>
              <div className="flex-1 overflow-auto">
                <Sidebar />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="md:hidden flex items-center">
          <span className="font-bold text-lg text-primary tracking-tight">GATEPrep</span>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <SearchCommand />
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
        </Button>
        <ThemeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
