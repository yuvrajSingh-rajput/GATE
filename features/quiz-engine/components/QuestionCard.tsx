"use client";

import React from "react";
import { Question, AttemptAnswer } from "@/types";
import { FormattedText } from "@/components/shared/FormattedText";
import { ZoomableImage } from "@/components/shared/ZoomableImage";
import { OptionList } from "./OptionList";
import { MSQOptionList } from "./MSQOptionList";
import { NATInput } from "./NATInput";
import { BookmarkPlus, BookmarkCheck, MoreVertical, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QuestionCardProps {
  testId: string;
  question: Question;
  answer: AttemptAnswer | undefined;
  onAnswerChange: (selected: string[]) => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  isPracticeMode?: boolean;
  showSolution?: boolean;
  onNextQuestion?: () => void;
}

export function QuestionCard({
  testId,
  question,
  answer,
  onAnswerChange,
  isBookmarked,
  onToggleBookmark,
  isPracticeMode,
  showSolution,
  onNextQuestion,
}: QuestionCardProps) {
  const selected = answer?.selected || [];

  const handleMCQChange = (optionId: string) => {
    onAnswerChange([optionId]);
  };

  const handleMSQChange = (optionId: string) => {
    if (selected.includes(optionId)) {
      onAnswerChange(selected.filter((id) => id !== optionId));
    } else {
      onAnswerChange([...selected, optionId]);
    }
  };

  const handleNATChange = (val: string) => {
    onAnswerChange([val]);
  };

  return (
    <div 
      className="flex flex-col h-full bg-card border rounded-2xl overflow-hidden shadow-sm"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="default" className="text-sm px-3 py-1 bg-primary text-primary-foreground">
            Q. {question.number}
          </Badge>
          <Badge variant="outline" className="text-sm font-normal">
            {question.type}
          </Badge>
          <Badge variant="secondary" className="text-sm font-normal text-success bg-success/10 border-success/20">
            +{question.marks}
          </Badge>
          {question.negativeMarks > 0 && (
            <Badge variant="secondary" className="text-sm font-normal text-destructive bg-destructive/10 border-destructive/20">
              -{question.negativeMarks}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleBookmark}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
            className={isBookmarked ? "text-primary" : "text-muted-foreground"}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5" /> : <BookmarkPlus className="w-5 h-5" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="text-muted-foreground" />}
            >
              <MoreVertical className="w-5 h-5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="text-warning focus:bg-warning/10 focus:text-warning">
                <Flag className="w-4 h-4 mr-2" />
                Report Error
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-3xl">
          <FormattedText text={question.questionText} className="mb-6" />
          
          {question.questionImage && (
            <div className="mb-8">
              <ZoomableImage
                src={`/api/images/${testId}/${question.questionImage}`}
                alt={`Figure for Question ${question.number}`}
              />
            </div>
          )}

          <div className="mt-8">
            {question.type === "MCQ" && (
              <OptionList
                testId={testId}
                options={question.options}
                selectedOption={selected[0] || null}
                onChange={handleMCQChange}
                showSolution={showSolution}
                correctAnswer={question.correctAnswer}
              />
            )}
            {question.type === "MSQ" && (
              <MSQOptionList
                testId={testId}
                options={question.options}
                selectedOptions={selected}
                onChange={handleMSQChange}
                showSolution={showSolution}
                correctAnswer={question.correctAnswer}
              />
            )}
            {question.type === "NAT" && (
              <NATInput
                value={selected[0] || ""}
                onChange={handleNATChange}
                showSolution={showSolution}
                natRange={question.natRange}
              />
            )}
          </div>

          {isPracticeMode && showSolution && (
            <div className="mt-8 pt-8 border-t border-border/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-lg font-bold mb-4 text-foreground/90">Solution</h3>
              <div className="bg-muted/30 p-6 rounded-2xl border border-border/50">
                <FormattedText text={question.solution} />
              </div>
              {onNextQuestion && (
                <div className="mt-8 flex justify-end">
                  <Button onClick={onNextQuestion} className="rounded-xl px-8 py-6 text-base" size="lg">
                    Next Question
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
