"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Bookmark, Eraser, Save } from "lucide-react";

interface NavigationControlsProps {
  onPrevious: () => void;
  onSaveAndNext: () => void;
  onClearResponse: () => void;
  onMarkForReviewAndNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function NavigationControls({
  onPrevious,
  onSaveAndNext,
  onClearResponse,
  onMarkForReviewAndNext,
  hasPrevious,
}: NavigationControlsProps) {
  return (
    <div className="flex flex-nowrap sm:flex-wrap items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-card border rounded-xl shadow-sm overflow-x-auto no-scrollbar w-full">
      <div className="flex gap-2 shrink-0">
        <Button variant="outline" onClick={onPrevious} disabled={!hasPrevious} className="rounded-lg shrink-0 h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 sm:mr-1" />
          <span className="hidden sm:inline">Previous</span>
        </Button>
      </div>

      <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 shrink-0">
        <Button variant="secondary" onClick={onMarkForReviewAndNext} className="rounded-lg shrink-0 h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
          <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Mark for Review & Next</span>
          <span className="sm:hidden">Mark</span>
        </Button>
        <Button
          variant="outline"
          onClick={onClearResponse}
          className="text-destructive hover:bg-destructive/10 rounded-lg shrink-0 h-9 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm"
        >
          <Eraser className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Clear Response</span>
          <span className="sm:hidden">Clear</span>
        </Button>
        <Button
          onClick={onSaveAndNext}
          className="gradient-bg text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98] shrink-0 h-9 px-4 text-xs sm:h-10 sm:px-4 sm:text-sm"
        >
          <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">Save & Next</span>
          <span className="sm:hidden">Save & Next</span>
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1 hidden sm:inline" />
        </Button>
      </div>
    </div>
  );
}
