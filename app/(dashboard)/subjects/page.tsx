"use client";

import React from "react";
import { GATE_CS_SYLLABUS } from "@/data/syllabus";
import { useSyllabusProgress, useToggleTopic } from "@/hooks/queries/useSyllabusProgress";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: any = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

export default function SubjectsPage() {
  const { data: progress, isLoading } = useSyllabusProgress();
  const { mutate: toggleTopic } = useToggleTopic();

  if (isLoading || !progress) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-64 rounded-xl" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const studiedSet = new Set(progress.studiedTopics);

  return (
    <motion.div
      className="max-w-5xl mx-auto space-y-8 pb-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-md">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl tracking-tight">
            GATE CS <span className="gradient-text">Syllabus</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-lg ml-13">
          Track your study progress across all subjects.
        </p>
      </motion.div>

      <motion.div className="space-y-6" variants={stagger}>
        {GATE_CS_SYLLABUS.map((subject) => {
          const completedTopics = subject.topics.filter((t) => studiedSet.has(t.id)).length;
          const totalTopics = subject.topics.length;
          const progressPercent = totalTopics === 0 ? 0 : Math.round((completedTopics / totalTopics) * 100);

          return (
            <motion.div
              key={subject.id}
              className="bg-card border rounded-2xl p-6 shadow-sm overflow-hidden"
              variants={fadeInUp}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold tracking-tight mb-1">{subject.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {completedTopics} of {totalTopics} topics completed
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Progress Ring */}
                  <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-muted/50"
                        strokeWidth="3"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-accent transition-all duration-500 ease-out"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeWidth="3"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-mono text-[10px] font-bold">
                      {progressPercent}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {subject.topics.map((topic) => {
                  const isStudied = studiedSet.has(topic.id);
                  return (
                    <label
                      key={topic.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:bg-muted/50 group",
                        isStudied ? "bg-accent/5 border-accent/20" : "border-transparent"
                      )}
                    >
                      <div className="pt-0.5">
                        <Checkbox
                          checked={isStudied}
                          onCheckedChange={(checked) =>
                            toggleTopic({ topicId: topic.id, studied: checked === true })
                          }
                          className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                      </div>
                      <span
                        className={cn(
                          "text-sm leading-snug transition-colors duration-200",
                          isStudied ? "text-foreground font-medium" : "text-muted-foreground"
                        )}
                      >
                        {topic.name}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* PHASE-1.5 TODO: Add specific topic/subject practice filtering here when questions have subject tags */}
              {/* <div className="mt-4 pt-4 border-t flex justify-end">
                  <Button variant="outline" size="sm">Practice Subject</Button>
              </div> */}
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
