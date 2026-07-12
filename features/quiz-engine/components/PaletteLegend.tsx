"use client";

import React from "react";

export function PaletteLegend() {
  return (
    <div className="grid grid-cols-2 gap-2 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-muted border text-muted-foreground">0</div>
        <span>Not Visited</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-destructive text-white">0</div>
        <span>Not Answered</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-success text-white">0</div>
        <span>Answered</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-violet-600 text-white">0</div>
        <span>Marked</span>
      </div>
      <div className="flex items-center gap-2 col-span-2">
        <div className="w-6 h-6 rounded flex items-center justify-center bg-violet-600 text-white relative">
          0
          <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-success translate-x-1 translate-y-1 ring-1 ring-background" />
        </div>
        <span>Answered & Marked</span>
      </div>
    </div>
  );
}
