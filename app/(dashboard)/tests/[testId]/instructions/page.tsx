"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTest } from "@/hooks/queries/useTests";
import { PaletteLegend } from "@/features/quiz-engine/components/PaletteLegend";
import { Button } from "@/components/ui/button";
import { useCreateAttempt } from "@/hooks/queries/useAttempts";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck } from "lucide-react";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

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
    <motion.div
      className="max-w-4xl mx-auto bg-card rounded-2xl shadow-lg border p-6 md:p-10 my-4"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <h1 className="font-heading text-2xl md:text-3xl tracking-tight mb-2">
          Instructions
        </h1>
        <p className="text-muted-foreground mb-8">
          Please read the following instructions carefully before starting{" "}
          <span className="font-semibold text-foreground">{testMeta.title}</span>.
        </p>
      </motion.div>

      <motion.div
        className="prose prose-sm md:prose-base dark:prose-invert max-w-none space-y-6"
        variants={fadeInUp}
      >
        <div>
          <h3 className="font-semibold text-lg">General Instructions:</h3>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>Total duration of the examination is <strong>{testMeta.durationMinutes} minutes</strong>.</li>
            <li>The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination. When the timer reaches zero, the examination will end by itself. You will not be required to end or submit your examination.</li>
            <li>The Question Palette displayed on the right side of screen will show the status of each question using one of the following symbols:</li>
          </ol>
        </div>

        <div className="bg-muted/60 p-5 rounded-xl border my-6 max-w-sm">
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
      </motion.div>

      <motion.div
        className="mt-10 pt-8 border-t flex flex-col items-center"
        variants={fadeInUp}
      >
        <label className="flex items-start gap-3 cursor-pointer mb-6 p-4 rounded-xl hover:bg-muted/50 border border-transparent hover:border-border transition-all duration-200 max-w-2xl">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded text-accent focus:ring-accent accent-[var(--accent)]"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm leading-relaxed">
            I have read and understood the instructions. All computer hardware allotted to me are in proper working condition. I declare that I am not in possession of / not wearing / not carrying any prohibited gadget like mobile phone, bluetooth devices etc.
          </span>
        </label>

        <Button
          size="lg"
          className="w-full sm:w-auto px-12 h-14 text-lg font-bold gradient-bg text-white rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-lg)] active:scale-[0.98] group disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          disabled={!agreed}
          onClick={handleBeginTest}
        >
          <ShieldCheck className="w-5 h-5 mr-2" />
          I am ready to begin
          <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </motion.div>
  );
}
