"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "c", className }: CodeBlockProps) {
  return (
    <div className={cn("relative my-4 rounded-lg bg-muted/60 dark:bg-black/40 border border-border overflow-x-auto px-4 py-3", className)}>
      <pre className="text-sm font-mono text-foreground leading-6 whitespace-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}
