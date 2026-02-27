import { SavedPrompt } from '../types';

const STORAGE_KEY = 'algodao_saved_prompts';

export const storageService = {
  savePrompt: (prompt: Omit<SavedPrompt, 'id' | 'timestamp'>): SavedPrompt => {
    const saved = storageService.getAllPrompts();
    const newPrompt: SavedPrompt = {
      ...prompt,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    // Keep only last 50 prompts to avoid storage limits
    const updated = [newPrompt, ...saved].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newPrompt;
  },

  getAllPrompts: (): SavedPrompt[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to parse saved prompts', e);
      return [];
    }
  },

  deletePrompt: (id: string) => {
    const saved = storageService.getAllPrompts();
    const updated = saved.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  clearAll: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
