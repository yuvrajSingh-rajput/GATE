import { useEffect } from "react";
import { useAttemptStore } from "../store/attempt-session.store";

export function useTimer() {
  const { status, tickTimer, submitAttempt, timeRemainingSeconds } = useAttemptStore();

  useEffect(() => {
    if (status !== "in-progress") return;

    const interval = setInterval(() => {
      tickTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [status, tickTimer]);

  useEffect(() => {
    if (status === "in-progress" && timeRemainingSeconds === 0) {
      submitAttempt(true);
    }
  }, [timeRemainingSeconds, status, submitAttempt]);
}
