
/**
 * Cache service for cognitive profiles
 */

// Simple in-memory cache
const cache = new Map<string, any>();

export const cacheService = {
  // Cache operations
  setItem: (key: string, value: any) => {
    cache.set(key, value);
  },
  
  getItem: (key: string) => {
    return cache.get(key) || null;
  },
  
  removeItem: (key: string) => {
    cache.delete(key);
  },
  
  clear: () => {
    cache.clear();
  }
};
