import { Note } from "@/types";
import { STORAGE_KEYS } from "../keys";
import { StorageClient } from "../storage-client";

// PHASE-2 TODO: Replace these localStorage calls with Prisma/MongoDB API endpoints

export const notesRepository = {
  async getAllNotes(): Promise<Note[]> {
    return StorageClient.get<Note[]>(STORAGE_KEYS.NOTES) || [];
  },

  async getNoteByQuestionId(questionId: string): Promise<Note | null> {
    const notes = await this.getAllNotes();
    return notes.find((n) => n.questionId === questionId) || null;
  },

  async saveNote(note: Note): Promise<Note> {
    const notes = await this.getAllNotes();
    const index = notes.findIndex((n) => n.questionId === note.questionId);
    
    if (index > -1) {
      notes[index] = note;
    } else {
      notes.push(note);
    }

    StorageClient.set(STORAGE_KEYS.NOTES, notes);
    return note;
  },

  async removeNote(questionId: string): Promise<void> {
    const notes = await this.getAllNotes();
    StorageClient.set(
      STORAGE_KEYS.NOTES,
      notes.filter((n) => n.questionId !== questionId)
    );
  }
};
