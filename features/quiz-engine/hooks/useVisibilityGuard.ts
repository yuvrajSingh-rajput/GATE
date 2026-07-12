import { useEffect } from "react";
import { Attempt } from "@/types";
import { toast } from "sonner";

export function useVisibilityGuard(isActive: boolean, attemptId: string) {
  useEffect(() => {
    if (!isActive) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Increment tabSwitchCount
        const raw = localStorage.getItem(`attempt_${attemptId}`);
        if (raw) {
          try {
            const attempt = JSON.parse(raw) as Attempt;
            attempt.tabSwitchCount = (attempt.tabSwitchCount || 0) + 1;
            localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(attempt));
          } catch (e) {}
        }
      } else {
        toast.warning("Tab switching detected", {
          description: "This has been recorded. Please do not switch tabs during the exam.",
          duration: 5000,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isActive, attemptId]);
}
