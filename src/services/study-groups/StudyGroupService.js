/**
 * Study Group Service
 * Service for managing collaborative study groups
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Study Group Service class
 */
export class StudyGroupService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {StudyGroupService} The singleton instance
   */
  static getInstance() {
    if (!StudyGroupService.instance) {
      StudyGroupService.instance = new StudyGroupService();
    }
    return StudyGroupService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Study Group Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Study Group Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new study group
   * @param {Object} groupData - Group data
   * @returns {Promise<Object>} Created group
   */
  async createGroup(groupData) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    const { name, description, isPublic, maxMembers, settings } = groupData;
    
    // Generate a random join code if the group is public
    const joinCode = isPublic ? this._generateJoinCode() : null;
    
    // Create the group
    const { data: group, error } = await supabase
      .from('study_groups')
      .insert({
        name,
        description,
        created_by: this.userId,
        is_public: isPublic,
        join_code: joinCode,
        max_members: maxMembers,
        settings: settings || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add the creator as a member with 'admin' role
    const { error: memberError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: group.id,
        user_id: this.userId,
        role: 'admin',
        joined_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      });
    
    if (memberError) throw memberError;
    
    return group;
  }
  
  /**
   * Get user's study groups
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's study groups
   */
  async getUserGroups(options = {}) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    const { role, limit = 10, offset = 0, sortBy = 'created_at', sortOrder = 'desc' } = options;
    
    // Get groups where the user is a member
    let query = supabase
      .from('study_group_members')
      .select(`
        group_id,
        role,
        joined_at,
        study_groups!inner(
          id,
          name,
          description,
          created_by,
          is_public,
          join_code,
          max_members,
          settings,
          created_at,
          updated_at
        )
      `)
      .eq('user_id', this.userId);
    
    // Filter by role if specified
    if (role) {
      query = query.eq('role', role);
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Transform the data to a more usable format
    return data.map(item => ({
      ...item.study_groups,
      memberRole: item.role,
      joinedAt: item.joined_at
    }));
  }
  
  /**
   * Get a study group by ID
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Study group
   */
  async getGroupById(groupId) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    // Get the group
    const { data: group, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('id', groupId)
      .single();
    
    if (error) throw error;
    
    // Get the user's membership
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    // Get member count
    const { count, error: countError } = await supabase
      .from('study_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', groupId);
    
    if (countError) throw countError;
    
    return {
      ...group,
      memberCount: count,
      isMember: !!membership,
      memberRole: membership?.role,
      joinedAt: membership?.joined_at
    };
  }
  
  /**
   * Join a study group
   * @param {string} groupId - Group ID or join code
   * @returns {Promise<Object>} Joined group
   */
  async joinGroup(groupId) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    // Check if groupId is a join code
    let group;
    if (groupId.length === 6) {
      // It's likely a join code
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('join_code', groupId)
        .single();
      
      if (error) throw error;
      group = data;
    } else {
      // It's a group ID
      const { data, error } = await supabase
        .from('study_groups')
        .select('*')
        .eq('id', groupId)
        .single();
      
      if (error) throw error;
      group = data;
    }
    
    // Check if the group is public or if the user has an invitation
    if (!group.is_public) {
      const { data: invitation, error } = await supabase
        .from('study_group_invitations')
        .select('*')
        .eq('group_id', group.id)
        .eq('email', this.userEmail) // We would need to store the user's email during initialization
        .eq('status', 'pending')
        .single();
      
      if (error || !invitation) {
        throw new Error('This group is private and you do not have an invitation');
      }
      
      // Update invitation status
      await supabase
        .from('study_group_invitations')
        .update({
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', invitation.id);
    }
    
    // Check if the user is already a member
    const { data: existingMembership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('*')
      .eq('group_id', group.id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (existingMembership) {
      throw new Error('You are already a member of this group');
    }
    
    // Check if the group has reached its maximum members
    if (group.max_members) {
      const { count, error: countError } = await supabase
        .from('study_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', group.id);
      
      if (countError) throw countError;
      
      if (count >= group.max_members) {
        throw new Error('This group has reached its maximum number of members');
      }
    }
    
    // Add the user as a member
    const { error: joinError } = await supabase
      .from('study_group_members')
      .insert({
        group_id: group.id,
        user_id: this.userId,
        role: 'member',
        joined_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      });
    
    if (joinError) throw joinError;
    
    return {
      ...group,
      memberRole: 'member',
      joinedAt: new Date().toISOString()
    };
  }
  
  /**
   * Leave a study group
   * @param {string} groupId - Group ID
   * @returns {Promise<boolean>} Success status
   */
  async leaveGroup(groupId) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    // Check if the user is an admin and the only admin
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (membershipError) throw membershipError;
    
    if (membership.role === 'admin') {
      // Check if there are other admins
      const { count, error: countError } = await supabase
        .from('study_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId)
        .eq('role', 'admin')
        .neq('user_id', this.userId);
      
      if (countError) throw countError;
      
      if (count === 0) {
        throw new Error('You are the only admin. Please promote another member to admin before leaving');
      }
    }
    
    // Remove the user from the group
    const { error } = await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Update a study group
   * @param {string} groupId - Group ID
   * @param {Object} groupData - Updated group data
   * @returns {Promise<Object>} Updated group
   */
  async updateGroup(groupId, groupData) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    // Check if the user is an admin
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (membershipError) throw membershipError;
    
    if (membership.role !== 'admin') {
      throw new Error('Only admins can update the group');
    }
    
    // Update the group
    const { data: updatedGroup, error } = await supabase
      .from('study_groups')
      .update({
        ...groupData,
        updated_at: new Date().toISOString()
      })
      .eq('id', groupId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedGroup;
  }
  
  /**
   * Delete a study group
   * @param {string} groupId - Group ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGroup(groupId) {
    if (!this.initialized) {
      throw new Error('Study Group Service not initialized');
    }
    
    // Check if the user is an admin
    const { data: membership, error: membershipError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (membershipError) throw membershipError;
    
    if (membership.role !== 'admin') {
      throw new Error('Only admins can delete the group');
    }
    
    // Delete the group
    const { error } = await supabase
      .from('study_groups')
      .delete()
      .eq('id', groupId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Generate a random join code
   * @returns {string} Join code
   * @private
   */
  _generateJoinCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}

/**
 * Hook for using the Study Group Service
 * @returns {Object} Study Group Service methods
 */
export function useStudyGroup() {
  const service = StudyGroupService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createGroup: service.createGroup.bind(service),
    getUserGroups: service.getUserGroups.bind(service),
    getGroupById: service.getGroupById.bind(service),
    joinGroup: service.joinGroup.bind(service),
    leaveGroup: service.leaveGroup.bind(service),
    updateGroup: service.updateGroup.bind(service),
    deleteGroup: service.deleteGroup.bind(service)
  };
}
