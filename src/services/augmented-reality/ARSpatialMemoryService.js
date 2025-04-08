/**
 * AR Spatial Memory Service
 * Service for spatial memory techniques in AR environments
 */

import { supabase } from '@/integrations/supabase/client';
import { ARStudyEnvironmentService } from './ARStudyEnvironmentService';

/**
 * AR Spatial Memory Service class
 */
export class ARSpatialMemoryService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.arStudyEnvironment = ARStudyEnvironmentService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {ARSpatialMemoryService} The singleton instance
   */
  static getInstance() {
    if (!ARSpatialMemoryService.instance) {
      ARSpatialMemoryService.instance = new ARSpatialMemoryService();
    }
    return ARSpatialMemoryService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AR Spatial Memory Service for user:', userId);
      this.userId = userId;
      
      // Ensure AR Study Environment Service is initialized
      if (!this.arStudyEnvironment.initialized) {
        await this.arStudyEnvironment.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AR Spatial Memory Service:', error);
      return false;
    }
  }
  
  /**
   * Create a memory palace
   * @param {Object} palaceData - Memory palace data
   * @param {string} palaceData.name - Palace name
   * @param {string} [palaceData.description] - Palace description
   * @param {string} palaceData.environmentType - Environment type
   * @param {Object} [palaceData.settings={}] - Environment settings
   * @returns {Promise<Object>} Created memory palace
   */
  async createMemoryPalace(palaceData) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    const {
      name,
      description = '',
      environmentType,
      settings = {}
    } = palaceData;
    
    // Create study space for memory palace
    const space = await this.arStudyEnvironment.createStudySpace({
      name,
      description,
      environmentType,
      settings: {
        ...settings,
        isMemoryPalace: true
      },
      isPublic: false
    });
    
    return space;
  }
  
  /**
   * Get user's memory palaces
   * @returns {Promise<Array<Object>>} User's memory palaces
   */
  async getUserMemoryPalaces() {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get user's study spaces that are memory palaces
    const { data, error } = await supabase
      .from('ar_study_spaces')
      .select('*')
      .eq('user_id', this.userId)
      .contains('settings', { isMemoryPalace: true })
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Add memory item to palace
   * @param {string} palaceId - Memory palace ID
   * @param {Object} itemData - Memory item data
   * @param {string} itemData.content - Item content
   * @param {string} [itemData.associatedImage] - Associated image URL
   * @param {Object} itemData.position - 3D position
   * @param {Object} itemData.rotation - 3D rotation
   * @param {Object} itemData.scale - 3D scale
   * @param {Object} [itemData.settings={}] - Item settings
   * @returns {Promise<Object>} Created memory item
   */
  async addMemoryItem(palaceId, itemData) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    const {
      content,
      associatedImage,
      position,
      rotation,
      scale,
      settings = {}
    } = itemData;
    
    // Create memory item as a study object
    const object = await this.arStudyEnvironment.addStudyObject(palaceId, {
      objectType: 'memory_item',
      contentType: 'memory_item',
      contentId: null,
      position,
      rotation,
      scale,
      settings: {
        ...settings,
        content,
        associatedImage,
        lastReviewedAt: null,
        reviewCount: 0,
        memoryStrength: 0
      }
    });
    
    return object;
  }
  
  /**
   * Get memory palace items
   * @param {string} palaceId - Memory palace ID
   * @returns {Promise<Array<Object>>} Memory palace items
   */
  async getMemoryPalaceItems(palaceId) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get memory items
    const { data, error } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('space_id', palaceId)
      .eq('object_type', 'memory_item')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Record memory item review
   * @param {string} itemId - Memory item ID
   * @param {number} recallQuality - Recall quality (0-5)
   * @returns {Promise<Object>} Updated memory item
   */
  async recordMemoryItemReview(itemId, recallQuality) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get current item
    const { data: item, error: itemError } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('id', itemId)
      .single();
    
    if (itemError) throw itemError;
    
    // Calculate new memory strength
    const currentStrength = item.settings.memoryStrength || 0;
    const reviewCount = (item.settings.reviewCount || 0) + 1;
    
    // Simple spaced repetition algorithm
    // recallQuality: 0-5 (0 = complete blackout, 5 = perfect recall)
    let memoryStrength;
    
    if (recallQuality < 3) {
      // If recall was difficult, reset memory strength
      memoryStrength = Math.max(0, currentStrength - 1);
    } else {
      // If recall was good, increase memory strength
      memoryStrength = currentStrength + (recallQuality - 2) / 2;
    }
    
    // Update settings
    const settings = {
      ...item.settings,
      lastReviewedAt: new Date().toISOString(),
      reviewCount,
      memoryStrength,
      recallHistory: [
        ...(item.settings.recallHistory || []),
        {
          timestamp: new Date().toISOString(),
          recallQuality,
          memoryStrength
        }
      ]
    };
    
    // Update item
    const { data: updatedItem, error } = await supabase
      .from('ar_study_objects')
      .update({
        settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', itemId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedItem;
  }
  
  /**
   * Get memory items due for review
   * @param {string} [palaceId] - Memory palace ID (optional, if not provided, get items from all palaces)
   * @returns {Promise<Array<Object>>} Memory items due for review
   */
  async getMemoryItemsDueForReview(palaceId = null) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get user's memory palaces
    let palaceIds;
    
    if (palaceId) {
      palaceIds = [palaceId];
    } else {
      const palaces = await this.getUserMemoryPalaces();
      palaceIds = palaces.map(palace => palace.id);
    }
    
    if (palaceIds.length === 0) {
      return [];
    }
    
    // Get all memory items from these palaces
    const { data: items, error } = await supabase
      .from('ar_study_objects')
      .select(`
        *,
        space:space_id(id, name)
      `)
      .in('space_id', palaceIds)
      .eq('object_type', 'memory_item');
    
    if (error) throw error;
    
    if (!items || items.length === 0) {
      return [];
    }
    
    // Calculate due items
    const now = new Date();
    const dueItems = items.filter(item => {
      // If never reviewed, it's due
      if (!item.settings.lastReviewedAt) {
        return true;
      }
      
      const lastReviewed = new Date(item.settings.lastReviewedAt);
      const memoryStrength = item.settings.memoryStrength || 0;
      
      // Calculate interval based on memory strength
      // This is a simple implementation of the SuperMemo SM-2 algorithm
      const interval = Math.pow(2, memoryStrength) * 24 * 60 * 60 * 1000; // in milliseconds
      
      // Check if due
      return (now - lastReviewed) >= interval;
    });
    
    return dueItems;
  }
  
  /**
   * Generate optimal review path
   * @param {string} palaceId - Memory palace ID
   * @returns {Promise<Array<Object>>} Ordered list of items to review
   */
  async generateOptimalReviewPath(palaceId) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get memory items due for review
    const dueItems = await this.getMemoryItemsDueForReview(palaceId);
    
    if (dueItems.length === 0) {
      return [];
    }
    
    // Sort items by priority
    // 1. Never reviewed items first
    // 2. Items with lower memory strength
    // 3. Items that have been due longer
    const sortedItems = [...dueItems].sort((a, b) => {
      // Never reviewed items first
      if (!a.settings.lastReviewedAt && b.settings.lastReviewedAt) return -1;
      if (a.settings.lastReviewedAt && !b.settings.lastReviewedAt) return 1;
      
      // If both have been reviewed, sort by memory strength (lower first)
      const strengthA = a.settings.memoryStrength || 0;
      const strengthB = b.settings.memoryStrength || 0;
      
      if (strengthA !== strengthB) {
        return strengthA - strengthB;
      }
      
      // If same strength, sort by last reviewed date (older first)
      if (a.settings.lastReviewedAt && b.settings.lastReviewedAt) {
        return new Date(a.settings.lastReviewedAt) - new Date(b.settings.lastReviewedAt);
      }
      
      // If still tied, sort by creation date
      return new Date(a.created_at) - new Date(b.created_at);
    });
    
    return sortedItems;
  }
  
  /**
   * Create a journey method memory path
   * @param {string} palaceId - Memory palace ID
   * @param {Object} pathData - Path data
   * @param {string} pathData.name - Path name
   * @param {Array<Object>} pathData.waypoints - Waypoints
   * @returns {Promise<Object>} Created memory path
   */
  async createJourneyPath(palaceId, pathData) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    const {
      name,
      waypoints
    } = pathData;
    
    // Create journey path as a study object
    const object = await this.arStudyEnvironment.addStudyObject(palaceId, {
      objectType: 'journey_path',
      contentType: 'journey_path',
      contentId: null,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
      settings: {
        name,
        waypoints,
        created_at: new Date().toISOString()
      }
    });
    
    return object;
  }
  
  /**
   * Get journey paths in a memory palace
   * @param {string} palaceId - Memory palace ID
   * @returns {Promise<Array<Object>>} Journey paths
   */
  async getJourneyPaths(palaceId) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get journey paths
    const { data, error } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('space_id', palaceId)
      .eq('object_type', 'journey_path')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Add waypoint to journey path
   * @param {string} pathId - Journey path ID
   * @param {Object} waypointData - Waypoint data
   * @returns {Promise<Object>} Updated journey path
   */
  async addWaypointToJourneyPath(pathId, waypointData) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get current path
    const { data: path, error: pathError } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('id', pathId)
      .single();
    
    if (pathError) throw pathError;
    
    // Add waypoint
    const waypoints = [...(path.settings.waypoints || []), waypointData];
    
    // Update settings
    const settings = {
      ...path.settings,
      waypoints
    };
    
    // Update path
    const { data: updatedPath, error } = await supabase
      .from('ar_study_objects')
      .update({
        settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', pathId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedPath;
  }
  
  /**
   * Generate memory palace analytics
   * @param {string} palaceId - Memory palace ID
   * @returns {Promise<Object>} Memory palace analytics
   */
  async generateMemoryPalaceAnalytics(palaceId) {
    if (!this.initialized) {
      throw new Error('AR Spatial Memory Service not initialized');
    }
    
    // Get memory palace
    const { data: palace, error: palaceError } = await supabase
      .from('ar_study_spaces')
      .select('*')
      .eq('id', palaceId)
      .single();
    
    if (palaceError) throw palaceError;
    
    // Get memory items
    const { data: items, error: itemsError } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('space_id', palaceId)
      .eq('object_type', 'memory_item');
    
    if (itemsError) throw itemsError;
    
    // Get interaction logs
    const { data: logs, error: logsError } = await supabase
      .from('ar_interaction_logs')
      .select('*')
      .eq('space_id', palaceId)
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    
    if (logsError) throw logsError;
    
    // Calculate analytics
    const totalItems = items.length;
    const reviewedItems = items.filter(item => item.settings.reviewCount > 0).length;
    const totalReviews = items.reduce((sum, item) => sum + (item.settings.reviewCount || 0), 0);
    
    // Calculate average memory strength
    let avgMemoryStrength = 0;
    if (reviewedItems > 0) {
      avgMemoryStrength = items.reduce((sum, item) => sum + (item.settings.memoryStrength || 0), 0) / reviewedItems;
    }
    
    // Calculate retention rate
    const retentionRate = items.reduce((sum, item) => {
      if (!item.settings.recallHistory || item.settings.recallHistory.length === 0) {
        return sum;
      }
      
      // Get last 5 reviews
      const recentReviews = item.settings.recallHistory.slice(-5);
      const goodRecalls = recentReviews.filter(review => review.recallQuality >= 3).length;
      return sum + (goodRecalls / recentReviews.length);
    }, 0) / (reviewedItems || 1);
    
    // Calculate last session stats
    let lastSessionDate = null;
    let lastSessionItemsReviewed = 0;
    
    if (logs && logs.length > 0) {
      const reviewLogs = logs.filter(log => log.interaction_type === 'memory_review');
      
      if (reviewLogs.length > 0) {
        lastSessionDate = new Date(reviewLogs[0].created_at);
        
        // Group logs by session (sessions are separated by at least 30 minutes)
        const SESSION_GAP = 30 * 60 * 1000; // 30 minutes in milliseconds
        let currentSession = [reviewLogs[0]];
        let sessions = [currentSession];
        
        for (let i = 1; i < reviewLogs.length; i++) {
          const currentLog = reviewLogs[i];
          const prevLog = reviewLogs[i - 1];
          
          const timeDiff = new Date(prevLog.created_at) - new Date(currentLog.created_at);
          
          if (timeDiff > SESSION_GAP) {
            currentSession = [currentLog];
            sessions.push(currentSession);
          } else {
            currentSession.push(currentLog);
          }
        }
        
        // Get last session
        const lastSession = sessions[0];
        lastSessionItemsReviewed = new Set(lastSession.map(log => log.object_id)).size;
      }
    }
    
    return {
      palaceId,
      palaceName: palace.name,
      totalItems,
      reviewedItems,
      totalReviews,
      avgMemoryStrength,
      retentionRate,
      lastSessionDate,
      lastSessionItemsReviewed,
      dueItems: (await this.getMemoryItemsDueForReview(palaceId)).length
    };
  }
}

/**
 * Hook for using the AR Spatial Memory Service
 * @returns {Object} AR Spatial Memory Service methods
 */
export function useARSpatialMemory() {
  const service = ARSpatialMemoryService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createMemoryPalace: service.createMemoryPalace.bind(service),
    getUserMemoryPalaces: service.getUserMemoryPalaces.bind(service),
    addMemoryItem: service.addMemoryItem.bind(service),
    getMemoryPalaceItems: service.getMemoryPalaceItems.bind(service),
    recordMemoryItemReview: service.recordMemoryItemReview.bind(service),
    getMemoryItemsDueForReview: service.getMemoryItemsDueForReview.bind(service),
    generateOptimalReviewPath: service.generateOptimalReviewPath.bind(service),
    createJourneyPath: service.createJourneyPath.bind(service),
    getJourneyPaths: service.getJourneyPaths.bind(service),
    addWaypointToJourneyPath: service.addWaypointToJourneyPath.bind(service),
    generateMemoryPalaceAnalytics: service.generateMemoryPalaceAnalytics.bind(service)
  };
}
