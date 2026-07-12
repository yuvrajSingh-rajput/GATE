import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attemptsRepository } from "@/lib/storage/repositories/attempts.repository";
import { Attempt, AttemptResult } from "@/types";

export function useAttempts() {
  return useQuery({
    queryKey: ["attempts"],
    queryFn: () => attemptsRepository.getAllAttempts(),
  });
}

export function useAttempt(id: string) {
  return useQuery({
    queryKey: ["attempts", id],
    queryFn: () => attemptsRepository.getAttemptById(id),
    enabled: !!id,
  });
}

export function useCreateAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (attempt: Attempt) => attemptsRepository.createAttempt(attempt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
    },
  });
}

export function useUpdateAttempt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Attempt> }) =>
      attemptsRepository.updateAttempt(id, updates),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["attempts"] });
      queryClient.invalidateQueries({ queryKey: ["attempts", variables.id] });
    },
  });
}

export function useAttemptResult(attemptId: string) {
  return useQuery({
    queryKey: ["attempt-results", attemptId],
    queryFn: () => attemptsRepository.getResultByAttemptId(attemptId),
    enabled: !!attemptId,
  });
}

export function useAllResults() {
  return useQuery({
    queryKey: ["attempt-results"],
    queryFn: () => attemptsRepository.getAllResults(),
  });
}

export function useSaveResult() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (result: AttemptResult) => attemptsRepository.saveResult(result),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["attempt-results"] });
      queryClient.invalidateQueries({ queryKey: ["attempt-results", data.attemptId] });
    },
  });
}
