/**
 * Group Members Service
 * Service for managing study group members
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Group Members Service class
 */
export class GroupMembersService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {GroupMembersService} The singleton instance
   */
  static getInstance() {
    if (!GroupMembersService.instance) {
      GroupMembersService.instance = new GroupMembersService();
    }
    return GroupMembersService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Group Members Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Group Members Service:', error);
      return false;
    }
  }
  
  /**
   * Get members of a study group
   * @param {string} groupId - Group ID
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Group members
   */
  async getGroupMembers(groupId, options = {}) {
    if (!this.initialized) {
      throw new Error('Group Members Service not initialized');
    }
    
    const { role, limit = 50, offset = 0, sortBy = 'joined_at', sortOrder = 'asc' } = options;
    
    // Build the query
    let query = supabase
      .from('study_group_members')
      .select(`
        id,
        role,
        joined_at,
        last_active_at,
        user_id,
        profiles:user_id(
          username,
          full_name,
          avatar_url
        )
      `)
      .eq('group_id', groupId);
    
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
    return data.map(member => ({
      id: member.id,
      userId: member.user_id,
      role: member.role,
      joinedAt: member.joined_at,
      lastActiveAt: member.last_active_at,
      username: member.profiles?.username,
      fullName: member.profiles?.full_name,
      avatarUrl: member.profiles?.avatar_url
    }));
  }
  
  /**
   * Update a member's role
   * @param {string} groupId - Group ID
   * @param {string} memberId - Member ID
   * @param {string} newRole - New role
   * @returns {Promise<Object>} Updated member
   */
  async updateMemberRole(groupId, memberId, newRole) {
    if (!this.initialized) {
      throw new Error('Group Members Service not initialized');
    }
    
    // Check if the user is an admin
    const { data: userMembership, error: userError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (userError) throw userError;
    
    if (userMembership.role !== 'admin') {
      throw new Error('Only admins can update member roles');
    }
    
    // Get the target member
    const { data: targetMember, error: targetError } = await supabase
      .from('study_group_members')
      .select('user_id')
      .eq('id', memberId)
      .eq('group_id', groupId)
      .single();
    
    if (targetError) throw targetError;
    
    // Prevent demoting yourself if you're the only admin
    if (targetMember.user_id === this.userId && newRole !== 'admin') {
      // Check if there are other admins
      const { count, error: countError } = await supabase
        .from('study_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('group_id', groupId)
        .eq('role', 'admin')
        .neq('user_id', this.userId);
      
      if (countError) throw countError;
      
      if (count === 0) {
        throw new Error('You are the only admin. Please promote another member to admin before changing your role');
      }
    }
    
    // Update the member's role
    const { data: updatedMember, error } = await supabase
      .from('study_group_members')
      .update({
        role: newRole,
        updated_at: new Date().toISOString()
      })
      .eq('id', memberId)
      .eq('group_id', groupId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedMember;
  }
  
  /**
   * Remove a member from a group
   * @param {string} groupId - Group ID
   * @param {string} memberId - Member ID
   * @returns {Promise<boolean>} Success status
   */
  async removeMember(groupId, memberId) {
    if (!this.initialized) {
      throw new Error('Group Members Service not initialized');
    }
    
    // Check if the user is an admin
    const { data: userMembership, error: userError } = await supabase
      .from('study_group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (userError) throw userError;
    
    if (userMembership.role !== 'admin') {
      throw new Error('Only admins can remove members');
    }
    
    // Get the target member
    const { data: targetMember, error: targetError } = await supabase
      .from('study_group_members')
      .select('user_id, role')
      .eq('id', memberId)
      .eq('group_id', groupId)
      .single();
    
    if (targetError) throw targetError;
    
    // Prevent removing yourself
    if (targetMember.user_id === this.userId) {
      throw new Error('You cannot remove yourself from the group. Use the leave group function instead');
    }
    
    // Prevent removing another admin
    if (targetMember.role === 'admin') {
      throw new Error('You cannot remove another admin');
    }
    
    // Remove the member
    const { error } = await supabase
      .from('study_group_members')
      .delete()
      .eq('id', memberId)
      .eq('group_id', groupId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Update member's last active time
   * @param {string} groupId - Group ID
   * @returns {Promise<boolean>} Success status
   */
  async updateLastActive(groupId) {
    if (!this.initialized) {
      throw new Error('Group Members Service not initialized');
    }
    
    // Update the last active time
    const { error } = await supabase
      .from('study_group_members')
      .update({
        last_active_at: new Date().toISOString()
      })
      .eq('group_id', groupId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
}

/**
 * Hook for using the Group Members Service
 * @returns {Object} Group Members Service methods
 */
export function useGroupMembers() {
  const service = GroupMembersService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getGroupMembers: service.getGroupMembers.bind(service),
    updateMemberRole: service.updateMemberRole.bind(service),
    removeMember: service.removeMember.bind(service),
    updateLastActive: service.updateLastActive.bind(service)
  };
}
