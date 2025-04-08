/**
 * Social Learning Service
 * Service for social features and connections
 */

import { supabase } from '@/integrations/supabase/client';
import { CollaborativeNetworkService } from './CollaborativeNetworkService';

/**
 * Social Learning Service class
 */
export class SocialLearningService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.collaborativeNetwork = CollaborativeNetworkService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {SocialLearningService} The singleton instance
   */
  static getInstance() {
    if (!SocialLearningService.instance) {
      SocialLearningService.instance = new SocialLearningService();
    }
    return SocialLearningService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Social Learning Service for user:', userId);
      this.userId = userId;
      
      // Ensure collaborative network service is initialized
      if (!this.collaborativeNetwork.initialized) {
        await this.collaborativeNetwork.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Social Learning Service:', error);
      return false;
    }
  }
  
  /**
   * Get a user's activity feed
   * @param {string} userId - User ID
   * @param {Object} [options] - Options
   * @param {number} [options.limit=20] - Maximum number of activities
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Activity feed
   */
  async getUserActivities(userId, options = {}) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    const {
      limit = 20,
      offset = 0
    } = options;
    
    // Get user's activities
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return activities || [];
  }
  
  /**
   * Get activity feed for a user's network
   * @param {Object} [options] - Options
   * @param {number} [options.limit=20] - Maximum number of activities
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Network activity feed
   */
  async getNetworkActivities(options = {}) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    const {
      limit = 20,
      offset = 0
    } = options;
    
    // Get user's connections
    const { data: connections, error: connectionsError } = await supabase
      .from('user_connections')
      .select('connected_user_id')
      .eq('user_id', this.userId);
    
    if (connectionsError) throw connectionsError;
    
    // Get user's group memberships
    const { data: memberships, error: membershipsError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', this.userId);
    
    if (membershipsError) throw membershipsError;
    
    // Get group members
    const groupIds = memberships ? memberships.map(m => m.group_id) : [];
    
    let groupMemberIds = [];
    
    if (groupIds.length > 0) {
      const { data: groupMembers, error: groupMembersError } = await supabase
        .from('group_members')
        .select('user_id')
        .in('group_id', groupIds)
        .neq('user_id', this.userId);
      
      if (groupMembersError) throw groupMembersError;
      
      groupMemberIds = groupMembers ? groupMembers.map(m => m.user_id) : [];
    }
    
    // Combine connection IDs and group member IDs
    const connectionIds = connections ? connections.map(c => c.connected_user_id) : [];
    const networkUserIds = [...new Set([...connectionIds, ...groupMemberIds])];
    
    // If no connections or group members, return empty array
    if (networkUserIds.length === 0) {
      return [];
    }
    
    // Get activities from network users
    const { data: activities, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .in('user_id', networkUserIds)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return activities || [];
  }
  
  /**
   * Create a user connection
   * @param {string} connectedUserId - Connected user ID
   * @param {string} connectionType - Connection type (buddy, mentor, mentee)
   * @returns {Promise<Object>} Created connection
   */
  async createUserConnection(connectedUserId, connectionType) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    // Check if connection already exists
    const { data: existingConnection, error: checkError } = await supabase
      .from('user_connections')
      .select('*')
      .eq('user_id', this.userId)
      .eq('connected_user_id', connectedUserId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingConnection) {
      // Update existing connection
      const { data, error } = await supabase
        .from('user_connections')
        .update({
          connection_type: connectionType,
          created_at: new Date().toISOString()
        })
        .eq('user_id', this.userId)
        .eq('connected_user_id', connectedUserId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    }
    
    // Create new connection
    const { data, error } = await supabase
      .from('user_connections')
      .insert({
        user_id: this.userId,
        connected_user_id: connectedUserId,
        connection_type: connectionType,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create activity for creating connection
    await this._createActivity('created_connection', {
      connected_user_id: connectedUserId,
      connection_type: connectionType
    });
    
    return data;
  }
  
  /**
   * Remove a user connection
   * @param {string} connectedUserId - Connected user ID
   * @returns {Promise<boolean>} Success status
   */
  async removeUserConnection(connectedUserId) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    // Remove connection
    const { error } = await supabase
      .from('user_connections')
      .delete()
      .eq('user_id', this.userId)
      .eq('connected_user_id', connectedUserId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Get a user's connections
   * @param {string} userId - User ID
   * @param {string} [connectionType] - Filter by connection type
   * @returns {Promise<Array<Object>>} User connections
   */
  async getUserConnections(userId, connectionType = null) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    // Build query
    let query = supabase
      .from('user_connections')
      .select(`
        *,
        connected_user:connected_user_id(id, username, avatar_url, full_name)
      `)
      .eq('user_id', userId);
    
    // Apply connection type filter
    if (connectionType) {
      query = query.eq('connection_type', connectionType);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Find potential study buddies
   * @param {Object} [criteria] - Search criteria
   * @param {Array<string>} [criteria.interests] - Shared interests
   * @param {Array<string>} [criteria.subjects] - Shared subjects
   * @param {number} [criteria.limit=20] - Maximum number of results
   * @returns {Promise<Array<Object>>} Potential study buddies
   */
  async findStudyBuddies(criteria = {}) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    const {
      interests = [],
      subjects = [],
      limit = 20
    } = criteria;
    
    // Get user's profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', this.userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Get user's existing connections
    const { data: connections, error: connectionsError } = await supabase
      .from('user_connections')
      .select('connected_user_id')
      .eq('user_id', this.userId);
    
    if (connectionsError) throw connectionsError;
    
    const connectionIds = connections ? connections.map(c => c.connected_user_id) : [];
    
    // Build query for potential buddies
    let query = supabase
      .from('profiles')
      .select('*')
      .neq('id', this.userId);
    
    // Exclude existing connections
    if (connectionIds.length > 0) {
      query = query.not('id', 'in', `(${connectionIds.join(',')})`);
    }
    
    // Apply interest filter
    if (interests && interests.length > 0) {
      query = query.overlaps('interests', interests);
    }
    
    // Apply subject filter
    if (subjects && subjects.length > 0) {
      query = query.overlaps('subjects', subjects);
    }
    
    // Limit results
    query = query.limit(limit);
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get recommended groups
   * @param {number} [limit=5] - Maximum number of recommendations
   * @returns {Promise<Array<Object>>} Recommended groups
   */
  async getRecommendedGroups(limit = 5) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    // Get user's profile
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('interests, subjects')
      .eq('id', this.userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Get user's existing group memberships
    const { data: memberships, error: membershipsError } = await supabase
      .from('group_members')
      .select('group_id')
      .eq('user_id', this.userId);
    
    if (membershipsError) throw membershipsError;
    
    const groupIds = memberships ? memberships.map(m => m.group_id) : [];
    
    // Get public groups
    let query = supabase
      .from('study_groups')
      .select(`
        *,
        member_count:group_members(count)
      `)
      .eq('is_public', true);
    
    // Exclude groups the user is already a member of
    if (groupIds.length > 0) {
      query = query.not('id', 'in', `(${groupIds.join(',')})`);
    }
    
    // Execute query
    const { data: allGroups, error } = await query;
    
    if (error) throw error;
    
    if (!allGroups || allGroups.length === 0) {
      return [];
    }
    
    // Score groups based on relevance to user
    const scoredGroups = allGroups.map(group => {
      let score = 0;
      
      // Base score on member count
      score += Math.min(group.member_count, 10) / 10;
      
      // TODO: Add more sophisticated scoring based on group activity, tags, etc.
      
      return {
        ...group,
        score
      };
    });
    
    // Sort by score and limit results
    return scoredGroups
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
  
  /**
   * Get user profile with learning stats
   * @param {string} userId - User ID
   * @returns {Promise<Object>} User profile with learning stats
   */
  async getUserLearningProfile(userId) {
    if (!this.initialized) {
      throw new Error('Social Learning Service not initialized');
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (profileError) throw profileError;
    
    // Get connection status
    let connectionStatus = null;
    
    if (userId !== this.userId) {
      const { data: connection, error: connectionError } = await supabase
        .from('user_connections')
        .select('connection_type')
        .eq('user_id', this.userId)
        .eq('connected_user_id', userId)
        .maybeSingle();
      
      if (!connectionError && connection) {
        connectionStatus = connection.connection_type;
      }
    }
    
    // Get group memberships
    const { data: memberships, error: membershipsError } = await supabase
      .from('group_members')
      .select(`
        role,
        group:group_id(id, name)
      `)
      .eq('user_id', userId);
    
    if (membershipsError) throw membershipsError;
    
    // Get recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (activitiesError) throw activitiesError;
    
    // Get learning stats
    // TODO: Add more learning stats from other services
    
    return {
      ...profile,
      connectionStatus,
      groups: memberships || [],
      recentActivities: activities || [],
      learningStats: {
        // Placeholder for learning stats
        totalStudyTime: 0,
        flashcardsReviewed: 0,
        questionsAnswered: 0,
        documentsAnalyzed: 0
      }
    };
  }
  
  /**
   * Create a user activity
   * @param {string} activityType - Activity type
   * @param {Object} content - Activity content
   * @param {boolean} [isPublic=true] - Whether the activity is public
   * @returns {Promise<Object>} Created activity
   * @private
   */
  async _createActivity(activityType, content, isPublic = true) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert({
        user_id: this.userId,
        activity_type: activityType,
        content,
        is_public: isPublic,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating activity:', error);
      return null;
    }
    
    return data;
  }
}

/**
 * Hook for using the Social Learning Service
 * @returns {Object} Social Learning Service methods
 */
export function useSocialLearning() {
  const service = SocialLearningService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getUserActivities: service.getUserActivities.bind(service),
    getNetworkActivities: service.getNetworkActivities.bind(service),
    createUserConnection: service.createUserConnection.bind(service),
    removeUserConnection: service.removeUserConnection.bind(service),
    getUserConnections: service.getUserConnections.bind(service),
    findStudyBuddies: service.findStudyBuddies.bind(service),
    getRecommendedGroups: service.getRecommendedGroups.bind(service),
    getUserLearningProfile: service.getUserLearningProfile.bind(service)
  };
}
