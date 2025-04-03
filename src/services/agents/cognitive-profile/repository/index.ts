
import { CognitiveProfile } from '../../types';
import { dbOperations } from './dbOperations';
import { cacheService } from './cacheService';

// Define the missing interface
export interface ProfileUpdateOptions {
  mergeKnowledgeGraph?: boolean;
  overwriteContentPreferences?: boolean;
  updateTimestamp?: boolean;
}

/**
 * Repository for cognitive profile operations
 */
export class ProfileRepository {
  /**
   * Get cognitive profile for a user
   */
  public async getCognitiveProfile(userId: string): Promise<CognitiveProfile | null> {
    // Check cache first
    const cachedProfile = cacheService.getProfile(userId);
    if (cachedProfile) {
      return cachedProfile;
    }
    
    // Get from DB if not in cache
    try {
      const profile = await dbOperations.getProfile(userId);
      
      if (profile) {
        // Update cache
        cacheService.cacheProfile(profile);
      }
      
      return profile;
    } catch (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * Save a new or updated cognitive profile
   */
  public async saveProfile(profile: CognitiveProfile): Promise<boolean> {
    try {
      // Save to DB
      const success = await dbOperations.saveProfile(profile);
      
      if (success) {
        // Update cache
        cacheService.cacheProfile(profile);
      }
      
      return success;
    } catch (error) {
      console.error(`Error saving profile for user ${profile.userId}:`, error);
      return false;
    }
  }
  
  /**
   * Update specific properties of a cognitive profile
   */
  public async updateProfile(
    userId: string, 
    updates: Partial<CognitiveProfile>,
    options: ProfileUpdateOptions = {}
  ): Promise<CognitiveProfile | null> {
    try {
      // Get current profile
      const currentProfile = await this.getCognitiveProfile(userId);
      
      if (!currentProfile) {
        console.error(`No profile found for user ${userId}`);
        return null;
      }
      
      // Apply updates with options
      const updatedProfile = this.applyProfileUpdates(currentProfile, updates, options);
      
      // Save updated profile
      const success = await this.saveProfile(updatedProfile);
      
      return success ? updatedProfile : null;
    } catch (error) {
      console.error(`Error updating profile for user ${userId}:`, error);
      return null;
    }
  }
  
  /**
   * Delete a cognitive profile
   */
  public async deleteProfile(userId: string): Promise<boolean> {
    try {
      // Delete from DB
      const success = await dbOperations.deleteProfile(userId);
      
      if (success) {
        // Remove from cache
        cacheService.removeProfile(userId);
      }
      
      return success;
    } catch (error) {
      console.error(`Error deleting profile for user ${userId}:`, error);
      return false;
    }
  }
  
  /**
   * Apply updates to a profile, respecting the provided options
   */
  private applyProfileUpdates(
    profile: CognitiveProfile, 
    updates: Partial<CognitiveProfile>,
    options: ProfileUpdateOptions
  ): CognitiveProfile {
    const result: CognitiveProfile = { ...profile };
    
    // Apply each update according to options
    Object.entries(updates).forEach(([key, value]) => {
      const typedKey = key as keyof CognitiveProfile;
      
      if (typedKey === 'knowledgeGraph' && options.mergeKnowledgeGraph && result.knowledgeGraph) {
        // Merge knowledge graph instead of replacing
        result.knowledgeGraph = this.mergeKnowledgeGraphs(
          result.knowledgeGraph,
          value as Record<string, string[]>
        );
      } 
      else if (typedKey === 'preferredContentFormats' && !options.overwriteContentPreferences) {
        // Don't overwrite content preferences unless specified
        // Do nothing
      }
      else {
        // Standard property update
        (result as any)[typedKey] = value;
      }
    });
    
    // Update timestamp if requested
    if (options.updateTimestamp !== false) {
      result.lastUpdated = new Date().toISOString();
    }
    
    return result;
  }
  
  /**
   * Merge two knowledge graphs
   */
  private mergeKnowledgeGraphs(
    original: Record<string, string[]>,
    update: Record<string, string[]>
  ): Record<string, string[]> {
    const result: Record<string, string[]> = { ...original };
    
    // Merge each domain's topics
    Object.entries(update).forEach(([domain, topics]) => {
      if (!result[domain]) {
        result[domain] = [];
      }
      
      // Add new topics without duplicates
      topics.forEach(topic => {
        if (!result[domain].includes(topic)) {
          result[domain].push(topic);
        }
      });
    });
    
    return result;
  }
}
