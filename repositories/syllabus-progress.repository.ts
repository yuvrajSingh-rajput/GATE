const STORAGE_KEY = "gate_prep_syllabus_progress";

export interface SyllabusProgress {
  studiedTopics: string[]; // Array of topic IDs
}

export const syllabusProgressRepository = {
  async getProgress(): Promise<SyllabusProgress> {
    if (typeof window === "undefined") {
      return { studiedTopics: [] };
    }
    
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { studiedTopics: [] };
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to parse syllabus progress", error);
      return { studiedTopics: [] };
    }
  },

  async toggleTopic(topicId: string, studied: boolean): Promise<SyllabusProgress> {
    const progress = await this.getProgress();
    
    if (studied) {
      if (!progress.studiedTopics.includes(topicId)) {
        progress.studiedTopics.push(topicId);
      }
    } else {
      progress.studiedTopics = progress.studiedTopics.filter((id) => id !== topicId);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
    
    return progress;
  }
};
