/**
 * Learning Profile Service
 * Service for managing user learning profiles
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Learning Profile Service class
 */
export class LearningProfileService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {LearningProfileService} The singleton instance
   */
  static getInstance() {
    if (!LearningProfileService.instance) {
      LearningProfileService.instance = new LearningProfileService();
    }
    return LearningProfileService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Learning Profile Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Learning Profile Service:', error);
      return false;
    }
  }
  
  /**
   * Get user's learning profile
   * @returns {Promise<Object>} User's learning profile
   */
  async getProfile() {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    // Check if profile exists
    const { data: profile, error } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // If profile doesn't exist, create a default one
    if (!profile) {
      return this.createDefaultProfile();
    }
    
    // Get user topics
    const { data: topics, error: topicsError } = await supabase
      .from('user_topics')
      .select('*')
      .eq('user_id', this.userId);
    
    if (topicsError) throw topicsError;
    
    // Get learning goals
    const { data: goals, error: goalsError } = await supabase
      .from('learning_goals')
      .select('*')
      .eq('user_id', this.userId)
      .eq('status', 'active');
    
    if (goalsError) throw goalsError;
    
    // Get recent learning activities
    const { data: activities, error: activitiesError } = await supabase
      .from('learning_activities')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (activitiesError) throw activitiesError;
    
    return {
      ...profile,
      topics,
      goals,
      recentActivities: activities
    };
  }
  
  /**
   * Create a default learning profile
   * @returns {Promise<Object>} Created profile
   * @private
   */
  async createDefaultProfile() {
    // Create default profile
    const defaultProfile = {
      user_id: this.userId,
      learning_style: {
        visual: 0.5,
        auditory: 0.5,
        reading: 0.5,
        kinesthetic: 0.5
      },
      interests: [],
      strengths: [],
      weaknesses: [],
      goals: [],
      preferences: {
        studyDuration: 30,
        preferredTime: 'evening',
        contentTypes: ['article', 'video', 'quiz']
      },
      profile_data: {
        completeness: 0.1,
        lastAssessment: null
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: profile, error } = await supabase
      .from('learning_profiles')
      .insert(defaultProfile)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      ...profile,
      topics: [],
      goals: [],
      recentActivities: []
    };
  }
  
  /**
   * Update user's learning profile
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  async updateProfile(profileData) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    // Check if profile exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('learning_profiles')
      .select('id')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    let profile;
    
    if (existingProfile) {
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from('learning_profiles')
        .update({
          learning_style: profileData.learningStyle || null,
          interests: profileData.interests || null,
          strengths: profileData.strengths || null,
          weaknesses: profileData.weaknesses || null,
          goals: profileData.goals || null,
          preferences: profileData.preferences || null,
          profile_data: profileData.profileData || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      profile = updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error } = await supabase
        .from('learning_profiles')
        .insert({
          user_id: this.userId,
          learning_style: profileData.learningStyle || null,
          interests: profileData.interests || null,
          strengths: profileData.strengths || null,
          weaknesses: profileData.weaknesses || null,
          goals: profileData.goals || null,
          preferences: profileData.preferences || null,
          profile_data: profileData.profileData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      profile = newProfile;
    }
    
    return profile;
  }
  
  /**
   * Add a topic to user's interests
   * @param {Object} topicData - Topic data
   * @returns {Promise<Object>} Created topic
   */
  async addTopic(topicData) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { topic, interestLevel, proficiencyLevel, topicData: customTopicData } = topicData;
    
    // Check if topic already exists
    const { data: existingTopic, error: checkError } = await supabase
      .from('user_topics')
      .select('id')
      .eq('user_id', this.userId)
      .eq('topic', topic)
      .maybeSingle();
    
    if (checkError) throw checkError;
    
    if (existingTopic) {
      // Update existing topic
      const { data: updatedTopic, error } = await supabase
        .from('user_topics')
        .update({
          interest_level: interestLevel,
          proficiency_level: proficiencyLevel,
          topic_data: customTopicData || {},
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTopic.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedTopic;
    } else {
      // Create new topic
      const { data: newTopic, error } = await supabase
        .from('user_topics')
        .insert({
          user_id: this.userId,
          topic,
          interest_level: interestLevel,
          proficiency_level: proficiencyLevel,
          topic_data: customTopicData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return newTopic;
    }
  }
  
  /**
   * Remove a topic from user's interests
   * @param {string} topicId - Topic ID
   * @returns {Promise<boolean>} Success status
   */
  async removeTopic(topicId) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { error } = await supabase
      .from('user_topics')
      .delete()
      .eq('id', topicId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Add a learning goal
   * @param {Object} goalData - Goal data
   * @returns {Promise<Object>} Created goal
   */
  async addGoal(goalData) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { title, description, targetDate, priority, goalData: customGoalData } = goalData;
    
    // Create new goal
    const { data: goal, error } = await supabase
      .from('learning_goals')
      .insert({
        user_id: this.userId,
        title,
        description,
        target_date: targetDate,
        status: 'active',
        priority: priority || 'medium',
        progress: 0,
        goal_data: customGoalData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return goal;
  }
  
  /**
   * Update a learning goal
   * @param {string} goalId - Goal ID
   * @param {Object} goalData - Updated goal data
   * @returns {Promise<Object>} Updated goal
   */
  async updateGoal(goalId, goalData) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { title, description, targetDate, status, priority, progress, goalData: customGoalData } = goalData;
    
    // Update goal
    const { data: updatedGoal, error } = await supabase
      .from('learning_goals')
      .update({
        title,
        description,
        target_date: targetDate,
        status: status || 'active',
        priority: priority || 'medium',
        progress: progress || 0,
        goal_data: customGoalData || {},
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
   * Delete a learning goal
   * @param {string} goalId - Goal ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteGoal(goalId) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { error } = await supabase
      .from('learning_goals')
      .delete()
      .eq('id', goalId)
      .eq('user_id', this.userId);
    
    if (error) throw error;
    
    return true;
  }
  
  /**
   * Log a learning activity
   * @param {Object} activityData - Activity data
   * @returns {Promise<Object>} Created activity
   */
  async logActivity(activityData) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { 
      activityType, 
      contentId, 
      contentType, 
      duration, 
      engagementLevel, 
      performanceScore, 
      activityData: customActivityData 
    } = activityData;
    
    // Create activity
    const { data: activity, error } = await supabase
      .from('learning_activities')
      .insert({
        user_id: this.userId,
        activity_type: activityType,
        content_id: contentId,
        content_type: contentType,
        duration,
        engagement_level: engagementLevel,
        performance_score: performanceScore,
        activity_data: customActivityData || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return activity;
  }
  
  /**
   * Get user's learning activities
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Learning activities
   */
  async getActivities(options = {}) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    const { 
      activityType, 
      contentType, 
      limit = 20, 
      offset = 0, 
      sortBy = 'created_at', 
      sortOrder = 'desc' 
    } = options;
    
    // Build query
    let query = supabase
      .from('learning_activities')
      .select('*')
      .eq('user_id', this.userId);
    
    // Apply filters
    if (activityType) {
      query = query.eq('activity_type', activityType);
    }
    
    if (contentType) {
      query = query.eq('content_type', contentType);
    }
    
    // Apply sorting and pagination
    query = query
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get learning style assessment questions
   * @returns {Array} Assessment questions
   */
  getLearningStyleQuestions() {
    return [
      {
        id: 'visual_1',
        text: 'I prefer to see information written down.',
        category: 'visual'
      },
      {
        id: 'visual_2',
        text: 'I understand something better after I see it.',
        category: 'visual'
      },
      {
        id: 'visual_3',
        text: 'Charts, diagrams, and maps help me understand complex information.',
        category: 'visual'
      },
      {
        id: 'auditory_1',
        text: 'I learn better when someone explains things to me verbally.',
        category: 'auditory'
      },
      {
        id: 'auditory_2',
        text: 'I remember things better if I discuss them with someone else.',
        category: 'auditory'
      },
      {
        id: 'auditory_3',
        text: 'I prefer to listen to a lecture rather than read about a topic.',
        category: 'auditory'
      },
      {
        id: 'reading_1',
        text: 'I learn best by reading textbooks and articles.',
        category: 'reading'
      },
      {
        id: 'reading_2',
        text: 'I take detailed notes when learning something new.',
        category: 'reading'
      },
      {
        id: 'reading_3',
        text: 'I prefer written instructions over verbal instructions.',
        category: 'reading'
      },
      {
        id: 'kinesthetic_1',
        text: 'I learn best by doing hands-on activities.',
        category: 'kinesthetic'
      },
      {
        id: 'kinesthetic_2',
        text: 'I prefer to try things out myself rather than just reading about them.',
        category: 'kinesthetic'
      },
      {
        id: 'kinesthetic_3',
        text: 'I remember things better when I physically do them.',
        category: 'kinesthetic'
      }
    ];
  }
  
  /**
   * Process learning style assessment results
   * @param {Object} answers - Assessment answers
   * @returns {Object} Learning style profile
   */
  processLearningStyleAssessment(answers) {
    // Calculate scores for each learning style
    const scores = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0
    };
    
    let totalQuestions = 0;
    
    // Process each answer
    for (const [questionId, rating] of Object.entries(answers)) {
      const question = this.getLearningStyleQuestions().find(q => q.id === questionId);
      
      if (question) {
        scores[question.category] += rating;
        totalQuestions++;
      }
    }
    
    // Normalize scores (0-1 scale)
    const maxPossibleScore = 5; // Assuming 5-point scale
    const normalizedScores = {};
    
    for (const [category, score] of Object.entries(scores)) {
      const questionsInCategory = this.getLearningStyleQuestions().filter(q => q.category === category).length;
      const maxCategoryScore = questionsInCategory * maxPossibleScore;
      
      normalizedScores[category] = maxCategoryScore > 0 ? score / maxCategoryScore : 0;
    }
    
    // Determine dominant style
    let dominantStyle = Object.entries(normalizedScores)
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category)[0];
    
    return {
      scores: normalizedScores,
      dominantStyle,
      completedAt: new Date().toISOString()
    };
  }
  
  /**
   * Save learning style assessment results
   * @param {Object} assessmentResults - Assessment results
   * @returns {Promise<Object>} Updated profile
   */
  async saveLearningStyleAssessment(assessmentResults) {
    if (!this.initialized) {
      throw new Error('Learning Profile Service not initialized');
    }
    
    // Get current profile
    const { data: profile, error: profileError } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (profileError) throw profileError;
    
    // Create or update profile
    if (profile) {
      // Update existing profile
      const { data: updatedProfile, error } = await supabase
        .from('learning_profiles')
        .update({
          learning_style: assessmentResults.scores,
          profile_data: {
            ...profile.profile_data,
            completeness: this._calculateProfileCompleteness({
              ...profile,
              learning_style: assessmentResults.scores
            }),
            lastAssessment: assessmentResults.completedAt,
            dominantStyle: assessmentResults.dominantStyle
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return updatedProfile;
    } else {
      // Create new profile
      const { data: newProfile, error } = await supabase
        .from('learning_profiles')
        .insert({
          user_id: this.userId,
          learning_style: assessmentResults.scores,
          profile_data: {
            completeness: 0.25, // Basic profile with learning style
            lastAssessment: assessmentResults.completedAt,
            dominantStyle: assessmentResults.dominantStyle
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return newProfile;
    }
  }
  
  /**
   * Calculate profile completeness
   * @param {Object} profile - User profile
   * @returns {number} Completeness score (0-1)
   * @private
   */
  _calculateProfileCompleteness(profile) {
    let score = 0;
    let totalFactors = 5;
    
    // Learning style
    if (profile.learning_style && Object.keys(profile.learning_style).length > 0) {
      score += 1;
    }
    
    // Interests
    if (profile.interests && profile.interests.length > 0) {
      score += 1;
    }
    
    // Strengths and weaknesses
    if (profile.strengths && profile.strengths.length > 0) {
      score += 0.5;
    }
    
    if (profile.weaknesses && profile.weaknesses.length > 0) {
      score += 0.5;
    }
    
    // Goals
    if (profile.goals && profile.goals.length > 0) {
      score += 1;
    }
    
    // Preferences
    if (profile.preferences && Object.keys(profile.preferences).length > 0) {
      score += 1;
    }
    
    return Math.min(1, score / totalFactors);
  }
}

/**
 * Hook for using the Learning Profile Service
 * @returns {Object} Learning Profile Service methods
 */
export function useLearningProfile() {
  const service = LearningProfileService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getProfile: service.getProfile.bind(service),
    updateProfile: service.updateProfile.bind(service),
    addTopic: service.addTopic.bind(service),
    removeTopic: service.removeTopic.bind(service),
    addGoal: service.addGoal.bind(service),
    updateGoal: service.updateGoal.bind(service),
    deleteGoal: service.deleteGoal.bind(service),
    logActivity: service.logActivity.bind(service),
    getActivities: service.getActivities.bind(service),
    getLearningStyleQuestions: service.getLearningStyleQuestions.bind(service),
    processLearningStyleAssessment: service.processLearningStyleAssessment.bind(service),
    saveLearningStyleAssessment: service.saveLearningStyleAssessment.bind(service)
  };
}
