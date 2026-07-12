"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { useAttemptStore } from "../store/attempt-session.store";

interface SubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  questions: Question[];
}

export function SubmitConfirmDialog({ open, onOpenChange, onConfirm, questions }: SubmitConfirmDialogProps) {
  const { answers } = useAttemptStore();

  const stats = {
    answered: 0,
    notAnswered: 0,
    marked: 0,
    answeredMarked: 0,
    notVisited: 0,
  };

  questions.forEach((q) => {
    const status = answers[q.id]?.status || "not-visited";
    if (status === "answered") stats.answered++;
    else if (status === "not-answered") stats.notAnswered++;
    else if (status === "marked") stats.marked++;
    else if (status === "answered-marked") stats.answeredMarked++;
    else stats.notVisited++;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Test?</DialogTitle>
          <DialogDescription>
            Are you sure you want to submit your test? You cannot change your answers after submission.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="bg-muted p-3 rounded-lg border flex flex-col items-center">
            <span className="text-2xl font-bold text-success">{stats.answered}</span>
            <span className="text-xs text-muted-foreground uppercase mt-1">Answered</span>
          </div>
          <div className="bg-muted p-3 rounded-lg border flex flex-col items-center">
            <span className="text-2xl font-bold text-destructive">{stats.notAnswered}</span>
            <span className="text-xs text-muted-foreground uppercase mt-1">Not Answered</span>
          </div>
          <div className="bg-muted p-3 rounded-lg border flex flex-col items-center">
            <span className="text-2xl font-bold text-violet-600">{stats.marked}</span>
            <span className="text-xs text-muted-foreground uppercase mt-1">Marked</span>
          </div>
          <div className="bg-muted p-3 rounded-lg border flex flex-col items-center">
            <span className="text-2xl font-bold text-muted-foreground">{stats.notVisited}</span>
            <span className="text-xs text-muted-foreground uppercase mt-1">Not Visited</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>
            Submit Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
