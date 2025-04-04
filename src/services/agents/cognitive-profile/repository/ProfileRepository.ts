
import { dbOperations } from './dbOperations';
import { cacheService } from './cacheService';

/**
 * Profile Repository
 * 
 * A facade that combines database operations and caching for cognitive profiles
 */
export class ProfileRepository {
  /**
   * Get a user's cognitive profile
   */
  async getProfile(userId: string) {
    // Try to get from cache first
    const cachedProfile = cacheService.getItem(`profile-${userId}`);
    if (cachedProfile) {
      return cachedProfile;
    }
    
    // If not in cache, get from database
    const profile = await dbOperations.getProfile(userId);
    
    // Cache the result
    if (profile) {
      cacheService.setItem(`profile-${userId}`, profile);
    }
    
    return profile;
  }
  
  /**
   * Save or update a user's cognitive profile
   */
  async saveProfile(userId: string, profileData: any) {
    // Save to database
    const success = await dbOperations.saveProfile(userId, profileData);
    
    // Update cache
    if (success) {
      cacheService.setItem(`profile-${userId}`, profileData);
    }
    
    return success;
  }
  
  /**
   * Update specific aspects of a user's cognitive profile
   */
  async updateProfile(userId: string, updates: any) {
    // Update in database
    const success = await dbOperations.updateProfile(userId, updates);
    
    // If successful, update cache
    if (success) {
      const existingProfile = cacheService.getItem(`profile-${userId}`) || {};
      cacheService.setItem(`profile-${userId}`, { ...existingProfile, ...updates });
    }
    
    return success;
  }
  
  /**
   * Clear cached profile data
   */
  clearCache(userId?: string) {
    if (userId) {
      cacheService.removeItem(`profile-${userId}`);
    } else {
      cacheService.clear();
    }
  }
}
