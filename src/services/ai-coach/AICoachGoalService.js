/**
 * AI Coach Goal Service
 * Service for managing learning goals and progress tracking
 */

import { supabase } from '@/integrations/supabase/client';
import { AICoachProfileService } from './AICoachProfileService';

/**
 * AI Coach Goal Service class
 */
export class AICoachGoalService {
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
   * @returns {AICoachGoalService} The singleton instance
   */
  static getInstance() {
    if (!AICoachGoalService.instance) {
      AICoachGoalService.instance = new AICoachGoalService();
    }
    return AICoachGoalService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AI Coach Goal Service for user:', userId);
      this.userId = userId;
      
      // Ensure profile service is initialized
      if (!this.profileService.initialized) {
        await this.profileService.initialize(userId);
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Coach Goal Service:', error);
      return false;
    }
  }
  
  /**
   * Create a new learning goal
   * @param {Object} goalData - Goal data
   * @param {string} goalData.title - Goal title
   * @param {string} [goalData.description] - Goal description
   * @param {string} goalData.goalType - Goal type
   * @param {Date} [goalData.targetDate] - Target completion date
   * @param {Object} [goalData.metrics={}] - Goal metrics
   * @returns {Promise<Object>} Created goal
   */
  async createGoal(goalData) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    const {
      title,
      description = '',
      goalType,
      targetDate,
      metrics = {}
    } = goalData;
    
    // Create goal
    const { data: goal, error } = await supabase
      .from('ai_coach_goals')
      .insert({
        user_id: this.userId,
        title,
        description,
        goal_type: goalType,
        status: 'active',
        target_date: targetDate ? new Date(targetDate).toISOString() : null,
        progress: 0.0,
        metrics,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Add to active goals in profile
    await this.profileService.addActiveGoal(goal.id);
    
    return goal;
  }
  
  /**
   * Get user's goals
   * @param {string} [status] - Filter by status (optional)
   * @returns {Promise<Array<Object>>} User goals
   */
  async getUserGoals(status) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    let query = supabase
      .from('ai_coach_goals')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data: goals, error } = await query;
    
    if (error) throw error;
    
