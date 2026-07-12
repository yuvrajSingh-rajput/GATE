import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarksRepository } from "@/lib/storage/repositories/bookmarks.repository";
import { Bookmark } from "@/types";

export function useBookmarks() {
  return useQuery({
    queryKey: ["bookmarks"],
    queryFn: () => bookmarksRepository.getAllBookmarks(),
  });
}

export function useIsBookmarked(questionId: string, testId: string) {
  return useQuery({
    queryKey: ["bookmarks", questionId, testId],
    queryFn: () => bookmarksRepository.isBookmarked(questionId, testId),
    enabled: !!questionId && !!testId,
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookmark: Bookmark) => bookmarksRepository.addBookmark(bookmark),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks", data.questionId, data.testId] });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ questionId, testId }: { questionId: string; testId: string }) =>
      bookmarksRepository.removeBookmark(questionId, testId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
      queryClient.invalidateQueries({ queryKey: ["bookmarks", variables.questionId, variables.testId] });
    },
  });
}
