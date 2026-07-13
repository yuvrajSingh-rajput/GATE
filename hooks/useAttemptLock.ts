import { useEffect, useRef } from "react";
import { useUpdateAttempt } from "@/hooks/queries/useAttempts";
import { Attempt } from "@/types";
import { toast } from "sonner";

interface UseAttemptLockProps {
  attempt: Attempt | undefined;
  isActive: boolean;
  onViolation: (type: "tab-switch" | "fullscreen-exit") => void;
  onAutoSubmit: () => void;
}

export function useAttemptLock({ attempt, isActive, onViolation, onAutoSubmit }: UseAttemptLockProps) {
  const { mutate: updateAttempt } = useUpdateAttempt();
  const channelRef = useRef<BroadcastChannel | null>(null);
  
  // 1. Browser Navigation Guard (beforeunload)
  useEffect(() => {
    if (!isActive) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Most modern browsers ignore this string, but it's required by the spec for the prompt
      e.returnValue = "Changes you made may not be saved";
      return "Changes you made may not be saved";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isActive]);

  // 1b. Back Navigation Guard (popstate)
  useEffect(() => {
    if (!isActive) return;

    // Push a sentinel state so there's something to pop
    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
      const confirmLeave = window.confirm(
        "Leaving now will pause your test — your progress is saved and you can resume later. Are you sure?"
      );
      if (!confirmLeave) {
        window.history.pushState(null, "", window.location.href);
      } else {
        window.history.back();
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isActive]);

  // 1c. Internal Link Navigation Guard
  useEffect(() => {
    if (!isActive) return;

    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href) {
        const isInternal = target.href.startsWith(window.location.origin);
        if (isInternal) {
          const confirmLeave = window.confirm(
            "Leaving now will pause your test — your progress is saved and you can resume later. Are you sure?"
          );
          if (!confirmLeave) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    document.addEventListener("click", handleLinkClick, true);
    return () => document.removeEventListener("click", handleLinkClick, true);
  }, [isActive]);

  // 2. Tab Switching Guard (Page Visibility API)
  useEffect(() => {
    if (!isActive || !attempt) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        // User switched tabs or minimized
        const newCount = (attempt.tabSwitchCount || 0) + 1;
        updateAttempt({
          id: attempt.id,
          updates: { tabSwitchCount: newCount },
        });

        if (newCount >= 3) {
          toast.error("Exam Auto-Submitted", { description: "You exceeded the maximum allowed tab switches." });
          onAutoSubmit();
        } else {
          onViolation("tab-switch");
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isActive, attempt, onViolation, updateAttempt]);

  // 3. Duplicate Tab Prevention (BroadcastChannel)
  useEffect(() => {
    if (!isActive || !attempt) return;

    try {
      const channel = new BroadcastChannel("gate_prep_lock");
      channelRef.current = channel;

      let isDuplicate = false;
      channel.onmessage = (event) => {
        if (event.data.type === "PING" && !isDuplicate) {
          // Another tab is asking if a test is running. Reply YES.
          channel.postMessage({ type: "PONG", attemptId: attempt.id });
        } else if (event.data.type === "PONG" && event.data.attemptId !== attempt.id) {
          // We got a PONG from another test.
          isDuplicate = true;
          toast.error("Test already running in another tab");
          window.location.href = "/dashboard";
        }
      };

      // Announce we want to check if a test is active
      channel.postMessage({ type: "PING" });

      // After a short delay, announce we are active if no PONG received
      const timer = setTimeout(() => {
        if (!isDuplicate) {
          channel.postMessage({ type: "TEST_STARTED", attemptId: attempt.id });
        }
      }, 500);

      return () => {
        clearTimeout(timer);
        if (!isDuplicate) {
          channel.postMessage({ type: "TEST_ENDED", attemptId: attempt.id });
        }
        channel.close();
      };
    } catch (e) {
      console.warn("BroadcastChannel not supported in this environment");
    }
  }, [isActive, attempt]);

  // Fullscreen enforcement is handled in the UI layer (QuizEngine) with CSS fallbacks,
  // but we can listen for fullscreen changes here.
  useEffect(() => {
    if (!isActive) return;

    // Strict enforce: If not in fullscreen right now, trigger violation immediately.
    // This catches page reloads and direct navigations.
    if (!document.fullscreenElement) {
      onViolation("fullscreen-exit");
    }

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // Exited fullscreen
        onViolation("fullscreen-exit");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [isActive, onViolation]);

  // Expose a helper to request fullscreen safely
  const requestFullscreen = async (element: HTMLElement) => {
    try {
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
    } catch (e) {
      console.warn("Fullscreen API failed or not supported:", e);
      // We rely on the CSS fallback (fixed inset-0 z-50) if this fails.
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.warn("Exit Fullscreen failed:", e);
    }
  };

  return { requestFullscreen, exitFullscreen };
}
