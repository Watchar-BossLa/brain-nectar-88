/**
 * AR Collaboration Service
 * Service for real-time collaboration in AR environments
 */

import { supabase } from '@/integrations/supabase/client';
import { ARStudyEnvironmentService } from './ARStudyEnvironmentService';

/**
 * AR Collaboration Service class
 */
export class ARCollaborationService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.arStudyEnvironment = ARStudyEnvironmentService.getInstance();
    this.activeSubscriptions = new Map();
  }
  
  /**
   * Get the singleton instance
   * @returns {ARCollaborationService} The singleton instance
   */
  static getInstance() {
    if (!ARCollaborationService.instance) {
      ARCollaborationService.instance = new ARCollaborationService();
    }
    return ARCollaborationService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AR Collaboration Service for user:', userId);
      this.userId = userId;
      
      // Ensure AR Study Environment Service is initialized
      if (!this.arStudyEnvironment.initialized) {
        await this.arStudyEnvironment.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AR Collaboration Service:', error);
      return false;
    }
  }
  
  /**
   * Get active collaborative sessions
   * @returns {Promise<Array<Object>>} Active sessions
   */
  async getActiveCollaborativeSessions() {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Get active sessions
    const { data, error } = await supabase
      .from('ar_collaborative_sessions')
      .select(`
        *,
        host:host_id(id, username, avatar_url),
        space:space_id(id, name, environment_type),
        participant_count:ar_session_participants(count)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  }
  
  /**
   * Get session details
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session details
   */
  async getSessionDetails(sessionId) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('ar_collaborative_sessions')
      .select(`
        *,
        host:host_id(id, username, avatar_url),
        space:space_id(id, name, environment_type)
      `)
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('ar_session_participants')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('session_id', sessionId)
      .is('left_at', null);
    
    if (participantsError) throw participantsError;
    
    return {
      ...session,
      participants: participants || []
    };
  }
  
  /**
   * Subscribe to session updates
   * @param {string} sessionId - Session ID
   * @param {Function} callback - Callback function for updates
   * @returns {Promise<boolean>} Success status
   */
  subscribeToSession(sessionId, callback) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Check if already subscribed
    if (this.activeSubscriptions.has(sessionId)) {
      return true;
    }
    
    // Create subscription
    const subscription = supabase
      .channel(`ar_session:${sessionId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = subscription.presenceState();
        if (callback) {
          callback('presence_sync', state);
        }
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (callback) {
          callback('presence_join', { key, newPresences });
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (callback) {
          callback('presence_leave', { key, leftPresences });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ar_collaborative_sessions',
        filter: `id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('session_update', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ar_session_participants',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('participant_joined', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ar_session_participants',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        if (payload.new.left_at && !payload.old.left_at) {
          if (callback) {
            callback('participant_left', payload.new);
          }
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'ar_study_objects',
        filter: `space_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('object_added', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'ar_study_objects',
        filter: `space_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('object_updated', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'ar_study_objects',
        filter: `space_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('object_deleted', payload.old);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          // Track user presence
          subscription.track({
            user_id: this.userId,
            online_at: new Date().toISOString()
          });
        }
      });
    
    // Store subscription
    this.activeSubscriptions.set(sessionId, subscription);
    
    return true;
  }
  
  /**
   * Unsubscribe from session updates
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  unsubscribeFromSession(sessionId) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Check if subscribed
    if (!this.activeSubscriptions.has(sessionId)) {
      return true;
    }
    
    // Get subscription
    const subscription = this.activeSubscriptions.get(sessionId);
    
    // Unsubscribe
    supabase.removeChannel(subscription);
    
    // Remove from active subscriptions
    this.activeSubscriptions.delete(sessionId);
    
    return true;
  }
  
  /**
   * Broadcast transform update
   * @param {string} sessionId - Session ID
   * @param {string} objectId - Object ID
   * @param {Object} transform - Transform data
   * @returns {Promise<boolean>} Success status
   */
  async broadcastTransformUpdate(sessionId, objectId, transform) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Get subscription
    const subscription = this.activeSubscriptions.get(sessionId);
    
    if (!subscription) {
      throw new Error('Not subscribed to session');
    }
    
    // Broadcast transform update
    subscription.send({
      type: 'broadcast',
      event: 'transform_update',
      payload: {
        object_id: objectId,
        user_id: this.userId,
        transform,
        timestamp: new Date().toISOString()
      }
    });
    
    return true;
  }
  
  /**
   * Broadcast interaction event
   * @param {string} sessionId - Session ID
   * @param {string} objectId - Object ID
   * @param {string} interactionType - Interaction type
   * @param {Object} interactionData - Interaction data
   * @returns {Promise<boolean>} Success status
   */
  async broadcastInteraction(sessionId, objectId, interactionType, interactionData = {}) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Get subscription
    const subscription = this.activeSubscriptions.get(sessionId);
    
    if (!subscription) {
      throw new Error('Not subscribed to session');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('ar_collaborative_sessions')
      .select('space_id')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Log interaction
    await this.arStudyEnvironment.logInteraction({
      sessionId,
      spaceId: session.space_id,
      objectId,
      interactionType,
      interactionData
    });
    
    // Broadcast interaction
    subscription.send({
      type: 'broadcast',
      event: 'interaction',
      payload: {
        object_id: objectId,
        user_id: this.userId,
        interaction_type: interactionType,
        interaction_data: interactionData,
        timestamp: new Date().toISOString()
      }
    });
    
    return true;
  }
  
  /**
   * Broadcast user position
   * @param {string} sessionId - Session ID
   * @param {Object} position - Position data
   * @returns {Promise<boolean>} Success status
   */
  async broadcastUserPosition(sessionId, position) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Get subscription
    const subscription = this.activeSubscriptions.get(sessionId);
    
    if (!subscription) {
      throw new Error('Not subscribed to session');
    }
    
    // Update presence data
    subscription.track({
      user_id: this.userId,
      online_at: new Date().toISOString(),
      position
    });
    
    return true;
  }
  
  /**
   * Update participant status
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async updateParticipantStatus(sessionId) {
    if (!this.initialized) {
      throw new Error('AR Collaboration Service not initialized');
    }
    
    // Update participant record
    const { error } = await supabase
      .from('ar_session_participants')
      .update({
        last_active_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
}

/**
 * Hook for using the AR Collaboration Service
 * @returns {Object} AR Collaboration Service methods
 */
export function useARCollaboration() {
  const service = ARCollaborationService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getActiveCollaborativeSessions: service.getActiveCollaborativeSessions.bind(service),
    getSessionDetails: service.getSessionDetails.bind(service),
    subscribeToSession: service.subscribeToSession.bind(service),
    unsubscribeFromSession: service.unsubscribeFromSession.bind(service),
    broadcastTransformUpdate: service.broadcastTransformUpdate.bind(service),
    broadcastInteraction: service.broadcastInteraction.bind(service),
    broadcastUserPosition: service.broadcastUserPosition.bind(service),
    updateParticipantStatus: service.updateParticipantStatus.bind(service)
  };
}
