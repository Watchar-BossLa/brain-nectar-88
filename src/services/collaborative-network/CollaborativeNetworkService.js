/**
 * Collaborative Network Service
 * Core service for managing the collaborative learning network
 */

import { supabase } from '@/integrations/supabase/client';
import { nanoid } from 'nanoid';

/**
 * Collaborative Network Service class
 */
export class CollaborativeNetworkService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {CollaborativeNetworkService} The singleton instance
   */
  static getInstance() {
    if (!CollaborativeNetworkService.instance) {
      CollaborativeNetworkService.instance = new CollaborativeNetworkService();
    }
    return CollaborativeNetworkService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Collaborative Network Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Collaborative Network Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new study group
   * @param {Object} groupData - Group data
   * @param {string} groupData.name - Group name
   * @param {string} [groupData.description] - Group description
   * @param {boolean} [groupData.isPublic=false] - Whether the group is public
   * @returns {Promise<Object>} Created group
   */
  async createStudyGroup(groupData) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    const {
      name,
      description = '',
      isPublic = false
    } = groupData;
    
    // Generate a unique join code for the group
    const joinCode = nanoid(8);
    
    // Create group in database
    const { data: group, error } = await supabase
      .from('study_groups')
      .insert({
        name,
        description,
        creator_id: this.userId,
        is_public: isPublic,
        join_code: joinCode,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add creator as admin member
    const { error: memberError } = await supabase
      .from('group_members')
      .insert({
        group_id: group.id,
        user_id: this.userId,
        role: 'admin',
        joined_at: new Date().toISOString()
      });
    
    if (memberError) throw memberError;
    
    // Create activity for group creation
    await this._createActivity('created_group', {
      group_id: group.id,
      group_name: group.name
    });
    
    return group;
  }
  
  /**
   * Join a study group
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID
   * @param {string} joinCode - Join code for private groups
   * @returns {Promise<boolean>} Success status
   */
  async joinStudyGroup(groupId, userId, joinCode = null) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if group exists and user can join
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('id', groupId)
      .single();
    
    if (groupError) throw groupError;
    
    // Check if group is public or join code matches
    if (!group.is_public && group.join_code !== joinCode) {
      throw new Error('Invalid join code for private group');
    }
    
    // Check if user is already a member
    const { data: existingMember, error: memberCheckError } = await supabase
      .from('group_members')
      .select('*')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (memberCheckError) throw memberCheckError;
    
    if (existingMember) {
      return true; // User is already a member
    }
    
    // Add user as member
    const { error: joinError } = await supabase
      .from('group_members')
      .insert({
        group_id: groupId,
        user_id: userId,
        role: 'member',
        joined_at: new Date().toISOString()
      });
    
    if (joinError) throw joinError;
    
    // Create activity for joining group
    await this._createActivity('joined_group', {
      group_id: group.id,
      group_name: group.name
    });
    
    return true;
  }
  
  /**
   * Leave a study group
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async leaveStudyGroup(groupId, userId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if user is a member
    const { data: member, error: memberCheckError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    
    if (memberCheckError) throw memberCheckError;
    
    // Check if user is the last admin
    if (member.role === 'admin') {
      const { data: adminCount, error: countError } = await supabase
        .from('group_members')
        .select('user_id', { count: 'exact', head: true })
        .eq('group_id', groupId)
        .eq('role', 'admin');
      
      if (countError) throw countError;
      
      if (adminCount === 1) {
        // Check if there are other members
        const { data: memberCount, error: memberCountError } = await supabase
          .from('group_members')
          .select('user_id', { count: 'exact', head: true })
          .eq('group_id', groupId);
        
        if (memberCountError) throw memberCountError;
        
        if (memberCount > 1) {
          throw new Error('Cannot leave group as the last admin. Promote another member to admin first.');
        }
      }
    }
    
    // Get group info for activity
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('name')
      .eq('id', groupId)
      .single();
    
    if (groupError) throw groupError;
    
    // Remove user from group
    const { error: leaveError } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (leaveError) throw leaveError;
    
    // Create activity for leaving group
    await this._createActivity('left_group', {
      group_id: groupId,
      group_name: group.name
    });
    
    return true;
  }
  
  /**
   * Get groups a user belongs to
   * @param {string} userId - User ID
   * @returns {Promise<Array<Object>>} User's groups
   */
  async getUserGroups(userId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Get group IDs the user is a member of
    const { data: memberships, error: membershipError } = await supabase
      .from('group_members')
      .select('group_id, role')
      .eq('user_id', userId);
    
    if (membershipError) throw membershipError;
    
    if (!memberships || memberships.length === 0) {
      return [];
    }
    
    const groupIds = memberships.map(m => m.group_id);
    
    // Get group details
    const { data: groups, error: groupsError } = await supabase
      .from('study_groups')
      .select('*')
      .in('id', groupIds);
    
    if (groupsError) throw groupsError;
    
    // Combine group details with user's role
    return groups.map(group => {
      const membership = memberships.find(m => m.group_id === group.id);
      return {
        ...group,
        userRole: membership ? membership.role : null
      };
    });
  }
  
  /**
   * Get members of a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array<Object>>} Group members
   */
  async getGroupMembers(groupId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Get members with their roles
    const { data: members, error: membersError } = await supabase
      .from('group_members')
      .select('user_id, role, joined_at')
      .eq('group_id', groupId);
    
    if (membersError) throw membersError;
    
    if (!members || members.length === 0) {
      return [];
    }
    
    // Get user details
    const userIds = members.map(m => m.user_id);
    
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, username, avatar_url, full_name')
      .in('id', userIds);
    
    if (usersError) throw usersError;
    
    // Combine user details with membership info
    return members.map(member => {
      const user = users.find(u => u.id === member.user_id);
      return {
        ...user,
        role: member.role,
        joinedAt: member.joined_at
      };
    });
  }
  
  /**
   * Update a group member's role
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID to update
   * @param {string} role - New role (admin, moderator, member)
   * @returns {Promise<boolean>} Success status
   */
  async updateGroupMemberRole(groupId, userId, role) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if current user is an admin
    const { data: currentUserRole, error: roleCheckError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (roleCheckError) throw roleCheckError;
    
    if (currentUserRole.role !== 'admin') {
      throw new Error('Only group admins can update member roles');
    }
    
    // Update member role
    const { error: updateError } = await supabase
      .from('group_members')
      .update({ role })
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (updateError) throw updateError;
    
    return true;
  }
  
  /**
   * Search for public groups
   * @param {string} query - Search query
   * @param {Object} [options] - Search options
   * @param {number} [options.limit=20] - Maximum number of results
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Matching groups
   */
  async searchPublicGroups(query, options = {}) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    const {
      limit = 20,
      offset = 0
    } = options;
    
    // Search for public groups matching the query
    const { data, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('is_public', true)
      .ilike('name', `%${query}%`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get group details
   * @param {string} groupId - Group ID
   * @returns {Promise<Object>} Group details
   */
  async getGroupDetails(groupId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Get group details
    const { data: group, error: groupError } = await supabase
      .from('study_groups')
      .select('*')
      .eq('id', groupId)
      .single();
    
    if (groupError) throw groupError;
    
    // Get member count
    const { count: memberCount, error: countError } = await supabase
      .from('group_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('group_id', groupId);
    
    if (countError) throw countError;
    
    // Get user's role in the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    return {
      ...group,
      memberCount,
      userRole: membership ? membership.role : null
    };
  }
  
  /**
   * Update group details
   * @param {string} groupId - Group ID
   * @param {Object} groupData - Updated group data
   * @param {string} [groupData.name] - Group name
   * @param {string} [groupData.description] - Group description
   * @param {boolean} [groupData.isPublic] - Whether the group is public
   * @returns {Promise<Object>} Updated group
   */
  async updateGroupDetails(groupId, groupData) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if user is an admin
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (membershipError) throw membershipError;
    
    if (membership.role !== 'admin') {
      throw new Error('Only group admins can update group details');
    }
    
    // Prepare update data
    const updateData = {};
    
    if (groupData.name !== undefined) updateData.name = groupData.name;
    if (groupData.description !== undefined) updateData.description = groupData.description;
    if (groupData.isPublic !== undefined) updateData.is_public = groupData.isPublic;
    
    updateData.updated_at = new Date().toISOString();
    
    // Update group
    const { data: updatedGroup, error: updateError } = await supabase
      .from('study_groups')
      .update(updateData)
      .eq('id', groupId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    // Create activity for updating group
    await this._createActivity('updated_group', {
      group_id: groupId,
      group_name: updatedGroup.name
    });
    
    return updatedGroup;
  }
  
  /**
   * Regenerate group join code
   * @param {string} groupId - Group ID
   * @returns {Promise<string>} New join code
   */
  async regenerateJoinCode(groupId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if user is an admin
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (membershipError) throw membershipError;
    
    if (membership.role !== 'admin') {
      throw new Error('Only group admins can regenerate join codes');
    }
    
    // Generate new join code
    const newJoinCode = nanoid(8);
    
    // Update group
    const { error: updateError } = await supabase
      .from('study_groups')
      .update({
        join_code: newJoinCode,
        updated_at: new Date().toISOString()
      })
      .eq('id', groupId);
    
    if (updateError) throw updateError;
    
    return newJoinCode;
  }
  
  /**
   * Remove a member from a group
   * @param {string} groupId - Group ID
   * @param {string} userId - User ID to remove
   * @returns {Promise<boolean>} Success status
   */
  async removeGroupMember(groupId, userId) {
    if (!this.initialized) {
      throw new Error('Collaborative Network Service not initialized');
    }
    
    // Check if current user is an admin
    const { data: currentUserRole, error: roleCheckError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .single();
    
    if (roleCheckError) throw roleCheckError;
    
    if (currentUserRole.role !== 'admin') {
      throw new Error('Only group admins can remove members');
    }
    
    // Check if target user is an admin
    const { data: targetUserRole, error: targetRoleError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', userId)
      .single();
    
    if (targetRoleError) throw targetRoleError;
    
    if (targetUserRole.role === 'admin' && this.userId !== userId) {
      throw new Error('Cannot remove another admin from the group');
    }
    
    // Remove member
    const { error: removeError } = await supabase
      .from('group_members')
      .delete()
      .eq('group_id', groupId)
      .eq('user_id', userId);
    
    if (removeError) throw removeError;
    
    return true;
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
 * Hook for using the Collaborative Network Service
 * @returns {Object} Collaborative Network Service methods
 */
export function useCollaborativeNetwork() {
  const service = CollaborativeNetworkService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createStudyGroup: service.createStudyGroup.bind(service),
    joinStudyGroup: service.joinStudyGroup.bind(service),
    leaveStudyGroup: service.leaveStudyGroup.bind(service),
    getUserGroups: service.getUserGroups.bind(service),
    getGroupMembers: service.getGroupMembers.bind(service),
    updateGroupMemberRole: service.updateGroupMemberRole.bind(service),
    searchPublicGroups: service.searchPublicGroups.bind(service),
    getGroupDetails: service.getGroupDetails.bind(service),
    updateGroupDetails: service.updateGroupDetails.bind(service),
    regenerateJoinCode: service.regenerateJoinCode.bind(service),
    removeGroupMember: service.removeGroupMember.bind(service)
  };
}
