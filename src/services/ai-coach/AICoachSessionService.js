/**
 * AI Coach Session Service
 * Service for managing AI coach sessions and interactions
 */

import { supabase } from '@/integrations/supabase/client';
import { AICoachProfileService } from './AICoachProfileService';
import { AICoachInsightService } from './AICoachInsightService';

/**
 * AI Coach Session Service class
 */
export class AICoachSessionService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.profileService = AICoachProfileService.getInstance();
  }
  
  /**
   * Get the singleton instance
   * @returns {AICoachSessionService} The singleton instance
   */
  static getInstance() {
    if (!AICoachSessionService.instance) {
      AICoachSessionService.instance = new AICoachSessionService();
    }
    return AICoachSessionService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AI Coach Session Service for user:', userId);
      this.userId = userId;
      
      // Ensure profile service is initialized
      if (!this.profileService.initialized) {
        await this.profileService.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Coach Session Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new coaching session
   * @param {string} sessionType - Session type
   * @param {Object} [sessionData={}] - Initial session data
   * @returns {Promise<Object>} Created session
   */
  async createSession(sessionType, sessionData = {}) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    // Get coach profile
    const profile = await this.profileService.getCoachProfile();
    
    // Create session
    const { data: session, error } = await supabase
      .from('ai_coach_sessions')
      .insert({
        user_id: this.userId,
        profile_id: profile.id,
        session_type: sessionType,
        status: 'active',
        session_data: sessionData,
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add initial coach message
    await this.addCoachMessage(session.id, this._getInitialMessage(sessionType, profile));
    
    return session;
  }
  
  /**
   * Get initial coach message based on session type
   * @param {string} sessionType - Session type
   * @param {Object} profile - Coach profile
   * @returns {string} Initial message
   * @private
   */
  _getInitialMessage(sessionType, profile) {
    const coachName = profile.coach_name;
    
    switch (sessionType) {
      case 'goal_setting':
        return `Hi there! I'm ${coachName}, your personal study coach. Let's work together to set some meaningful learning goals. What would you like to achieve?`;
      
      case 'study_planning':
        return `Hello! I'm ${coachName}, your study coach. I'm here to help you create an effective study plan. What are you working on right now?`;
      
      case 'progress_review':
        return `Hi! I'm ${coachName}, your study coach. Let's review your recent progress and see how you're doing. How have your studies been going lately?`;
      
      case 'motivation':
        return `Hey there! I'm ${coachName}, your study coach. I'm here to help you stay motivated and overcome any challenges. What's on your mind today?`;
      
      case 'learning_strategy':
        return `Hello! I'm ${coachName}, your study coach. I'm here to help you develop effective learning strategies. What subject or topic are you focusing on?`;
      
      default:
        return `Hi! I'm ${coachName}, your personal study coach. How can I help you today?`;
    }
  }
  
  /**
   * Get active session or create new one
   * @param {string} [sessionType='general'] - Session type for new session
   * @returns {Promise<Object>} Session
   */
  async getOrCreateActiveSession(sessionType = 'general') {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    // Check for active session
    const { data: activeSession, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) throw error;
    
    // Return active session if exists
    if (activeSession) {
      return activeSession;
    }
    
    // Create new session
    return this.createSession(sessionType);
  }
  
  /**
   * Get session by ID
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session
   */
  async getSession(sessionId) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: session, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    
    return session;
  }
  
  /**
   * Get user's recent sessions
   * @param {number} [limit=5] - Maximum number of sessions
   * @returns {Promise<Array<Object>>} Recent sessions
   */
  async getRecentSessions(limit = 5) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: sessions, error } = await supabase
      .from('ai_coach_sessions')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return sessions || [];
  }
  
  /**
   * End a coaching session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Updated session
   */
  async endSession(sessionId) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: session, error } = await supabase
      .from('ai_coach_sessions')
      .update({
        status: 'completed',
        ended_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return session;
  }
  
  /**
   * Add user message to session
   * @param {string} sessionId - Session ID
   * @param {string} content - Message content
   * @param {string} [messageType='text'] - Message type
   * @param {Object} [metadata={}] - Message metadata
   * @returns {Promise<Object>} Created message
   */
  async addUserMessage(sessionId, content, messageType = 'text', metadata = {}) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: message, error } = await supabase
      .from('ai_coach_messages')
      .insert({
        session_id: sessionId,
        sender: 'user',
        content,
        message_type: messageType,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update session
    await supabase
      .from('ai_coach_sessions')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    return message;
  }
  
  /**
   * Add coach message to session
   * @param {string} sessionId - Session ID
   * @param {string} content - Message content
   * @param {string} [messageType='text'] - Message type
   * @param {Object} [metadata={}] - Message metadata
   * @returns {Promise<Object>} Created message
   */
  async addCoachMessage(sessionId, content, messageType = 'text', metadata = {}) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: message, error } = await supabase
      .from('ai_coach_messages')
      .insert({
        session_id: sessionId,
        sender: 'coach',
        content,
        message_type: messageType,
        metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update session
    await supabase
      .from('ai_coach_sessions')
      .update({
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId);
    
    return message;
  }
  
  /**
   * Get session messages
   * @param {string} sessionId - Session ID
   * @returns {Promise<Array<Object>>} Session messages
   */
  async getSessionMessages(sessionId) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    const { data: messages, error } = await supabase
      .from('ai_coach_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return messages || [];
  }
  
  /**
   * Generate coach response
   * @param {string} sessionId - Session ID
   * @param {string} userMessage - User message
   * @returns {Promise<Object>} Coach message
   */
  async generateCoachResponse(sessionId, userMessage) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    try {
      // Get session
      const session = await this.getSession(sessionId);
      
      // Get coach profile
      const profile = await this.profileService.getCoachProfile();
      
      // Get session messages
      const messages = await this.getSessionMessages(sessionId);
      
      // In a real implementation, this would call an AI model
      // For now, we'll generate a simple response based on the user message
      
      // Add user message
      await this.addUserMessage(sessionId, userMessage);
      
      // Generate response
      const response = this._generateSimpleResponse(userMessage, session.session_type, profile, messages);
      
      // Add coach message
      const coachMessage = await this.addCoachMessage(sessionId, response);
      
      return coachMessage;
    } catch (error) {
      console.error('Error generating coach response:', error);
      throw error;
    }
  }
  
  /**
   * Generate a simple response based on user message
   * @param {string} userMessage - User message
   * @param {string} sessionType - Session type
   * @param {Object} profile - Coach profile
   * @param {Array<Object>} messages - Previous messages
   * @returns {string} Generated response
   * @private
   */
  _generateSimpleResponse(userMessage, sessionType, profile, messages) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return `Hi there! I'm ${profile.coach_name}, your study coach. How can I help you today?`;
    }
    
    // Check for goal-related questions
    if (lowerMessage.includes('goal') || lowerMessage.includes('objective') || lowerMessage.includes('aim')) {
      return `Setting clear goals is important for effective learning. What specific goal would you like to work on? Try to make it SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.`;
    }
    
    // Check for study plan questions
    if (lowerMessage.includes('plan') || lowerMessage.includes('schedule') || lowerMessage.includes('organize')) {
      return `Creating a study plan can help you stay organized and focused. Let's break down what you need to study into manageable chunks. What subject or topic are you working on right now?`;
    }
    
    // Check for motivation questions
    if (lowerMessage.includes('motivat') || lowerMessage.includes('stuck') || lowerMessage.includes('procrastinat')) {
      return `It's normal to feel unmotivated sometimes. Try breaking your work into smaller tasks and rewarding yourself after completing each one. What specific challenge are you facing right now?`;
    }
    
    // Check for learning strategy questions
    if (lowerMessage.includes('strategy') || lowerMessage.includes('technique') || lowerMessage.includes('method')) {
      return `There are many effective learning strategies like spaced repetition, active recall, and the Pomodoro technique. Based on your learning style, I can recommend specific strategies. What subject are you studying?`;
    }
    
    // Default responses based on session type
    switch (sessionType) {
      case 'goal_setting':
        return `That's interesting. When setting goals, it's helpful to be specific about what you want to achieve and by when. Could you tell me more about your timeline and how you'll measure success?`;
      
      case 'study_planning':
        return `I see. When planning your study sessions, it's important to consider your energy levels and attention span. Have you thought about when you're most productive during the day?`;
      
      case 'progress_review':
        return `Thanks for sharing. It's helpful to reflect on what's working well and what could be improved. What specific strategies have been most effective for you so far?`;
      
      case 'motivation':
        return `I understand how you feel. Remember why you started and focus on the progress you've made so far. What small step could you take right now to move forward?`;
      
      case 'learning_strategy':
        return `That's a good point. Different subjects often require different approaches. Have you tried using visual aids or teaching concepts to someone else to reinforce your understanding?`;
      
      default:
        return `I appreciate you sharing that with me. Could you tell me more about what you're hoping to achieve in your studies?`;
    }
  }
  
  /**
   * Update session data
   * @param {string} sessionId - Session ID
   * @param {Object} sessionData - Session data to update
   * @returns {Promise<Object>} Updated session
   */
  async updateSessionData(sessionId, sessionData) {
    if (!this.initialized) {
      throw new Error('AI Coach Session Service not initialized');
    }
    
    // Get current session
    const { data: currentSession, error: getError } = await supabase
      .from('ai_coach_sessions')
      .select('session_data')
      .eq('id', sessionId)
      .eq('user_id', this.userId)
      .single();
    
    if (getError) throw getError;
    
    // Merge session data
    const mergedData = {
      ...currentSession.session_data,
      ...sessionData
    };
    
    // Update session
    const { data: updatedSession, error } = await supabase
      .from('ai_coach_sessions')
      .update({
        session_data: mergedData,
        updated_at: new Date().toISOString()
      })
      .eq('id', sessionId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedSession;
  }
}

/**
 * Hook for using the AI Coach Session Service
 * @returns {Object} AI Coach Session Service methods
 */
export function useAICoachSession() {
  const service = AICoachSessionService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createSession: service.createSession.bind(service),
    getOrCreateActiveSession: service.getOrCreateActiveSession.bind(service),
    getSession: service.getSession.bind(service),
    getRecentSessions: service.getRecentSessions.bind(service),
    endSession: service.endSession.bind(service),
    addUserMessage: service.addUserMessage.bind(service),
    addCoachMessage: service.addCoachMessage.bind(service),
    getSessionMessages: service.getSessionMessages.bind(service),
    generateCoachResponse: service.generateCoachResponse.bind(service),
    updateSessionData: service.updateSessionData.bind(service)
  };
}
