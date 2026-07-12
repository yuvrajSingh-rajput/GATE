import { Attempt, Question, AttemptResult } from "@/types";

export function computeScore(attempt: Attempt, questions: Question[]): AttemptResult {
  let totalMarks = 0;
  let scoredMarks = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let skippedCount = 0;

  const sectionWise: Record<
    string,
    { scored: number; total: number; correct: number; incorrect: number; skipped: number }
  > = {};

  for (const question of questions) {
    if (!sectionWise[question.section]) {
      sectionWise[question.section] = { scored: 0, total: 0, correct: 0, incorrect: 0, skipped: 0 };
    }

    const answer = attempt.answers[question.id];
    const sectionStats = sectionWise[question.section];

    totalMarks += question.marks;
    sectionStats.total += question.marks;

    if (!answer || answer.status === "not-visited" || answer.status === "not-answered" || answer.selected.length === 0) {
      skippedCount++;
      sectionStats.skipped++;
      continue;
    }

    let isCorrect = false;
    let isPartial = false;
    let scoreDelta = 0;

    if (question.type === "NAT") {
      const val = parseFloat(answer.selected[0]);
      if (!isNaN(val) && question.natRange && val >= question.natRange[0] && val <= question.natRange[1]) {
        isCorrect = true;
      }
    } else if (question.type === "MCQ") {
      // Sort to ensure order doesn't matter (though MCQ is usually just 1 option)
      const userAns = [...answer.selected].sort();
      const correctAns = [...question.correctAnswer].sort();
      if (userAns.length === correctAns.length && userAns.every((val, index) => val === correctAns[index])) {
        isCorrect = true;
      }
    } else if (question.type === "MSQ") {
      const userSet = new Set(answer.selected);
      const correctSet = new Set(question.correctAnswer);

      const isExactMatch = userSet.size === correctSet.size && [...userSet].every((val) => correctSet.has(val));
      const hasIncorrectSelection = [...userSet].some((val) => !correctSet.has(val));

      if (isExactMatch) {
        isCorrect = true;
      } else if (!hasIncorrectSelection && userSet.size > 0) {
        isPartial = true;
      }
    }

    if (isCorrect) {
      scoreDelta = question.marks;
      correctCount++;
      sectionStats.correct++;
    } else if (isPartial) {
      scoreDelta = 0;
      skippedCount++; // count partial as skipped or incorrect? Spec says "bucket = 'partial'" but only correct/incorrect/skipped in Result. Let's bucket partial as incorrect or skipped? "No negative marking for partial MSQ... scored = 0". Let's put in skipped for now.
      sectionStats.skipped++;
    } else {
      scoreDelta = -question.negativeMarks;
      incorrectCount++;
      sectionStats.incorrect++;
    }

    scoredMarks += scoreDelta;
    sectionStats.scored += scoreDelta;
  }

  // Round scored marks to 2 decimal places to avoid floating point issues
  scoredMarks = Math.round(scoredMarks * 100) / 100;
  for (const key in sectionWise) {
    sectionWise[key].scored = Math.round(sectionWise[key].scored * 100) / 100;
  }

  const attemptedCount = correctCount + incorrectCount;
  const accuracy = attemptedCount > 0 ? correctCount / attemptedCount : 0;

  return {
    attemptId: attempt.id,
    testId: attempt.testId,
    totalMarks,
    scoredMarks,
    correctCount,
    incorrectCount,
    skippedCount,
    sectionWise,
    accuracy,
    submittedAt: attempt.submittedAt || new Date().toISOString(),
  };
}
