/**
 * AR Study Environment Service
 * Core service for managing augmented reality study environments
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * AR Study Environment Service class
 */
export class ARStudyEnvironmentService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {ARStudyEnvironmentService} The singleton instance
   */
  static getInstance() {
    if (!ARStudyEnvironmentService.instance) {
      ARStudyEnvironmentService.instance = new ARStudyEnvironmentService();
    }
    return ARStudyEnvironmentService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AR Study Environment Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AR Study Environment Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new AR study space
   * @param {Object} spaceData - Study space data
   * @param {string} spaceData.name - Space name
   * @param {string} [spaceData.description] - Space description
   * @param {string} spaceData.environmentType - Environment type
   * @param {Object} [spaceData.settings={}] - Environment settings
   * @param {boolean} [spaceData.isPublic=false] - Whether the space is public
   * @returns {Promise<Object>} Created study space
   */
  async createStudySpace(spaceData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    const {
      name,
      description = '',
      environmentType,
      settings = {},
      isPublic = false
    } = spaceData;
    
    // Create study space in database
    const { data: space, error } = await supabase
      .from('ar_study_spaces')
      .insert({
        user_id: this.userId,
        name,
        description,
        environment_type: environmentType,
        settings,
        is_public: isPublic,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return space;
  }
  
  /**
   * Get user's AR study spaces
   * @param {Object} [options] - Options
   * @param {number} [options.limit=20] - Maximum number of spaces
   * @param {number} [options.offset=0] - Offset for pagination
   * @returns {Promise<Array<Object>>} User's study spaces
   */
  async getUserStudySpaces(options = {}) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    const {
      limit = 20,
      offset = 0
    } = options;
    
    const { data, error } = await supabase
      .from('ar_study_spaces')
      .select('*')
      .eq('user_id', this.userId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get study space details
   * @param {string} spaceId - Study space ID
   * @returns {Promise<Object>} Study space details with objects
   */
  async getStudySpaceDetails(spaceId) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get space details
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('*')
      .eq('id', spaceId)
      .single();
    
    if (spaceError) throw spaceError;
    
    // Check if user has access to the space
    if (space.user_id !== this.userId && !space.is_public) {
      throw new Error('You do not have access to this study space');
    }
    
    // Get space objects
    const { data: objects, error: objectsError } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('space_id', spaceId)
      .order('created_at', { ascending: true });
    
    if (objectsError) throw objectsError;
    
    return {
      ...space,
      objects: objects || []
    };
  }
  
  /**
   * Update a study space
   * @param {string} spaceId - Study space ID
   * @param {Object} spaceData - Updated space data
   * @param {string} [spaceData.name] - Space name
   * @param {string} [spaceData.description] - Space description
   * @param {Object} [spaceData.settings] - Environment settings
   * @param {boolean} [spaceData.isPublic] - Whether the space is public
   * @returns {Promise<Object>} Updated study space
   */
  async updateStudySpace(spaceId, spaceData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', spaceId)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to update this study space');
    }
    
    // Prepare update data
    const updateData = {};
    
    if (spaceData.name !== undefined) updateData.name = spaceData.name;
    if (spaceData.description !== undefined) updateData.description = spaceData.description;
    if (spaceData.settings !== undefined) updateData.settings = spaceData.settings;
    if (spaceData.isPublic !== undefined) updateData.is_public = spaceData.isPublic;
    
    updateData.updated_at = new Date().toISOString();
    
    // Update space
    const { data: updatedSpace, error } = await supabase
      .from('ar_study_spaces')
      .update(updateData)
      .eq('id', spaceId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedSpace;
  }
  
  /**
   * Delete a study space
   * @param {string} spaceId - Study space ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteStudySpace(spaceId) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', spaceId)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to delete this study space');
    }
    
    // Delete space (will cascade delete objects)
    const { error } = await supabase
      .from('ar_study_spaces')
      .delete()
      .eq('id', spaceId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Add an object to a study space
   * @param {string} spaceId - Study space ID
   * @param {Object} objectData - Object data
   * @param {string} objectData.objectType - Object type
   * @param {string} objectData.contentType - Content type
   * @param {string} [objectData.contentId] - Content ID
   * @param {Object} objectData.position - 3D position
   * @param {Object} objectData.rotation - 3D rotation
   * @param {Object} objectData.scale - 3D scale
   * @param {Object} [objectData.settings={}] - Object settings
   * @returns {Promise<Object>} Created object
   */
  async addStudyObject(spaceId, objectData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', spaceId)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to add objects to this study space');
    }
    
    const {
      objectType,
      contentType,
      contentId,
      position,
      rotation,
      scale,
      settings = {}
    } = objectData;
    
    // Create object in database
    const { data: object, error } = await supabase
      .from('ar_study_objects')
      .insert({
        space_id: spaceId,
        object_type: objectType,
        content_type: contentType,
        content_id: contentId,
        position,
        rotation,
        scale,
        settings,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return object;
  }
  
  /**
   * Update a study object
   * @param {string} objectId - Object ID
   * @param {Object} objectData - Updated object data
   * @param {Object} [objectData.position] - 3D position
   * @param {Object} [objectData.rotation] - 3D rotation
   * @param {Object} [objectData.scale] - 3D scale
   * @param {Object} [objectData.settings] - Object settings
   * @returns {Promise<Object>} Updated object
   */
  async updateStudyObject(objectId, objectData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get object details
    const { data: object, error: objectError } = await supabase
      .from('ar_study_objects')
      .select('space_id')
      .eq('id', objectId)
      .single();
    
    if (objectError) throw objectError;
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', object.space_id)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to update objects in this study space');
    }
    
    // Prepare update data
    const updateData = {};
    
    if (objectData.position !== undefined) updateData.position = objectData.position;
    if (objectData.rotation !== undefined) updateData.rotation = objectData.rotation;
    if (objectData.scale !== undefined) updateData.scale = objectData.scale;
    if (objectData.settings !== undefined) updateData.settings = objectData.settings;
    
    updateData.updated_at = new Date().toISOString();
    
    // Update object
    const { data: updatedObject, error } = await supabase
      .from('ar_study_objects')
      .update(updateData)
      .eq('id', objectId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedObject;
  }
  
  /**
   * Delete a study object
   * @param {string} objectId - Object ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteStudyObject(objectId) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get object details
    const { data: object, error: objectError } = await supabase
      .from('ar_study_objects')
      .select('space_id')
      .eq('id', objectId)
      .single();
    
    if (objectError) throw objectError;
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', object.space_id)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to delete objects in this study space');
    }
    
    // Delete object
    const { error } = await supabase
      .from('ar_study_objects')
      .delete()
      .eq('id', objectId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Create a collaborative session
   * @param {string} spaceId - Study space ID
   * @param {Object} [sessionData={}] - Session data
   * @param {number} [sessionData.maxParticipants=10] - Maximum number of participants
   * @param {Object} [sessionData.settings={}] - Session settings
   * @returns {Promise<Object>} Created session
   */
  async createCollaborativeSession(spaceId, sessionData = {}) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Check if user owns the space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('user_id')
      .eq('id', spaceId)
      .single();
    
    if (spaceError) throw spaceError;
    
    if (space.user_id !== this.userId) {
      throw new Error('You do not have permission to create a session for this study space');
    }
    
    const {
      maxParticipants = 10,
      settings = {}
    } = sessionData;
    
    // Generate a session code
    const sessionCode = this._generateSessionCode();
    
    // Create session in database
    const { data: session, error } = await supabase
      .from('ar_collaborative_sessions')
      .insert({
        space_id: spaceId,
        host_id: this.userId,
        session_code: sessionCode,
        status: 'active',
        max_participants: maxParticipants,
        settings,
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add host as participant
    const { error: participantError } = await supabase
      .from('ar_session_participants')
      .insert({
        session_id: session.id,
        user_id: this.userId,
        role: 'host',
        joined_at: new Date().toISOString(),
        last_active_at: new Date().toISOString()
      });
    
    if (participantError) throw participantError;
    
    return session;
  }
  
  /**
   * Join a collaborative session
   * @param {string} sessionCode - Session code
   * @returns {Promise<Object>} Session details
   */
  async joinCollaborativeSession(sessionCode) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('ar_collaborative_sessions')
      .select('*')
      .eq('session_code', sessionCode)
      .eq('status', 'active')
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if session is full
    const { count, error: countError } = await supabase
      .from('ar_session_participants')
      .select('*', { count: 'exact', head: true })
      .eq('session_id', session.id)
      .is('left_at', null);
    
    if (countError) throw countError;
    
    if (count >= session.max_participants) {
      throw new Error('Session is full');
    }
    
    // Check if user is already a participant
    const { data: existingParticipant, error: participantError } = await supabase
      .from('ar_session_participants')
      .select('*')
      .eq('session_id', session.id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (participantError) throw participantError;
    
    if (existingParticipant) {
      if (existingParticipant.left_at) {
        // User previously left, update record
        const { error: updateError } = await supabase
          .from('ar_session_participants')
          .update({
            left_at: null,
            joined_at: new Date().toISOString(),
            last_active_at: new Date().toISOString()
          })
          .eq('id', existingParticipant.id);
        
        if (updateError) throw updateError;
      } else {
        // User is already an active participant, just update last_active_at
        const { error: updateError } = await supabase
          .from('ar_session_participants')
          .update({
            last_active_at: new Date().toISOString()
          })
          .eq('id', existingParticipant.id);
        
        if (updateError) throw updateError;
      }
    } else {
      // Add user as new participant
      const { error: insertError } = await supabase
        .from('ar_session_participants')
        .insert({
          session_id: session.id,
          user_id: this.userId,
          role: 'participant',
          joined_at: new Date().toISOString(),
          last_active_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
    
    // Get space details
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .select('*')
      .eq('id', session.space_id)
      .single();
    
    if (spaceError) throw spaceError;
    
    // Get space objects
    const { data: objects, error: objectsError } = await supabase
      .from('ar_study_objects')
      .select('*')
      .eq('space_id', session.space_id)
      .order('created_at', { ascending: true });
    
    if (objectsError) throw objectsError;
    
    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('ar_session_participants')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('session_id', session.id)
      .is('left_at', null);
    
    if (participantsError) throw participantsError;
    
    return {
      session,
      space: {
        ...space,
        objects: objects || []
      },
      participants: participants || []
    };
  }
  
  /**
   * Leave a collaborative session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async leaveCollaborativeSession(sessionId) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Update participant record
    const { error } = await supabase
      .from('ar_session_participants')
      .update({
        left_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * End a collaborative session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async endCollaborativeSession(sessionId) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Check if user is the host
    const { data: session, error: sessionError } = await supabase
      .from('ar_collaborative_sessions')
      .select('host_id')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    if (session.host_id !== this.userId) {
      throw new Error('Only the host can end the session');
    }
    
    // Update session
    const { error } = await supabase
      .from('ar_collaborative_sessions')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Log an interaction in a study space
   * @param {Object} logData - Log data
   * @param {string} logData.spaceId - Study space ID
   * @param {string} [logData.sessionId] - Session ID
   * @param {string} [logData.objectId] - Object ID
   * @param {string} logData.interactionType - Interaction type
   * @param {Object} [logData.interactionData={}] - Interaction data
   * @returns {Promise<Object>} Created log
   */
  async logInteraction(logData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    const {
      spaceId,
      sessionId,
      objectId,
      interactionType,
      interactionData = {}
    } = logData;
    
    // Create log in database
    const { data: log, error } = await supabase
      .from('ar_interaction_logs')
      .insert({
        session_id: sessionId,
        user_id: this.userId,
        space_id: spaceId,
        object_id: objectId,
        interaction_type: interactionType,
        interaction_data: interactionData,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return log;
  }
  
  /**
   * Get available environment templates
   * @returns {Promise<Array<Object>>} Environment templates
   */
  async getEnvironmentTemplates() {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get system templates and user's templates
    const { data, error } = await supabase
      .from('ar_templates')
      .select('*')
      .or(`is_system.eq.true,created_by.eq.${this.userId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Create a study space from a template
   * @param {string} templateId - Template ID
   * @param {Object} [spaceData={}] - Space data overrides
   * @param {string} [spaceData.name] - Space name
   * @param {string} [spaceData.description] - Space description
   * @param {boolean} [spaceData.isPublic] - Whether the space is public
   * @returns {Promise<Object>} Created study space
   */
  async createSpaceFromTemplate(templateId, spaceData = {}) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get template details
    const { data: template, error: templateError } = await supabase
      .from('ar_templates')
      .select('*')
      .eq('id', templateId)
      .single();
    
    if (templateError) throw templateError;
    
    // Create space
    const { data: space, error: spaceError } = await supabase
      .from('ar_study_spaces')
      .insert({
        user_id: this.userId,
        name: spaceData.name || template.name,
        description: spaceData.description || template.description,
        environment_type: template.environment_type,
        settings: template.template_data.settings || {},
        is_public: spaceData.isPublic !== undefined ? spaceData.isPublic : false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (spaceError) throw spaceError;
    
    // Create objects from template
    if (template.template_data.objects && template.template_data.objects.length > 0) {
      const objectInserts = template.template_data.objects.map(obj => ({
        space_id: space.id,
        object_type: obj.object_type,
        content_type: obj.content_type,
        content_id: obj.content_id,
        position: obj.position,
        rotation: obj.rotation,
        scale: obj.scale,
        settings: obj.settings || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
      
      const { error: objectsError } = await supabase
        .from('ar_study_objects')
        .insert(objectInserts);
      
      if (objectsError) throw objectsError;
    }
    
    return this.getStudySpaceDetails(space.id);
  }
  
  /**
   * Save a study space as a template
   * @param {string} spaceId - Study space ID
   * @param {Object} templateData - Template data
   * @param {string} templateData.name - Template name
   * @param {string} [templateData.description] - Template description
   * @returns {Promise<Object>} Created template
   */
  async saveSpaceAsTemplate(spaceId, templateData) {
    if (!this.initialized) {
      throw new Error('AR Study Environment Service not initialized');
    }
    
    // Get space details with objects
    const spaceDetails = await this.getStudySpaceDetails(spaceId);
    
    // Create template data
    const templateDataObj = {
      settings: spaceDetails.settings,
      objects: spaceDetails.objects.map(obj => ({
        object_type: obj.object_type,
        content_type: obj.content_type,
        content_id: obj.content_id,
        position: obj.position,
        rotation: obj.rotation,
        scale: obj.scale,
        settings: obj.settings
      }))
    };
    
    // Create template in database
    const { data: template, error } = await supabase
      .from('ar_templates')
      .insert({
        name: templateData.name,
        description: templateData.description || '',
        environment_type: spaceDetails.environment_type,
        preview_image_url: null, // TODO: Generate preview image
        template_data: templateDataObj,
        is_system: false,
        created_by: this.userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return template;
  }
  
  /**
   * Generate a random session code
   * @returns {string} Session code
   * @private
   */
  _generateSessionCode() {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    return code;
  }
}

/**
 * Hook for using the AR Study Environment Service
 * @returns {Object} AR Study Environment Service methods
 */
export function useARStudyEnvironment() {
  const service = ARStudyEnvironmentService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createStudySpace: service.createStudySpace.bind(service),
    getUserStudySpaces: service.getUserStudySpaces.bind(service),
    getStudySpaceDetails: service.getStudySpaceDetails.bind(service),
    updateStudySpace: service.updateStudySpace.bind(service),
    deleteStudySpace: service.deleteStudySpace.bind(service),
    addStudyObject: service.addStudyObject.bind(service),
    updateStudyObject: service.updateStudyObject.bind(service),
    deleteStudyObject: service.deleteStudyObject.bind(service),
    createCollaborativeSession: service.createCollaborativeSession.bind(service),
    joinCollaborativeSession: service.joinCollaborativeSession.bind(service),
    leaveCollaborativeSession: service.leaveCollaborativeSession.bind(service),
    endCollaborativeSession: service.endCollaborativeSession.bind(service),
    logInteraction: service.logInteraction.bind(service),
    getEnvironmentTemplates: service.getEnvironmentTemplates.bind(service),
    createSpaceFromTemplate: service.createSpaceFromTemplate.bind(service),
    saveSpaceAsTemplate: service.saveSpaceAsTemplate.bind(service)
  };
}
