
import { CognitiveProfile } from '../../types';
import { CognitiveProfileDbOperations } from './dbOperations';
import { ProfileCacheService } from './cacheService';
import { ProfileUpdateOptions } from '../types';

/**
 * Repository for cognitive profiles that handles caching and database operations
 */
export class ProfileRepository {
  private dbOperations: CognitiveProfileDbOperations;
  private cacheService: ProfileCacheService;
  
  constructor() {
    this.dbOperations = new CognitiveProfileDbOperations();
    this.cacheService = new ProfileCacheService();
  }
  
  /**
   * Retrieve the cognitive profile for a user
   * First checks cache, then database if not found in cache
   */
  public async getCognitiveProfile(userId: string): Promise<CognitiveProfile | null> {
    console.log(`Retrieving cognitive profile for user ${userId}`);
    
    try {
      // Check cache first
      const cachedProfile = this.cacheService.getFromCache(userId);
      if (cachedProfile) {
        console.log(`Retrieved profile from cache for user ${userId}`);
        return cachedProfile;
      }
      
      // If not in cache, check database
      const dbProfile = await this.dbOperations.fetchProfile(userId);
      
      // If found in database, cache it for future use
      if (dbProfile) {
        this.cacheService.saveToCache(dbProfile);
      }
      
      return dbProfile;
    } catch (error) {
      console.error('Error retrieving cognitive profile:', error);
      return null;
    }
  }
  
  /**
   * Save a cognitive profile
   */
  public async saveProfile(profile: CognitiveProfile): Promise<void> {
    try {
      // Save to database
      await this.dbOperations.saveProfile(profile);
      
      // Update cache
      this.cacheService.saveToCache(profile);
    } catch (error) {
      console.error('Error saving cognitive profile:', error);
      throw error;
    }
  }
  
  /**
   * Update a cognitive profile with new data
   */
  public async updateProfile(options: ProfileUpdateOptions): Promise<CognitiveProfile | null> {
    const { userId, newData } = options;
    
    // Get existing profile
    const existingProfile = await this.getCognitiveProfile(userId);
    if (!existingProfile) {
      console.error(`Cannot update non-existent profile for user ${userId}`);
      return null;
    }
    
    // Merge existing profile with new data
    const updatedProfile: CognitiveProfile = {
      ...existingProfile,
      ...newData,
      lastUpdated: new Date().toISOString()
    };
    
    // Save updated profile
    await this.saveProfile(updatedProfile);
    
    return updatedProfile;
  }
  
  /**
   * Clear a profile from cache
   */
  public clearProfileCache(userId: string): void {
    this.cacheService.clearFromCache(userId);
  }
}