    return goals || [];
  }
  
  /**
   * Get goal by ID
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Goal
   */
  async getGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    const { data: goal, error } = await supabase
      .from('ai_coach_goals')
      .select('*')
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    
    return goal;
  }
  
  /**
   * Update goal
   * @param {string} goalId - Goal ID
   * @param {Object} goalData - Goal data to update
   * @returns {Promise<Object>} Updated goal
   */
  async updateGoal(goalId, goalData) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // Update goal
    const { data: updatedGoal, error } = await supabase
      .from('ai_coach_goals')
      .update({
        ...goalData,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedGoal;
  }
  
  /**
   * Update goal progress
   * @param {string} goalId - Goal ID
   * @param {number} progress - Progress value (0-1)
   * @returns {Promise<Object>} Updated goal
   */
  async updateGoalProgress(goalId, progress) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // Ensure progress is between 0 and 1
    const normalizedProgress = Math.max(0, Math.min(1, progress));
    
    // Update goal
    const { data: updatedGoal, error } = await supabase
      .from('ai_coach_goals')
      .update({
        progress: normalizedProgress,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // If goal is completed, update status
    if (normalizedProgress >= 1.0) {
      await this.completeGoal(goalId);
    }
    
    return updatedGoal;
  }
  
  /**
   * Complete goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Updated goal
   */
  async completeGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // Update goal
    const { data: updatedGoal, error } = await supabase
      .from('ai_coach_goals')
      .update({
        status: 'completed',
        progress: 1.0,
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Remove from active goals in profile
    await this.profileService.removeActiveGoal(goalId);
    
    return updatedGoal;
  }
  
  /**
   * Archive goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Updated goal
   */
  async archiveGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // Update goal
    const { data: updatedGoal, error } = await supabase
      .from('ai_coach_goals')
      .update({
        status: 'archived',
        updated_at: new Date().toISOString()
      })
      .eq('id', goalId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Remove from active goals in profile
    await this.profileService.removeActiveGoal(goalId);
    
    return updatedGoal;
  }
  
  /**
   * Delete goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // Remove from active goals in profile
    await this.profileService.removeActiveGoal(goalId);
    
    // Delete goal
    const { error } = await supabase
      .from('ai_coach_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Record study session for goal
   * @param {string} goalId - Goal ID
   * @param {Object} sessionData - Session data
   * @param {string} sessionData.sessionType - Session type
   * @param {number} sessionData.duration - Duration in minutes
   * @param {number} [sessionData.effectivenessScore] - Effectiveness score (0-1)
   * @param {number} [sessionData.focusScore] - Focus score (0-1)
   * @param {Object} [sessionData.sessionData={}] - Additional session data
   * @returns {Promise<Object>} Created study session
   */
  async recordStudySession(goalId, sessionData) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    const {
      sessionType,
      duration,
      effectivenessScore,
      focusScore,
      sessionData: additionalData = {}
    } = sessionData;
    
    // Create study session
    const { data: studySession, error } = await supabase
      .from('ai_coach_study_sessions')
      .insert({
        user_id: this.userId,
        goal_id: goalId,
        session_type: sessionType,
        duration,
        effectiveness_score: effectivenessScore,
        focus_score: focusScore,
        session_data: additionalData,
        started_at: new Date().toISOString(),
        ended_at: new Date(Date.now() + duration * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Update goal progress based on session
    await this._updateGoalProgressFromSession(goalId, studySession);
    
    return studySession;
  }
  
  /**
   * Update goal progress based on study session
   * @param {string} goalId - Goal ID
   * @param {Object} session - Study session
   * @returns {Promise<Object>} Updated goal
   * @private
   */
  async _updateGoalProgressFromSession(goalId, session) {
    // Get current goal
    const goal = await this.getGoal(goalId);
    
    // Get all study sessions for this goal
    const { data: sessions, error } = await supabase
      .from('ai_coach_study_sessions')
      .select('*')
      .eq('goal_id', goalId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    let newProgress = 0;
    
    // Calculate progress based on goal type
    switch (goal.goal_type) {
      case 'study_time':
        // Progress based on total study time
        if (goal.metrics && goal.metrics.target_hours) {
          const targetMinutes = goal.metrics.target_hours * 60;
          const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
          newProgress = Math.min(1, totalMinutes / targetMinutes);
        }
        break;
      
      case 'topic_mastery':
        // Progress based on effectiveness scores
        if (sessions.length > 0) {
          const avgEffectiveness = sessions.reduce((sum, s) => sum + (s.effectiveness_score || 0), 0) / sessions.length;
          newProgress = avgEffectiveness;
        }
        break;
      
      case 'exam_preparation':
        // Progress based on completed topics
        if (goal.metrics && goal.metrics.total_topics && goal.metrics.completed_topics) {
          newProgress = Math.min(1, goal.metrics.completed_topics / goal.metrics.total_topics);
        }
        break;
      
      case 'habit_formation':
        // Progress based on consistency
        if (goal.metrics && goal.metrics.target_sessions) {
          newProgress = Math.min(1, sessions.length / goal.metrics.target_sessions);
        }
        break;
      
      default:
        // Default progress calculation
        if (goal.metrics && goal.metrics.progress_value) {
          newProgress = goal.metrics.progress_value;
        }
    }
    
    // Update goal progress
    return this.updateGoalProgress(goalId, newProgress);
  }
  
  /**
   * Get study sessions for goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<Array<Object>>} Study sessions
   */
  async getStudySessionsForGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    const { data: sessions, error } = await supabase
      .from('ai_coach_study_sessions')
      .select('*')
      .eq('goal_id', goalId)
      .eq('user_id', this.userId)
      .order('started_at', { ascending: false });
    
    if (error) throw error;
    
    return sessions || [];
  }
  
  /**
   * Get all user's study sessions
   * @param {number} [limit=20] - Maximum number of sessions
   * @returns {Promise<Array<Object>>} Study sessions
   */
  async getAllStudySessions(limit = 20) {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    const { data: sessions, error } = await supabase
      .from('ai_coach_study_sessions')
      .select(`
        *,
        goal:goal_id(id, title, goal_type)
      `)
      .eq('user_id', this.userId)
      .order('started_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return sessions || [];
  }
  
  /**
   * Generate goal suggestions
   * @returns {Promise<Array<Object>>} Goal suggestions
   */
  async generateGoalSuggestions() {
    if (!this.initialized) {
      throw new Error('AI Coach Goal Service not initialized');
    }
    
    // In a real implementation, this would analyze user data
    // For now, we'll return some sample suggestions
    
    return [
      {
        title: 'Study 20 hours this month',
        description: 'Dedicate at least 20 hours to focused study time this month',
        goalType: 'study_time',
        metrics: {
          target_hours: 20
        }
      },
      {
        title: 'Master key concepts in your current course',
        description: 'Achieve a deep understanding of the fundamental concepts in your current course',
        goalType: 'topic_mastery',
        metrics: {
          subject: 'Current course',
          target_mastery_level: 0.8
        }
      },
      {
        title: 'Establish a daily study routine',
        description: 'Create and maintain a consistent daily study habit',
        goalType: 'habit_formation',
        metrics: {
          target_sessions: 30,
          session_frequency: 'daily'
        }
      },
      {
        title: 'Complete 50 practice problems',
        description: 'Solve at least 50 practice problems to reinforce your understanding',
        goalType: 'practice',
        metrics: {
          target_problems: 50,
          completed_problems: 0
        }
      }
    ];
  }
}

/**
 * Hook for using the AI Coach Goal Service
 * @returns {Object} AI Coach Goal Service methods
 */
export function useAICoachGoal() {
  const service = AICoachGoalService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    createGoal: service.createGoal.bind(service),
    getUserGoals: service.getUserGoals.bind(service),
    getGoal: service.getGoal.bind(service),
    updateGoal: service.updateGoal.bind(service),
    updateGoalProgress: service.updateGoalProgress.bind(service),
    completeGoal: service.completeGoal.bind(service),
    archiveGoal: service.archiveGoal.bind(service),
    deleteGoal: service.deleteGoal.bind(service),
    recordStudySession: service.recordStudySession.bind(service),
    getStudySessionsForGoal: service.getStudySessionsForGoal.bind(service),
    getAllStudySessions: service.getAllStudySessions.bind(service),
    generateGoalSuggestions: service.generateGoalSuggestions.bind(service)
  };
}
