import { Attempt, AttemptResult } from "@/types";
import { STORAGE_KEYS } from "../keys";
import { StorageClient } from "../storage-client";

// PHASE-2 TODO: Replace these localStorage calls with Prisma/MongoDB API endpoints

export const attemptsRepository = {
  async getAllAttempts(): Promise<Attempt[]> {
    return StorageClient.get<Attempt[]>(STORAGE_KEYS.ATTEMPTS) || [];
  },

  async getAttemptById(id: string): Promise<Attempt | null> {
    const attempts = await this.getAllAttempts();
    return attempts.find((a) => a.id === id) || null;
  },

  async createAttempt(attempt: Attempt): Promise<Attempt> {
    const attempts = await this.getAllAttempts();
    StorageClient.set(STORAGE_KEYS.ATTEMPTS, [...attempts, attempt]);
    return attempt;
  },

  async updateAttempt(id: string, updates: Partial<Attempt>): Promise<Attempt | null> {
    const attempts = await this.getAllAttempts();
    const index = attempts.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updatedAttempt = { ...attempts[index], ...updates };
    attempts[index] = updatedAttempt;
    StorageClient.set(STORAGE_KEYS.ATTEMPTS, attempts);
    return updatedAttempt;
  },

  async removeAttempt(id: string): Promise<void> {
    const attempts = await this.getAllAttempts();
    StorageClient.set(
      STORAGE_KEYS.ATTEMPTS,
      attempts.filter((a) => a.id !== id)
    );
  },

  // Store AttemptResults alongside Attempts or separate key. Let's use a separate key for clarity.
  async getResultByAttemptId(attemptId: string): Promise<AttemptResult | null> {
    const results = StorageClient.get<AttemptResult[]>(`${STORAGE_KEYS.ATTEMPTS}:results`) || [];
    return results.find((r) => r.attemptId === attemptId) || null;
  },

  async saveResult(result: AttemptResult): Promise<AttemptResult> {
    const results = StorageClient.get<AttemptResult[]>(`${STORAGE_KEYS.ATTEMPTS}:results`) || [];
    const index = results.findIndex((r) => r.attemptId === result.attemptId);
    
    if (index > -1) {
      results[index] = result;
    } else {
      results.push(result);
    }
    
    StorageClient.set(`${STORAGE_KEYS.ATTEMPTS}:results`, results);
    return result;
  },

  async getAllResults(): Promise<AttemptResult[]> {
    return StorageClient.get<AttemptResult[]>(`${STORAGE_KEYS.ATTEMPTS}:results`) || [];
  }
};
