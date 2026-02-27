
const STORAGE_KEY = 'gemini_api_keys';
const ENV_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || '';

// Parse keys from storage
const getStoredKeys = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
};

// State to track exhausted keys in the current session
let exhaustedKeys: Set<string> = new Set();

export const apiKeyManager = {
  // Get all keys (User keys + Env key as backup)
  getAllKeys: (): string[] => {
    const userKeys = getStoredKeys();
    const keys = [...userKeys];
    if (ENV_KEY && !keys.includes(ENV_KEY)) {
      keys.push(ENV_KEY);
    }
    // Filter out empty strings
    return keys.filter(k => k.trim().length > 0);
  },

  // Check if any keys exist at all (even if exhausted)
  hasAnyKeys: (): boolean => {
    return apiKeyManager.getAllKeys().length > 0;
  },

  // Save user keys
  saveKeys: (keys: string[]) => {
    // Filter empty and duplicates
    const unique = Array.from(new Set(keys.filter(k => k.trim().length > 0)));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    // Reset exhausted state when keys are updated
    exhaustedKeys.clear();
  },

  // Get the current usable key
  getActiveKey: (): string | null => {
    const allKeys = apiKeyManager.getAllKeys();
    const available = allKeys.find(k => !exhaustedKeys.has(k));
    return available || null;
  },

  // Mark a key as failed (Quota exceeded)
  reportQuotaExceeded: (key: string) => {
    console.warn(`API Key marked as exhausted: ${key.slice(0, 8)}...`);
    exhaustedKeys.add(key);
  },

  // Check if we have any valid keys left
  hasAvailableKeys: (): boolean => {
    return apiKeyManager.getActiveKey() !== null;
  },
  
  // Get raw text for textarea
  getRawText: (): string => {
    return getStoredKeys().join('\n');
  }
};
