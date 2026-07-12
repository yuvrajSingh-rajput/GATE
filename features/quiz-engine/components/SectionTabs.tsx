"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SectionTabsProps {
  sections: { name: string; range: [number, number] }[];
  activeSection: string;
  onSectionChange: (sectionName: string) => void;
}

export function SectionTabs({ sections, activeSection, onSectionChange }: SectionTabsProps) {
  return (
    <div className="flex w-full border-b bg-muted/20">
      {sections.map((section) => {
        const isActive = activeSection === section.name;
        return (
          <button
            key={section.name}
            onClick={() => onSectionChange(section.name)}
            className={cn(
              "flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors",
              isActive
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            )}
          >
            {section.name}
          </button>
        );
      })}
    </div>
  );
}
