"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTest } from "@/hooks/queries/useTests";
import { PaletteLegend } from "@/features/quiz-engine/components/PaletteLegend";
import { Button } from "@/components/ui/button";
import { useCreateAttempt } from "@/hooks/queries/useAttempts";

export default function InstructionsPage() {
  const { testId } = useParams();
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const { mutateAsync: createAttempt } = useCreateAttempt();
  const { data: testData } = useTest(testId as string);

  const testMeta = testData?.testMeta;

  if (!testMeta || !testData) {
    return <div className="p-8">Test not found or loading...</div>;
  }

  const handleBeginTest = async () => {
    if (!agreed) return;

    const questions = testData.questions;
    if (!questions || questions.length === 0) return;

    const attemptId = crypto.randomUUID();
    const newAttempt = {
      id: attemptId,
      testId: testMeta.id,
      startedAt: new Date().toISOString(),
      submittedAt: null,
      durationMinutes: testMeta.durationMinutes,
      currentQuestionId: questions[0].id,
      status: "in-progress" as const,
      answers: {},
    };

    await createAttempt(newAttempt);
    router.push(`/tests/${testMeta.id}/attempt/${attemptId}`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-card rounded-2xl shadow-sm border p-6 md:p-10 my-4">
      <h1 className="text-2xl font-bold mb-2">Instructions</h1>
      <p className="text-muted-foreground mb-8">Please read the following instructions carefully.</p>

      <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6">
        <div>
          <h3 className="font-semibold text-lg">General Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>Total duration of the examination is <strong>{testMeta.durationMinutes} minutes</strong>.</li>
            <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
            <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</li>
          </ol>
        </div>

        <div className="bg-muted p-4 rounded-xl border my-6 max-w-sm">
          <PaletteLegend />
        </div>

        <div>
          <h3 className="font-semibold text-lg">Navigating to a Question:</h3>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Click on the question number in the Question Palette to go to that question directly.</li>
            <li>Click on <strong>Save & Next</strong> to save your answer for the current question and then go to the next question.</li>
            <li>Click on <strong>Mark for Review & Next</strong> to save your answer for the current question, mark it for review, and then go to the next question.</li>
          </ul>
        </div>
      </div>

      <div className="mt-10 pt-8 border-t flex flex-col items-center">
        <label className="flex items-start gap-3 cursor-pointer mb-6 p-4 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
          <input
            type="checkbox"
            className="mt-1 w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm">
            I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc.
          </span>
        </label>

        <Button
          size="lg"
          className="w-full sm:w-auto px-12 h-14 text-lg font-bold shadow-glow"
          disabled={!agreed}
          onClick={handleBeginTest}
        >
          I am ready to begin
        </Button>
      </div>
    </div>
  );
}
