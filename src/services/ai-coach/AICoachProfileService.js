/**
 * AI Coach Profile Service
 * Service for managing AI coach profiles and user preferences
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * AI Coach Profile Service class
 */
export class AICoachProfileService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {AICoachProfileService} The singleton instance
   */
  static getInstance() {
    if (!AICoachProfileService.instance) {
      AICoachProfileService.instance = new AICoachProfileService();
    }
    return AICoachProfileService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing AI Coach Profile Service for user:', userId);
      this.userId = userId;
      
      // Check if user has a coach profile
      const { data: profile, error } = await supabase
        .from('ai_coach_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      
      // Create profile if it doesn't exist
      if (!profile) {
        await this.createDefaultProfile();
      }
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize AI Coach Profile Service:', error);
      return false;
    }
  }
  
  /**
   * Create default coach profile
   * @returns {Promise<Object>} Created profile
   * @private
   */
  async createDefaultProfile() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }
    
    const { data: profile, error } = await supabase
      .from('ai_coach_profiles')
      .insert({
        user_id: this.userId,
        coach_name: 'Study Coach',
        coach_personality: 'supportive',
        coaching_style: 'balanced',
        active_goals: [],
        settings: {
          notifications_enabled: true,
          session_reminders: true,
          goal_reminders: true,
          insight_sharing: true,
          coach_avatar: 'default'
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return profile;
  }
  
  /**
   * Get user's coach profile
   * @returns {Promise<Object>} Coach profile
   */
  async getCoachProfile() {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    const { data: profile, error } = await supabase
      .from('ai_coach_profiles')
      .select('*')
      .eq('user_id', this.userId)
      .single();
    
    if (error) throw error;
    
    return profile;
  }
  
  /**
   * Update coach profile
   * @param {Object} profileData - Profile data to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateCoachProfile(profileData) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    // Get current profile
    const currentProfile = await this.getCoachProfile();
    
    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('ai_coach_profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedProfile;
  }
  
  /**
   * Update coach settings
   * @param {Object} settings - Settings to update
   * @returns {Promise<Object>} Updated profile
   */
  async updateCoachSettings(settings) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    // Get current profile
    const currentProfile = await this.getCoachProfile();
    
    // Merge settings
    const updatedSettings = {
      ...currentProfile.settings,
      ...settings
    };
    
    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('ai_coach_profiles')
      .update({
        settings: updatedSettings,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedProfile;
  }
  
  /**
   * Add active goal to coach profile
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Updated profile
   */
  async addActiveGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    // Get current profile
    const currentProfile = await this.getCoachProfile();
    
    // Add goal if not already in active goals
    if (!currentProfile.active_goals.includes(goalId)) {
      const activeGoals = [...currentProfile.active_goals, goalId];
      
      // Update profile
      const { data: updatedProfile, error } = await supabase
        .from('ai_coach_profiles')
        .update({
          active_goals: activeGoals,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedProfile;
    }
    
    return currentProfile;
  }
  
  /**
   * Remove active goal from coach profile
   * @param {string} goalId - Goal ID
   * @returns {Promise<Object>} Updated profile
   */
  async removeActiveGoal(goalId) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    // Get current profile
    const currentProfile = await this.getCoachProfile();
    
    // Remove goal from active goals
    const activeGoals = currentProfile.active_goals.filter(id => id !== goalId);
    
    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('ai_coach_profiles')
      .update({
        active_goals: activeGoals,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentProfile.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedProfile;
  }
  
  /**
   * Get learning style assessment
   * @returns {Promise<Object>} Learning style assessment
   */
  async getLearningStyleAssessment() {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    const { data: assessment, error } = await supabase
      .from('ai_coach_learning_styles')
      .select('*')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Create default assessment if it doesn't exist
    if (!assessment) {
      const { data: newAssessment, error: createError } = await supabase
        .from('ai_coach_learning_styles')
        .insert({
          user_id: this.userId,
          visual_score: 0.0,
          auditory_score: 0.0,
          reading_score: 0.0,
          kinesthetic_score: 0.0,
          social_score: 0.0,
          solitary_score: 0.0,
          logical_score: 0.0,
          assessment_completed: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      return newAssessment;
    }
    
    return assessment;
  }
  
  /**
   * Update learning style assessment
   * @param {Object} assessmentData - Assessment data
   * @returns {Promise<Object>} Updated assessment
   */
  async updateLearningStyleAssessment(assessmentData) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    // Get current assessment
    const currentAssessment = await this.getLearningStyleAssessment();
    
    // Update assessment
    const { data: updatedAssessment, error } = await supabase
      .from('ai_coach_learning_styles')
      .update({
        ...assessmentData,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentAssessment.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return updatedAssessment;
  }
  
  /**
   * Get dominant learning styles
   * @param {number} [limit=2] - Number of dominant styles to return
   * @returns {Promise<Array<string>>} Dominant learning styles
   */
  async getDominantLearningStyles(limit = 2) {
    if (!this.initialized) {
      throw new Error('AI Coach Profile Service not initialized');
    }
    
    const assessment = await this.getLearningStyleAssessment();
    
    // If assessment not completed, return empty array
    if (!assessment.assessment_completed) {
      return [];
    }
    
    // Create array of style scores
    const styles = [
      { name: 'visual', score: assessment.visual_score },
      { name: 'auditory', score: assessment.auditory_score },
      { name: 'reading', score: assessment.reading_score },
      { name: 'kinesthetic', score: assessment.kinesthetic_score },
      { name: 'social', score: assessment.social_score },
      { name: 'solitary', score: assessment.solitary_score },
      { name: 'logical', score: assessment.logical_score }
    ];
    
    // Sort by score (descending)
    styles.sort((a, b) => b.score - a.score);
    
    // Return top N styles
    return styles.slice(0, limit).map(style => style.name);
  }
}

/**
 * Hook for using the AI Coach Profile Service
 * @returns {Object} AI Coach Profile Service methods
 */
export function useAICoachProfile() {
  const service = AICoachProfileService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getCoachProfile: service.getCoachProfile.bind(service),
    updateCoachProfile: service.updateCoachProfile.bind(service),
    updateCoachSettings: service.updateCoachSettings.bind(service),
    addActiveGoal: service.addActiveGoal.bind(service),
    removeActiveGoal: service.removeActiveGoal.bind(service),
    getLearningStyleAssessment: service.getLearningStyleAssessment.bind(service),
    updateLearningStyleAssessment: service.updateLearningStyleAssessment.bind(service),
    getDominantLearningStyles: service.getDominantLearningStyles.bind(service)
  };
}
