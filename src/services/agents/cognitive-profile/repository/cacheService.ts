
import { CognitiveProfile } from '../../types/profileTypes';

/**
 * Service for caching cognitive profiles in memory
 */
export class ProfileCacheService {
  private profileCache: Map<string, CognitiveProfile> = new Map();
  
  /**
   * Get a cached profile if available
   */
  public getFromCache(userId: string): CognitiveProfile | null {
    return this.profileCache.get(userId) || null;
  }
  
  /**
   * Store a profile in the cache
   */
  public saveToCache(profile: CognitiveProfile): void {
    this.profileCache.set(profile.userId, profile);
  }
  
  /**
   * Clear a specific profile from cache
   */
  public clearFromCache(userId: string): void {
    this.profileCache.delete(userId);
  }
  
  /**
   * Clear all profiles from cache
   */
  public clearAllCache(): void {
    this.profileCache.clear();
  }
}
