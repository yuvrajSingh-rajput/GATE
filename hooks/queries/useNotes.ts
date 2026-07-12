import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notesRepository } from "@/lib/storage/repositories/notes.repository";
import { Note } from "@/types";

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: () => notesRepository.getAllNotes(),
  });
}

export function useNote(questionId: string) {
  return useQuery({
    queryKey: ["notes", questionId],
    queryFn: () => notesRepository.getNoteByQuestionId(questionId),
    enabled: !!questionId,
  });
}

export function useSaveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (note: Note) => notesRepository.saveNote(note),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", data.questionId] });
    },
  });
}

export function useRemoveNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionId: string) => notesRepository.removeNote(questionId),
    onSuccess: (_, questionId) => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["notes", questionId] });
    },
  });
}
