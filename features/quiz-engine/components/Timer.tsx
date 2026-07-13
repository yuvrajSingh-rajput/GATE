"use client";

import React from "react";
import { Clock } from "lucide-react";
import { useAttemptStore } from "../store/attempt-session.store";
import { cn } from "@/lib/utils";

export function Timer() {
  const { timeRemainingSeconds } = useAttemptStore();

  const hours = Math.floor(timeRemainingSeconds / 3600);
  const minutes = Math.floor((timeRemainingSeconds % 3600) / 60);
  const seconds = timeRemainingSeconds % 60;

  const isWarning = timeRemainingSeconds > 0 && timeRemainingSeconds <= 10 * 60;
  const isCritical = timeRemainingSeconds > 0 && timeRemainingSeconds <= 5 * 60;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg tabular-nums transition-colors border",
        isCritical
          ? "bg-destructive/10 text-destructive border-destructive/20 animate-pulse"
          : isWarning
          ? "bg-warning/10 text-warning border-warning/20"
          : "bg-muted text-foreground border-transparent"
      )}
    >
      <Clock className="w-4 h-4" />
      <span className="tracking-wider">
        {hours.toString().padStart(2, "0")}:{minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
