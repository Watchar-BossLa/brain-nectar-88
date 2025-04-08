/**
 * Group Resource Service
 * Service for managing shared resources within study groups
 */

import { supabase } from '@/integrations/supabase/client';
import { CollaborativeNetworkService } from './CollaborativeNetworkService';

/**
 * Group Resource Service class
 */
export class GroupResourceService {
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
   * @returns {GroupResourceService} The singleton instance
   */
  static getInstance() {
    if (!GroupResourceService.instance) {
      GroupResourceService.instance = new GroupResourceService();
    }
    return GroupResourceService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Group Resource Service for user:', userId);
      this.userId = userId;
      
      // Ensure collaborative network service is initialized
      if (!this.collaborativeNetwork.initialized) {
        await this.collaborativeNetwork.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Group Resource Service:', error);
      return false;
    }
  }
  
  /**
   * Add a resource to a group
   * @param {string} groupId - Group ID
   * @param {Object} resourceData - Resource data
   * @param {string} resourceData.title - Resource title
   * @param {string} [resourceData.description] - Resource description
   * @param {string} resourceData.resourceType - Resource type
   * @param {string} resourceData.resourceId - Resource ID
   * @returns {Promise<Object>} Created resource
   */
  async addResourceToGroup(groupId, resourceData) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to add resources');
    }
    
    const {
      title,
      description = '',
      resourceType,
      resourceId
    } = resourceData;
    
    // Create resource in database
    const { data: resource, error } = await supabase
      .from('group_resources')
      .insert({
        group_id: groupId,
        creator_id: this.userId,
        title,
        description,
        resource_type: resourceType,
        resource_id: resourceId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Create activity for adding resource
    await this._createActivity('shared_resource', {
      group_id: groupId,
      resource_id: resource.id,
      resource_type: resourceType,
      resource_title: title
    });
    
    return resource;
  }
  
  /**
   * Remove a resource from a group
   * @param {string} groupId - Group ID
   * @param {string} resourceId - Resource ID
   * @returns {Promise<boolean>} Success status
   */
  async removeResourceFromGroup(groupId, resourceId) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to remove resources');
    }
    
    // Get resource details
    const { data: resource, error: resourceError } = await supabase
      .from('group_resources')
      .select('*')
      .eq('id', resourceId)
      .eq('group_id', groupId)
      .single();
    
    if (resourceError) throw resourceError;
    
    // Check if user is the creator or an admin/moderator
    if (
      resource.creator_id !== this.userId && 
      membership.role !== 'admin' && 
      membership.role !== 'moderator'
    ) {
      throw new Error('You do not have permission to remove this resource');
    }
    
    // Remove resource
    const { error: removeError } = await supabase
      .from('group_resources')
      .delete()
      .eq('id', resourceId)
      .eq('group_id', groupId);
    
    if (removeError) throw removeError;
    
    return true;
  }
  
  /**
   * Get resources in a group
   * @param {string} groupId - Group ID
   * @param {Object} [options] - Options
   * @param {string} [options.resourceType] - Filter by resource type
   * @param {number} [options.limit=20] - Maximum number of resources
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} Group resources
   */
  async getGroupResources(groupId, options = {}) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    const {
      resourceType,
      limit = 20,
      offset = 0
    } = options;
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to view resources');
    }
    
    // Build query
    let query = supabase
      .from('group_resources')
      .select(`
        *,
        creator:creator_id(id, username, avatar_url)
      `)
      .eq('group_id', groupId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply resource type filter if provided
    if (resourceType) {
      query = query.eq('resource_type', resourceType);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Share a document with a group
   * @param {string} groupId - Group ID
   * @param {string} documentId - Document ID
   * @param {string} [title] - Custom title (defaults to document title)
   * @param {string} [description] - Custom description
   * @returns {Promise<Object>} Created resource
   */
  async shareDocumentWithGroup(groupId, documentId, title = null, description = null) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Get document details
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError) throw documentError;
    
    // Check if user has access to the document
    if (document.user_id !== this.userId) {
      throw new Error('You do not have permission to share this document');
    }
    
    // Add resource to group
    return this.addResourceToGroup(groupId, {
      title: title || document.file_name,
      description: description || `Document shared by ${this.userId}`,
      resourceType: 'document',
      resourceId: documentId
    });
  }
  
  /**
   * Share a flashcard deck with a group
   * @param {string} groupId - Group ID
   * @param {string} deckId - Flashcard deck ID
   * @param {string} [title] - Custom title (defaults to deck title)
   * @param {string} [description] - Custom description
   * @returns {Promise<Object>} Created resource
   */
  async shareFlashcardDeckWithGroup(groupId, deckId, title = null, description = null) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Get deck details
    const { data: deck, error: deckError } = await supabase
      .from('study_decks')
      .select('*')
      .eq('id', deckId)
      .single();
    
    if (deckError) throw deckError;
    
    // Check if user has access to the deck
    if (deck.user_id !== this.userId) {
      throw new Error('You do not have permission to share this flashcard deck');
    }
    
    // Add resource to group
    return this.addResourceToGroup(groupId, {
      title: title || deck.name,
      description: description || `Flashcard deck shared by ${this.userId}`,
      resourceType: 'flashcard_deck',
      resourceId: deckId
    });
  }
  
  /**
   * Share a knowledge map with a group
   * @param {string} groupId - Group ID
   * @param {string} mapId - Knowledge map ID
   * @param {string} [title] - Custom title (defaults to map title)
   * @param {string} [description] - Custom description
   * @returns {Promise<Object>} Created resource
   */
  async shareKnowledgeMapWithGroup(groupId, mapId, title = null, description = null) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Get map details
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('*')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    // Check if user has access to the map
    if (map.user_id !== this.userId && !map.is_public) {
      throw new Error('You do not have permission to share this knowledge map');
    }
    
    // Add resource to group
    return this.addResourceToGroup(groupId, {
      title: title || map.name,
      description: description || `Knowledge map shared by ${this.userId}`,
      resourceType: 'knowledge_map',
      resourceId: mapId
    });
  }
  
  /**
   * Get resource details
   * @param {string} resourceId - Resource ID
   * @returns {Promise<Object>} Resource details
   */
  async getResourceDetails(resourceId) {
    if (!this.initialized) {
      throw new Error('Group Resource Service not initialized');
    }
    
    // Get resource details
    const { data: resource, error: resourceError } = await supabase
      .from('group_resources')
      .select(`
        *,
        creator:creator_id(id, username, avatar_url),
        group:group_id(id, name)
      `)
      .eq('id', resourceId)
      .single();
    
    if (resourceError) throw resourceError;
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', resource.group_id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to view this resource');
    }
    
    // Get additional resource details based on type
    let additionalDetails = {};
    
    switch (resource.resource_type) {
      case 'document':
        const { data: document, error: documentError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', resource.resource_id)
          .single();
        
        if (!documentError) {
          additionalDetails = { document };
        }
        break;
        
      case 'flashcard_deck':
        const { data: deck, error: deckError } = await supabase
          .from('study_decks')
          .select('*')
          .eq('id', resource.resource_id)
          .single();
        
        if (!deckError) {
          additionalDetails = { deck };
        }
        break;
        
      case 'knowledge_map':
        const { data: map, error: mapError } = await supabase
          .from('knowledge_maps')
          .select('*')
          .eq('id', resource.resource_id)
          .single();
        
        if (!mapError) {
          additionalDetails = { map };
        }
        break;
    }
    
    return {
      ...resource,
      ...additionalDetails
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
 * Hook for using the Group Resource Service
 * @returns {Object} Group Resource Service methods
 */
export function useGroupResources() {
  const service = GroupResourceService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    addResourceToGroup: service.addResourceToGroup.bind(service),
    removeResourceFromGroup: service.removeResourceFromGroup.bind(service),
    getGroupResources: service.getGroupResources.bind(service),
    shareDocumentWithGroup: service.shareDocumentWithGroup.bind(service),
    shareFlashcardDeckWithGroup: service.shareFlashcardDeckWithGroup.bind(service),
    shareKnowledgeMapWithGroup: service.shareKnowledgeMapWithGroup.bind(service),
    getResourceDetails: service.getResourceDetails.bind(service)
  };
}
