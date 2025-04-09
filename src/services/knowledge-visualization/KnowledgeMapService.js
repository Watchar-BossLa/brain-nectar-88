/**
 * Knowledge Map Service
 * Service for creating and managing knowledge maps
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Knowledge Map Service class
 */
export class KnowledgeMapService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {KnowledgeMapService} The singleton instance
   */
  static getInstance() {
    if (!KnowledgeMapService.instance) {
      KnowledgeMapService.instance = new KnowledgeMapService();
    }
    return KnowledgeMapService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Knowledge Map Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Knowledge Map Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new knowledge map
   * @param {Object} mapData - Map data
   * @returns {Promise<Object>} Created map
   */
  async createMap(mapData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    const { title, description, isPublic, layoutData } = mapData;
    
    // Create the map
    const { data: map, error } = await supabase
      .from('knowledge_maps')
      .insert({
        user_id: this.userId,
        title,
        description,
        is_public: isPublic,
        layout_data: layoutData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add tags if provided
    if (mapData.tags && mapData.tags.length > 0) {
      const tagInserts = mapData.tags.map(tag => ({
        map_id: map.id,
        tag,
        created_at: new Date().toISOString()
      }));
      
      const { error: tagError } = await supabase
        .from('map_tags')
        .insert(tagInserts);
      
      if (tagError) console.error('Error adding tags:', tagError);
    }
    
    return map;
  }
  
  /**
   * Get user's knowledge maps
   * @param {Object} options - Query options
   * @returns {Promise<Array>} User's knowledge maps
   */
  async getUserMaps(options = {}) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    const { limit = 10, offset = 0, sortBy = 'updated_at', sortOrder = 'desc', includeShared = true } = options;
    
    let maps = [];
    
    // Get maps created by the user
    const { data: ownMaps, error: ownError } = await supabase
      .from('knowledge_maps')
      .select(`
        *,
        map_tags(tag)
      `)
      .eq('user_id', this.userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    if (ownError) throw ownError;
    
    maps = ownMaps.map(map => ({
      ...map,
      tags: map.map_tags ? map.map_tags.map(t => t.tag) : [],
      isOwner: true
    }));
    
    // Get maps shared with the user if requested
    if (includeShared) {
      const { data: sharedMaps, error: sharedError } = await supabase
        .from('map_collaborators')
        .select(`
          role,
          knowledge_maps!inner(
            *,
            map_tags(tag)
          )
        `)
        .eq('user_id', this.userId);
      
      if (sharedError) throw sharedError;
      
      const formattedSharedMaps = sharedMaps.map(item => ({
        ...item.knowledge_maps,
        tags: item.knowledge_maps.map_tags ? item.knowledge_maps.map_tags.map(t => t.tag) : [],
        isOwner: false,
        role: item.role
      }));
      
      maps = [...maps, ...formattedSharedMaps];
    }
    
    // Sort combined results
    if (sortBy === 'updated_at') {
      maps.sort((a, b) => {
        const dateA = new Date(a.updated_at);
        const dateB = new Date(b.updated_at);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
    }
    
    // Apply limit after combining
    return maps.slice(0, limit);
  }
  
  /**
   * Get a knowledge map by ID
   * @param {string} mapId - Map ID
   * @returns {Promise<Object>} Knowledge map with concepts and relationships
   */
  async getMapById(mapId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Get the map
    const { data: map, error } = await supabase
      .from('knowledge_maps')
      .select(`
        *,
        map_tags(tag)
      `)
      .eq('id', mapId)
      .single();
    
    if (error) throw error;
    
    // Check if the user has access to this map
    if (map.user_id !== this.userId && !map.is_public) {
      // Check if the user is a collaborator
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .maybeSingle();
      
      if (collabError) throw collabError;
      
      if (!collaborator) {
        throw new Error('You do not have access to this map');
      }
      
      map.role = collaborator.role;
    } else if (map.user_id === this.userId) {
      map.role = 'owner';
    } else {
      map.role = 'viewer';
    }
    
    // Get concepts
    const { data: concepts, error: conceptsError } = await supabase
      .from('concepts')
      .select('*')
      .eq('map_id', mapId);
    
    if (conceptsError) throw conceptsError;
    
    // Get relationships
    const { data: relationships, error: relError } = await supabase
      .from('relationships')
      .select('*')
      .eq('map_id', mapId);
    
    if (relError) throw relError;
    
    // Format tags
    const tags = map.map_tags ? map.map_tags.map(t => t.tag) : [];
    
    return {
      ...map,
      tags,
      concepts,
      relationships,
      isOwner: map.user_id === this.userId
    };
  }
  
  /**
   * Update a knowledge map
   * @param {string} mapId - Map ID
   * @param {Object} mapData - Updated map data
   * @returns {Promise<Object>} Updated map
   */
  async updateMap(mapId, mapData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user has permission to update this map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id !== this.userId) {
      // Check if the user is an editor or admin
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .single();
      
      if (collabError) throw collabError;
      
      if (!collaborator || (collaborator.role !== 'editor' && collaborator.role !== 'admin')) {
        throw new Error('You do not have permission to update this map');
      }
    }
    
    // Update the map
    const { data: updatedMap, error } = await supabase
      .from('knowledge_maps')
      .update({
        title: mapData.title,
        description: mapData.description,
        is_public: mapData.isPublic,
        layout_data: mapData.layoutData || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', mapId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Update tags if provided
    if (mapData.tags) {
      // Delete existing tags
      const { error: deleteError } = await supabase
        .from('map_tags')
        .delete()
        .eq('map_id', mapId);
      
      if (deleteError) console.error('Error deleting tags:', deleteError);
      
      // Add new tags
      if (mapData.tags.length > 0) {
        const tagInserts = mapData.tags.map(tag => ({
          map_id: mapId,
          tag,
          created_at: new Date().toISOString()
        }));
        
        const { error: tagError } = await supabase
          .from('map_tags')
          .insert(tagInserts);
        
        if (tagError) console.error('Error adding tags:', tagError);
      }
    }
    
    return updatedMap;
  }
  
  /**
   * Delete a knowledge map
   * @param {string} mapId - Map ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteMap(mapId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user has permission to delete this map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id !== this.userId) {
      // Check if the user is an admin
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .single();
      
      if (collabError) throw collabError;
      
      if (!collaborator || collaborator.role !== 'admin') {
        throw new Error('You do not have permission to delete this map');
      }
    }
    
    // Delete the map (cascades to concepts, relationships, tags, etc.)
    const { error } = await supabase
      .from('knowledge_maps')
      .delete()
      .eq('id', mapId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Add a concept to a map
   * @param {string} mapId - Map ID
   * @param {Object} conceptData - Concept data
   * @returns {Promise<Object>} Created concept
   */
  async addConcept(mapId, conceptData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(mapId);
    
    // Create the concept
    const { data: concept, error } = await supabase
      .from('concepts')
      .insert({
        map_id: mapId,
        title: conceptData.title,
        description: conceptData.description,
        content: conceptData.content,
        position_x: conceptData.positionX,
        position_y: conceptData.positionY,
        color: conceptData.color,
        icon: conceptData.icon,
        concept_type: conceptData.conceptType,
        metadata: conceptData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return concept;
  }
  
  /**
   * Update a concept
   * @param {string} conceptId - Concept ID
   * @param {Object} conceptData - Updated concept data
   * @returns {Promise<Object>} Updated concept
   */
  async updateConcept(conceptId, conceptData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Get the concept to check map ID
    const { data: concept, error: conceptError } = await supabase
      .from('concepts')
      .select('map_id')
      .eq('id', conceptId)
      .single();
    
    if (conceptError) throw conceptError;
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(concept.map_id);
    
    // Update the concept
    const { data: updatedConcept, error } = await supabase
      .from('concepts')
      .update({
        title: conceptData.title,
        description: conceptData.description,
        content: conceptData.content,
        position_x: conceptData.positionX,
        position_y: conceptData.positionY,
        color: conceptData.color,
        icon: conceptData.icon,
        concept_type: conceptData.conceptType,
        metadata: conceptData.metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', conceptId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedConcept;
  }
  
  /**
   * Delete a concept
   * @param {string} conceptId - Concept ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteConcept(conceptId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Get the concept to check map ID
    const { data: concept, error: conceptError } = await supabase
      .from('concepts')
      .select('map_id')
      .eq('id', conceptId)
      .single();
    
    if (conceptError) throw conceptError;
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(concept.map_id);
    
    // Delete the concept (cascades to relationships)
    const { error } = await supabase
      .from('concepts')
      .delete()
      .eq('id', conceptId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Add a relationship between concepts
   * @param {string} mapId - Map ID
   * @param {Object} relationshipData - Relationship data
   * @returns {Promise<Object>} Created relationship
   */
  async addRelationship(mapId, relationshipData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(mapId);
    
    // Create the relationship
    const { data: relationship, error } = await supabase
      .from('relationships')
      .insert({
        map_id: mapId,
        source_id: relationshipData.sourceId,
        target_id: relationshipData.targetId,
        relationship_type: relationshipData.relationshipType,
        label: relationshipData.label,
        strength: relationshipData.strength,
        bidirectional: relationshipData.bidirectional || false,
        metadata: relationshipData.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return relationship;
  }
  
  /**
   * Update a relationship
   * @param {string} relationshipId - Relationship ID
   * @param {Object} relationshipData - Updated relationship data
   * @returns {Promise<Object>} Updated relationship
   */
  async updateRelationship(relationshipId, relationshipData) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Get the relationship to check map ID
    const { data: relationship, error: relError } = await supabase
      .from('relationships')
      .select('map_id')
      .eq('id', relationshipId)
      .single();
    
    if (relError) throw relError;
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(relationship.map_id);
    
    // Update the relationship
    const { data: updatedRelationship, error } = await supabase
      .from('relationships')
      .update({
        relationship_type: relationshipData.relationshipType,
        label: relationshipData.label,
        strength: relationshipData.strength,
        bidirectional: relationshipData.bidirectional,
        metadata: relationshipData.metadata || {},
        updated_at: new Date().toISOString()
      })
      .eq('id', relationshipId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedRelationship;
  }
  
  /**
   * Delete a relationship
   * @param {string} relationshipId - Relationship ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteRelationship(relationshipId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Get the relationship to check map ID
    const { data: relationship, error: relError } = await supabase
      .from('relationships')
      .select('map_id')
      .eq('id', relationshipId)
      .single();
    
    if (relError) throw relError;
    
    // Check if the user has permission to edit this map
    await this._checkEditPermission(relationship.map_id);
    
    // Delete the relationship
    const { error } = await supabase
      .from('relationships')
      .delete()
      .eq('id', relationshipId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Share a map with another user
   * @param {string} mapId - Map ID
   * @param {string} email - User email
   * @param {string} role - User role (viewer, editor, admin)
   * @returns {Promise<Object>} Collaborator record
   */
  async shareMap(mapId, email, role = 'viewer') {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user is the owner of the map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id !== this.userId) {
      // Check if the user is an admin
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .single();
      
      if (collabError) throw collabError;
      
      if (!collaborator || collaborator.role !== 'admin') {
        throw new Error('You do not have permission to share this map');
      }
    }
    
    // Find the user by email
    const { data: users, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();
    
    if (userError) throw new Error('User not found');
    
    const targetUserId = users.id;
    
    // Check if the user is already a collaborator
    const { data: existingCollab, error: existingError } = await supabase
      .from('map_collaborators')
      .select('*')
      .eq('map_id', mapId)
      .eq('user_id', targetUserId)
      .maybeSingle();
    
    if (existingError) throw existingError;
    
    if (existingCollab) {
      // Update the role
      const { data: updatedCollab, error } = await supabase
        .from('map_collaborators')
        .update({
          role,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingCollab.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedCollab;
    } else {
      // Add the collaborator
      const { data: newCollab, error } = await supabase
        .from('map_collaborators')
        .insert({
          map_id: mapId,
          user_id: targetUserId,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return newCollab;
    }
  }
  
  /**
   * Get collaborators for a map
   * @param {string} mapId - Map ID
   * @returns {Promise<Array>} Map collaborators
   */
  async getCollaborators(mapId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user has access to this map
    await this._checkViewPermission(mapId);
    
    // Get collaborators
    const { data: collaborators, error } = await supabase
      .from('map_collaborators')
      .select(`
        *,
        profiles:user_id(
          id,
          username,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq('map_id', mapId);
    
    if (error) throw error;
    
    // Get the map owner
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select(`
        user_id,
        profiles:user_id(
          id,
          username,
          full_name,
          avatar_url,
          email
        )
      `)
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    // Format the owner as a collaborator
    const owner = {
      user_id: map.user_id,
      role: 'owner',
      profiles: map.profiles,
      isOwner: true
    };
    
    // Format collaborators
    const formattedCollaborators = collaborators.map(collab => ({
      id: collab.id,
      userId: collab.user_id,
      role: collab.role,
      username: collab.profiles?.username,
      fullName: collab.profiles?.full_name,
      avatarUrl: collab.profiles?.avatar_url,
      email: collab.profiles?.email,
      isOwner: false
    }));
    
    // Format owner
    const formattedOwner = {
      id: null,
      userId: owner.user_id,
      role: 'owner',
      username: owner.profiles?.username,
      fullName: owner.profiles?.full_name,
      avatarUrl: owner.profiles?.avatar_url,
      email: owner.profiles?.email,
      isOwner: true
    };
    
    return [formattedOwner, ...formattedCollaborators];
  }
  
  /**
   * Remove a collaborator from a map
   * @param {string} mapId - Map ID
   * @param {string} collaboratorId - Collaborator ID
   * @returns {Promise<boolean>} Success status
   */
  async removeCollaborator(mapId, collaboratorId) {
    if (!this.initialized) {
      throw new Error('Knowledge Map Service not initialized');
    }
    
    // Check if the user is the owner of the map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id !== this.userId) {
      // Check if the user is an admin
      const { data: collaborator, error: collabError } = await supabase
        .from('map_collaborators')
        .select('role')
        .eq('map_id', mapId)
        .eq('user_id', this.userId)
        .single();
      
      if (collabError) throw collabError;
      
      if (!collaborator || collaborator.role !== 'admin') {
        throw new Error('You do not have permission to remove collaborators');
      }
    }
    
    // Delete the collaborator
    const { error } = await supabase
      .from('map_collaborators')
      .delete()
      .eq('id', collaboratorId)
      .eq('map_id', mapId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Check if the user has permission to edit a map
   * @param {string} mapId - Map ID
   * @returns {Promise<boolean>} Has permission
   * @private
   */
  async _checkEditPermission(mapId) {
    // Check if the user is the owner of the map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id === this.userId) {
      return true;
    }
    
    // Check if the user is an editor or admin
    const { data: collaborator, error: collabError } = await supabase
      .from('map_collaborators')
      .select('role')
      .eq('map_id', mapId)
      .eq('user_id', this.userId)
      .single();
    
    if (collabError) throw new Error('You do not have permission to edit this map');
    
    if (!collaborator || (collaborator.role !== 'editor' && collaborator.role !== 'admin')) {
      throw new Error('You do not have permission to edit this map');
    }
    
    return true;
  }
  
  /**
   * Check if the user has permission to view a map
   * @param {string} mapId - Map ID
   * @returns {Promise<boolean>} Has permission
   * @private
   */
  async _checkViewPermission(mapId) {
    // Check if the user is the owner of the map
    const { data: map, error: mapError } = await supabase
      .from('knowledge_maps')
      .select('user_id, is_public')
      .eq('id', mapId)
      .single();
    
    if (mapError) throw mapError;
    
    if (map.user_id === this.userId || map.is_public) {
      return true;
    }
    
    // Check if the user is a collaborator
    const { data: collaborator, error: collabError } = await supabase
      .from('map_collaborators')
      .select('role')
      .eq('map_id', mapId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (collabError) throw collabError;
    
    if (!collaborator) {
      throw new Error('You do not have permission to view this map');
    }
    
    return true;
  }
}

/**
 * Hook for using the Knowledge Map Service
 * @returns {Object} Knowledge Map Service methods
 */
export function useKnowledgeMap() {
  const service = KnowledgeMapService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createMap: service.createMap.bind(service),
    getUserMaps: service.getUserMaps.bind(service),
    getMapById: service.getMapById.bind(service),
    updateMap: service.updateMap.bind(service),
    deleteMap: service.deleteMap.bind(service),
    addConcept: service.addConcept.bind(service),
    updateConcept: service.updateConcept.bind(service),
    deleteConcept: service.deleteConcept.bind(service),
    addRelationship: service.addRelationship.bind(service),
    updateRelationship: service.updateRelationship.bind(service),
    deleteRelationship: service.deleteRelationship.bind(service),
    shareMap: service.shareMap.bind(service),
    getCollaborators: service.getCollaborators.bind(service),
    removeCollaborator: service.removeCollaborator.bind(service)
  };
}
