import { useEffect } from "react";

export function useNavigationGuard(isActive: boolean) {
  useEffect(() => {
    if (!isActive) return;

    // 1. Prevent tab close / reload
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = ""; // required for Chrome
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // 2. Prevent in-app navigation (soft navigation via Next.js links)
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (target && target.href) {
        const isInternal = target.href.startsWith(window.location.origin);
        if (isInternal) {
          const confirmLeave = window.confirm(
            "Leaving now will not submit your test — your progress is saved and you can resume later. Are you sure?"
          );
          if (!confirmLeave) {
            e.preventDefault();
            e.stopPropagation();
          }
        }
      }
    };

    // Capture phase to intercept before Next.js handles it
    document.addEventListener("click", handleLinkClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleLinkClick, true);
    };
  }, [isActive]);
}
