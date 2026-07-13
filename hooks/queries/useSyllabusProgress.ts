import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { syllabusProgressRepository } from "@/repositories/syllabus-progress.repository";

export function useSyllabusProgress() {
  return useQuery({
    queryKey: ["syllabusProgress"],
    queryFn: () => syllabusProgressRepository.getProgress(),
  });
}

export function useToggleTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ topicId, studied }: { topicId: string; studied: boolean }) =>
      syllabusProgressRepository.toggleTopic(topicId, studied),
    onSuccess: (newProgress) => {
      queryClient.setQueryData(["syllabusProgress"], newProgress);
    },
  });
}
