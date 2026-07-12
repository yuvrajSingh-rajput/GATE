import { useEffect, useState } from "react";
import { Attempt } from "@/types";
import { useAttemptStore } from "@/features/quiz-engine/store/attempt-session.store";

export function useFullscreenGuard(isActive: boolean, attemptId: string) {
  const [showFullscreenOverlay, setShowFullscreenOverlay] = useState(false);
  const { forceSave } = useAttemptStore();

  useEffect(() => {
    if (!isActive) return;

    // Request fullscreen on mount if not already
    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.warn("Fullscreen request failed", err);
      }
    };
    enterFullscreen();

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowFullscreenOverlay(true);
        // We increment fullscreenExitCount. We'll do this by getting current from localStorage,
        // incrementing, and setting. (Simple approach since we don't have a direct setter in Zustand for this yet, 
        // but we can just use the store if we add a method, or do it via localStorage direct patch)
        const raw = localStorage.getItem(`attempt_${attemptId}`);
        if (raw) {
          try {
            const attempt = JSON.parse(raw) as Attempt;
            attempt.fullscreenExitCount = (attempt.fullscreenExitCount || 0) + 1;
            localStorage.setItem(`attempt_${attemptId}`, JSON.stringify(attempt));
          } catch (e) {}
        }
      } else {
        setShowFullscreenOverlay(false);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [isActive, attemptId]);

  const resumeFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setShowFullscreenOverlay(false);
    } catch (err) {
      console.error("Could not resume fullscreen", err);
    }
  };

  return { showFullscreenOverlay, resumeFullscreen };
}
