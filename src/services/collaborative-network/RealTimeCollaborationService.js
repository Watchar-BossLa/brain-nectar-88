/**
 * Real-Time Collaboration Service
 * Service for real-time collaborative study sessions
 */

import { supabase } from '@/integrations/supabase/client';
import { CollaborativeNetworkService } from './CollaborativeNetworkService';
import { nanoid } from 'nanoid';

/**
 * Real-Time Collaboration Service class
 */
export class RealTimeCollaborationService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.collaborativeNetwork = CollaborativeNetworkService.getInstance();
    this.activeSubscriptions = new Map();
  }
  
  /**
   * Get the singleton instance
   * @returns {RealTimeCollaborationService} The singleton instance
   */
  static getInstance() {
    if (!RealTimeCollaborationService.instance) {
      RealTimeCollaborationService.instance = new RealTimeCollaborationService();
    }
    return RealTimeCollaborationService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Real-Time Collaboration Service for user:', userId);
      this.userId = userId;
      
      // Ensure collaborative network service is initialized
      if (!this.collaborativeNetwork.initialized) {
        await this.collaborativeNetwork.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Real-Time Collaboration Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new study session
   * @param {Object} sessionData - Session data
   * @param {string} sessionData.groupId - Group ID
   * @param {string} sessionData.title - Session title
   * @param {string} [sessionData.description] - Session description
   * @param {string} sessionData.sessionType - Session type
   * @param {Date} [sessionData.scheduledAt] - Scheduled time
   * @returns {Promise<Object>} Created session
   */
  async createStudySession(sessionData) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    const {
      groupId,
      title,
      description = '',
      sessionType,
      scheduledAt = null
    } = sessionData;
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', groupId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to create a study session');
    }
    
    // Create session in database
    const { data: session, error } = await supabase
      .from('study_sessions')
      .insert({
        group_id: groupId,
        creator_id: this.userId,
        title,
        description,
        session_type: sessionType,
        status: scheduledAt ? 'scheduled' : 'active',
        scheduled_at: scheduledAt,
        started_at: scheduledAt ? null : new Date().toISOString(),
        session_data: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add creator as participant
    const { error: participantError } = await supabase
      .from('session_participants')
      .insert({
        session_id: session.id,
        user_id: this.userId,
        joined_at: new Date().toISOString()
      });
    
    if (participantError) throw participantError;
    
    // Create activity for creating session
    await this._createActivity('created_study_session', {
      session_id: session.id,
      session_title: session.title,
      group_id: groupId,
      session_type: sessionType
    });
    
    return session;
  }
  
  /**
   * Join a study session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async joinStudySession(sessionId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', session.group_id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to join this study session');
    }
    
    // Check if user is already a participant
    const { data: existingParticipant, error: participantCheckError } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (participantCheckError) throw participantCheckError;
    
    if (existingParticipant) {
      // If user previously left, update the record
      if (existingParticipant.left_at) {
        const { error: updateError } = await supabase
          .from('session_participants')
          .update({
            joined_at: new Date().toISOString(),
            left_at: null
          })
          .eq('session_id', sessionId)
          .eq('user_id', this.userId);
        
        if (updateError) throw updateError;
      }
    } else {
      // Add user as participant
      const { error: joinError } = await supabase
        .from('session_participants')
        .insert({
          session_id: sessionId,
          user_id: this.userId,
          joined_at: new Date().toISOString()
        });
      
      if (joinError) throw joinError;
    }
    
    // Subscribe to session updates
    this._subscribeToSession(sessionId);
    
    // Create activity for joining session
    await this._createActivity('joined_study_session', {
      session_id: sessionId,
      session_title: session.title,
      group_id: session.group_id
    });
    
    return true;
  }
  
  /**
   * Leave a study session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async leaveStudySession(sessionId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Update participant record
    const { error: leaveError } = await supabase
      .from('session_participants')
      .update({
        left_at: new Date().toISOString()
      })
      .eq('session_id', sessionId)
      .eq('user_id', this.userId);
    
    if (leaveError) throw leaveError;
    
    // Unsubscribe from session updates
    this._unsubscribeFromSession(sessionId);
    
    // Create activity for leaving session
    await this._createActivity('left_study_session', {
      session_id: sessionId,
      session_title: session.title,
      group_id: session.group_id
    });
    
    return true;
  }
  
  /**
   * Get active study sessions in a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array<Object>>} Active sessions
   */
  async getActiveStudySessions(groupId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
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
      throw new Error('You must be a member of the group to view its study sessions');
    }
    
    // Get active sessions
    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        creator:creator_id(id, username, avatar_url),
        participant_count:session_participants(count)
      `)
      .eq('group_id', groupId)
      .eq('status', 'active')
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    
    return sessions || [];
  }
  
  /**
   * Get scheduled study sessions in a group
   * @param {string} groupId - Group ID
   * @returns {Promise<Array<Object>>} Scheduled sessions
   */
  async getScheduledStudySessions(groupId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
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
      throw new Error('You must be a member of the group to view its study sessions');
    }
    
    // Get scheduled sessions
    const { data: sessions, error } = await supabase
      .from('study_sessions')
      .select(`
        *,
        creator:creator_id(id, username, avatar_url),
        participant_count:session_participants(count)
      `)
      .eq('group_id', groupId)
      .eq('status', 'scheduled')
      .order('scheduled_at', { ascending: true });
    
    if (error) throw error;
    
    return sessions || [];
  }
  
  /**
   * Get study session details
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session details
   */
  async getStudySessionDetails(sessionId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select(`
        *,
        creator:creator_id(id, username, avatar_url),
        group:group_id(id, name)
      `)
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is a member of the group
    const { data: membership, error: membershipError } = await supabase
      .from('group_members')
      .select('role')
      .eq('group_id', session.group_id)
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (membershipError) throw membershipError;
    
    if (!membership) {
      throw new Error('You must be a member of the group to view this study session');
    }
    
    // Get participants
    const { data: participants, error: participantsError } = await supabase
      .from('session_participants')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('session_id', sessionId)
      .is('left_at', null);
    
    if (participantsError) throw participantsError;
    
    // Get recent messages
    const { data: messages, error: messagesError } = await supabase
      .from('session_messages')
      .select(`
        *,
        user:user_id(id, username, avatar_url)
      `)
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (messagesError) throw messagesError;
    
    return {
      ...session,
      participants: participants || [],
      messages: (messages || []).reverse()
    };
  }
  
  /**
   * Start a collaborative flashcard review
   * @param {string} sessionId - Session ID
   * @param {string} deckId - Flashcard deck ID
   * @returns {Promise<boolean>} Success status
   */
  async startCollaborativeFlashcardReview(sessionId, deckId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is the session creator
    if (session.creator_id !== this.userId) {
      throw new Error('Only the session creator can start activities');
    }
    
    // Get flashcard deck
    const { data: deck, error: deckError } = await supabase
      .from('study_decks')
      .select('*')
      .eq('id', deckId)
      .single();
    
    if (deckError) throw deckError;
    
    // Get flashcards
    const { data: flashcards, error: flashcardsError } = await supabase
      .from('flashcards')
      .select('*')
      .eq('deck_id', deckId);
    
    if (flashcardsError) throw flashcardsError;
    
    // Update session data
    const sessionData = {
      activity: 'flashcard_review',
      deck: {
        id: deck.id,
        name: deck.name,
        description: deck.description
      },
      flashcards: flashcards || [],
      currentIndex: 0,
      revealed: false,
      startedAt: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from('study_sessions')
      .update({
        session_data: sessionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (updateError) throw updateError;
    
    // Send system message
    await this.sendSessionMessage(sessionId, {
      content: `Flashcard review started with deck: ${deck.name}`,
      isSystem: true
    });
    
    return true;
  }
  
  /**
   * Start a collaborative document analysis
   * @param {string} sessionId - Session ID
   * @param {string} documentId - Document ID
   * @returns {Promise<boolean>} Success status
   */
  async startCollaborativeDocumentAnalysis(sessionId, documentId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is the session creator
    if (session.creator_id !== this.userId) {
      throw new Error('Only the session creator can start activities');
    }
    
    // Get document
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();
    
    if (documentError) throw documentError;
    
    // Update session data
    const sessionData = {
      activity: 'document_analysis',
      document: {
        id: document.id,
        fileName: document.file_name,
        fileType: document.file_type,
        fileUrl: document.file_url
      },
      annotations: [],
      startedAt: new Date().toISOString()
    };
    
    const { error: updateError } = await supabase
      .from('study_sessions')
      .update({
        session_data: sessionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (updateError) throw updateError;
    
    // Send system message
    await this.sendSessionMessage(sessionId, {
      content: `Document analysis started with document: ${document.file_name}`,
      isSystem: true
    });
    
    return true;
  }
  
  /**
   * Update session data
   * @param {string} sessionId - Session ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated session data
   */
  async updateSessionData(sessionId, updateData) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is a participant
    const { data: participant, error: participantError } = await supabase
      .from('session_participants')
      .select('*')
      .eq('session_id', sessionId)
      .eq('user_id', this.userId)
      .is('left_at', null)
      .maybeSingle();
    
    if (participantError) throw participantError;
    
    if (!participant) {
      throw new Error('You must be an active participant to update session data');
    }
    
    // Merge update data with existing session data
    const newSessionData = {
      ...session.session_data,
      ...updateData,
      lastUpdatedBy: this.userId,
      lastUpdatedAt: new Date().toISOString()
    };
    
    // Update session
    const { data: updatedSession, error: updateError } = await supabase
      .from('study_sessions')
      .update({
        session_data: newSessionData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    
    return updatedSession.session_data;
  }
  
  /**
   * Send a message in a session
   * @param {string} sessionId - Session ID
   * @param {Object} messageData - Message data
   * @param {string} messageData.content - Message content
   * @param {boolean} [messageData.isSystem=false] - Whether it's a system message
   * @returns {Promise<Object>} Created message
   */
  async sendSessionMessage(sessionId, messageData) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    const { content, isSystem = false } = messageData;
    
    // Check if user is a participant (unless it's a system message)
    if (!isSystem) {
      const { data: participant, error: participantError } = await supabase
        .from('session_participants')
        .select('*')
        .eq('session_id', sessionId)
        .eq('user_id', this.userId)
        .is('left_at', null)
        .maybeSingle();
      
      if (participantError) throw participantError;
      
      if (!participant) {
        throw new Error('You must be an active participant to send messages');
      }
    }
    
    // Create message
    const { data: message, error } = await supabase
      .from('session_messages')
      .insert({
        session_id: sessionId,
        user_id: isSystem ? null : this.userId,
        content,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return message;
  }
  
  /**
   * End a study session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async endStudySession(sessionId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is the session creator
    if (session.creator_id !== this.userId) {
      throw new Error('Only the session creator can end the session');
    }
    
    // Update session
    const { error: updateError } = await supabase
      .from('study_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (updateError) throw updateError;
    
    // Send system message
    await this.sendSessionMessage(sessionId, {
      content: 'Study session ended',
      isSystem: true
    });
    
    // Create activity for ending session
    await this._createActivity('ended_study_session', {
      session_id: sessionId,
      session_title: session.title,
      group_id: session.group_id
    });
    
    return true;
  }
  
  /**
   * Start a scheduled session
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   */
  async startScheduledSession(sessionId) {
    if (!this.initialized) {
      throw new Error('Real-Time Collaboration Service not initialized');
    }
    
    // Get session details
    const { data: session, error: sessionError } = await supabase
      .from('study_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (sessionError) throw sessionError;
    
    // Check if user is the session creator
    if (session.creator_id !== this.userId) {
      throw new Error('Only the session creator can start the session');
    }
    
    // Check if session is scheduled
    if (session.status !== 'scheduled') {
      throw new Error('Only scheduled sessions can be started');
    }
    
    // Update session
    const { error: updateError } = await supabase
      .from('study_sessions')
      .update({
        status: 'active',
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    if (updateError) throw updateError;
    
    // Send system message
    await this.sendSessionMessage(sessionId, {
      content: 'Study session started',
      isSystem: true
    });
    
    // Create activity for starting session
    await this._createActivity('started_study_session', {
      session_id: sessionId,
      session_title: session.title,
      group_id: session.group_id
    });
    
    return true;
  }
  
  /**
   * Subscribe to session updates
   * @param {string} sessionId - Session ID
   * @param {Function} [callback] - Callback function for updates
   * @returns {Promise<boolean>} Success status
   * @private
   */
  _subscribeToSession(sessionId, callback = null) {
    // Check if already subscribed
    if (this.activeSubscriptions.has(sessionId)) {
      return true;
    }
    
    // Create subscription
    const subscription = supabase
      .channel(`session:${sessionId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'study_sessions',
        filter: `id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('session_update', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_messages',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('new_message', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        if (callback) {
          callback('participant_joined', payload.new);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'session_participants',
        filter: `session_id=eq.${sessionId}`
      }, (payload) => {
        if (payload.new.left_at && !payload.old.left_at) {
          if (callback) {
            callback('participant_left', payload.new);
          }
        }
      })
      .subscribe();
    
    // Store subscription
    this.activeSubscriptions.set(sessionId, subscription);
    
    return true;
  }
  
  /**
   * Unsubscribe from session updates
   * @param {string} sessionId - Session ID
   * @returns {Promise<boolean>} Success status
   * @private
   */
  _unsubscribeFromSession(sessionId) {
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
 * Hook for using the Real-Time Collaboration Service
 * @returns {Object} Real-Time Collaboration Service methods
 */
export function useRealTimeCollaboration() {
  const service = RealTimeCollaborationService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createStudySession: service.createStudySession.bind(service),
    joinStudySession: service.joinStudySession.bind(service),
    leaveStudySession: service.leaveStudySession.bind(service),
    getActiveStudySessions: service.getActiveStudySessions.bind(service),
    getScheduledStudySessions: service.getScheduledStudySessions.bind(service),
    getStudySessionDetails: service.getStudySessionDetails.bind(service),
    startCollaborativeFlashcardReview: service.startCollaborativeFlashcardReview.bind(service),
    startCollaborativeDocumentAnalysis: service.startCollaborativeDocumentAnalysis.bind(service),
    updateSessionData: service.updateSessionData.bind(service),
    sendSessionMessage: service.sendSessionMessage.bind(service),
    endStudySession: service.endStudySession.bind(service),
    startScheduledSession: service.startScheduledSession.bind(service)
  };
}
