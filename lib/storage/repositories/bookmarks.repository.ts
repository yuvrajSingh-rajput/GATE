import { Bookmark } from "@/types";
import { STORAGE_KEYS } from "../keys";
import { StorageClient } from "../storage-client";

// PHASE-2 TODO: Replace these localStorage calls with Prisma/MongoDB API endpoints

export const bookmarksRepository = {
  async getAllBookmarks(): Promise<Bookmark[]> {
    return StorageClient.get<Bookmark[]>(STORAGE_KEYS.BOOKMARKS) || [];
  },

  async addBookmark(bookmark: Bookmark): Promise<Bookmark> {
    const bookmarks = await this.getAllBookmarks();
    // avoid duplicates
    if (!bookmarks.some((b) => b.questionId === bookmark.questionId && b.testId === bookmark.testId)) {
      StorageClient.set(STORAGE_KEYS.BOOKMARKS, [...bookmarks, bookmark]);
    }
    return bookmark;
  },

  async removeBookmark(questionId: string, testId: string): Promise<void> {
    const bookmarks = await this.getAllBookmarks();
    StorageClient.set(
      STORAGE_KEYS.BOOKMARKS,
      bookmarks.filter((b) => !(b.questionId === questionId && b.testId === testId))
    );
  },

  async isBookmarked(questionId: string, testId: string): Promise<boolean> {
    const bookmarks = await this.getAllBookmarks();
    return bookmarks.some((b) => b.questionId === questionId && b.testId === testId);
  }
};
