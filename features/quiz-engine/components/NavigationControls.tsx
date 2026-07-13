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
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border rounded-xl shadow-sm">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrevious} disabled={!hasPrevious} className="rounded-lg">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onMarkForReviewAndNext} className="rounded-lg">
          <Bookmark className="w-4 h-4 mr-2" />
          Mark for Review & Next
        </Button>
        <Button
          variant="outline"
          onClick={onClearResponse}
          className="text-destructive hover:bg-destructive/10 rounded-lg"
        >
          <Eraser className="w-4 h-4 mr-2" />
          Clear Response
        </Button>
        <Button
          onClick={onSaveAndNext}
          className="gradient-bg text-white rounded-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] active:scale-[0.98]"
        >
          <Save className="w-4 h-4 mr-2" />
          Save & Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
