import { UserProfile } from "@/types";
import { STORAGE_KEYS } from "../keys";
import { StorageClient } from "../storage-client";

// PHASE-2 TODO: Replace these localStorage calls with Prisma/MongoDB API endpoints
// This will eventually integrate with NextAuth sessions.

const DEFAULT_PROFILE: UserProfile = {
  name: "Apoorva Singh",
  createdAt: new Date().toISOString(),
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: "",
  },
};

export const profileRepository = {
  async getProfile(): Promise<UserProfile> {
    return StorageClient.get<UserProfile>(STORAGE_KEYS.PROFILE) || DEFAULT_PROFILE;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile();
    const updated = { ...current, ...updates };
    StorageClient.set(STORAGE_KEYS.PROFILE, updated);
    return updated;
  },

  async recordActivity(): Promise<void> {
    const profile = await this.getProfile();
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (profile.streak.lastActiveDate === today) {
      return; // Already active today
    }

    const lastActive = profile.streak.lastActiveDate ? new Date(profile.streak.lastActiveDate) : null;
    let newCurrent = profile.streak.current;

    if (lastActive) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      if (profile.streak.lastActiveDate === yesterdayStr) {
        newCurrent += 1;
      } else {
        newCurrent = 1;
      }
    } else {
      newCurrent = 1;
    }

    await this.updateProfile({
      streak: {
        current: newCurrent,
        longest: Math.max(profile.streak.longest, newCurrent),
        lastActiveDate: today,
      },
    });
  }
};
