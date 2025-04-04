
import { dbOperations } from './dbOperations';
import { cacheService } from './cacheService';
import { CognitiveProfile } from '../../types';

/**
 * Profile Repository
 * 
 * A facade that combines database operations and caching for cognitive profiles
 */
export class ProfileRepository {
  /**
   * Get a user's cognitive profile
   */
  async getProfile(userId: string): Promise<CognitiveProfile | null> {
    // Try to get from cache first
    const cachedProfile = cacheService.getItem(`profile-${userId}`);
    if (cachedProfile) {
      return cachedProfile as CognitiveProfile;
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
   * Get a user's cognitive profile (alias for getProfile)
   */
  async getCognitiveProfile(userId: string): Promise<CognitiveProfile | null> {
    return this.getProfile(userId);
  }
  
  /**
   * Save or update a user's cognitive profile
   */
  async saveProfile(userId: string, profileData: Partial<CognitiveProfile>): Promise<boolean> {
    // Save to database
    const success = await dbOperations.saveProfile(userId, profileData);
    
    // Update cache
    if (success) {
      const existingProfile = await this.getProfile(userId) || { userId };
      const updatedProfile = { ...existingProfile, ...profileData };
      cacheService.setItem(`profile-${userId}`, updatedProfile);
    }
    
    return success;
  }
  
  /**
   * Update specific aspects of a user's cognitive profile
   */
  async updateProfile(userId: string, updates: Partial<CognitiveProfile>): Promise<boolean> {
    // Update in database
    const success = await dbOperations.updateProfile(userId, updates);
    
    // If successful, update cache
    if (success) {
      const existingProfile = await this.getProfile(userId) || { userId };
      const updatedProfile = { ...existingProfile, ...updates };
      cacheService.setItem(`profile-${userId}`, updatedProfile);
    }
    
    return success;
  }
  
  /**
   * Clear cached profile data
   */
  clearCache(userId?: string): void {
    if (userId) {
      cacheService.removeItem(`profile-${userId}`);
    } else {
      cacheService.clear();
    }
  }
}
