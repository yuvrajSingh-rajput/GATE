import { AttemptAnswer } from "@/types";

export function deriveStatus(
  currentStatus: AttemptAnswer["status"] | undefined,
  hasAnswer: boolean,
  isMarkedForReview: boolean
): AttemptAnswer["status"] {
  if (hasAnswer && isMarkedForReview) return "answered-marked";
  if (hasAnswer) return "answered";
  if (isMarkedForReview) return "marked";
  if (currentStatus === "not-visited" || !currentStatus) return "not-answered"; // once visited, it becomes not-answered if no answer
  return currentStatus;
}
