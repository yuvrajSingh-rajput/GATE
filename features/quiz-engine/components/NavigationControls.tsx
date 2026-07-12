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
    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-card border rounded-2xl shadow-sm">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onPrevious} disabled={!hasPrevious}>
          <ChevronLeft className="w-4 h-4 mr-1" />
          Previous
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="secondary" onClick={onMarkForReviewAndNext}>
          <Bookmark className="w-4 h-4 mr-2" />
          Mark for Review & Next
        </Button>
        <Button variant="outline" onClick={onClearResponse} className="text-destructive hover:bg-destructive/10">
          <Eraser className="w-4 h-4 mr-2" />
          Clear Response
        </Button>
        <Button onClick={onSaveAndNext} className="bg-success text-white hover:bg-success/90 shadow-glow">
          <Save className="w-4 h-4 mr-2" />
          Save & Next
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
