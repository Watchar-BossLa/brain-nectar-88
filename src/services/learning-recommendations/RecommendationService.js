/**
 * Recommendation Service
 * Service for generating personalized learning recommendations
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Recommendation Service class
 */
export class RecommendationService {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {RecommendationService} The singleton instance
   */
  static getInstance() {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Recommendation Service for user:', userId);
      this.userId = userId;
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Recommendation Service:', error);
      return false;
    }
  }
  
  /**
   * Get recommendations for the user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Recommendations
   */
  async getRecommendations(options = {}) {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    const { 
      type, 
      limit = 10, 
      offset = 0, 
      includeViewed = false, 
      includeDismissed = false 
    } = options;
    
    // Build query
    let query = supabase
      .from('recommendations')
      .select(`
        *,
        content_items(*)
      `)
      .eq('user_id', this.userId);
    
    // Apply filters
    if (type) {
      query = query.eq('recommendation_type', type);
    }
    
    if (!includeViewed) {
      query = query.eq('is_viewed', false);
    }
    
    if (!includeDismissed) {
      query = query.eq('is_dismissed', false);
    }
    
    // Apply sorting and pagination
    query = query
      .order('relevance_score', { ascending: false })
      .range(offset, offset + limit - 1);
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Mark recommendation as viewed
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} Updated recommendation
   */
  async markAsViewed(recommendationId) {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    const { data, error } = await supabase
      .from('recommendations')
      .update({
        is_viewed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Save recommendation
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} Updated recommendation
   */
  async saveRecommendation(recommendationId) {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    const { data, error } = await supabase
      .from('recommendations')
      .update({
        is_saved: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Dismiss recommendation
   * @param {string} recommendationId - Recommendation ID
   * @returns {Promise<Object>} Updated recommendation
   */
  async dismissRecommendation(recommendationId) {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    const { data, error } = await supabase
      .from('recommendations')
      .update({
        is_dismissed: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', recommendationId)
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Generate recommendations based on user profile
   * @returns {Promise<Array>} Generated recommendations
   */
  async generateRecommendations() {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('learning_profiles')
      .select('*')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (profileError) throw profileError;
    
    if (!profile) {
      console.log('No profile found, skipping recommendation generation');
      return [];
    }
    
    // Get user topics
    const { data: userTopics, error: topicsError } = await supabase
      .from('user_topics')
      .select('*')
      .eq('user_id', this.userId);
    
    if (topicsError) throw topicsError;
    
    // Get user learning activities
    const { data: activities, error: activitiesError } = await supabase
      .from('learning_activities')
      .select('*')
      .eq('user_id', this.userId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (activitiesError) throw activitiesError;
    
    // Get existing recommendations
    const { data: existingRecommendations, error: recError } = await supabase
      .from('recommendations')
      .select('content_id')
      .eq('user_id', this.userId);
    
    if (recError) throw recError;
    
    const existingContentIds = new Set(existingRecommendations.map(r => r.content_id));
    
    // Generate topic-based recommendations
    const topicRecommendations = await this._generateTopicBasedRecommendations(
      userTopics, 
      existingContentIds
    );
    
    // Generate activity-based recommendations
    const activityRecommendations = await this._generateActivityBasedRecommendations(
      activities, 
      existingContentIds
    );
    
    // Generate learning style recommendations
    const styleRecommendations = await this._generateLearningStyleRecommendations(
      profile.learning_style, 
      existingContentIds
    );
    
    // Combine all recommendations
    const allRecommendations = [
      ...topicRecommendations,
      ...activityRecommendations,
      ...styleRecommendations
    ];
    
    // Insert recommendations into database
    if (allRecommendations.length > 0) {
      const { data: insertedRecommendations, error: insertError } = await supabase
        .from('recommendations')
        .insert(allRecommendations)
        .select();
      
      if (insertError) throw insertError;
      
      return insertedRecommendations;
    }
    
    return [];
  }
  
  /**
   * Generate topic-based recommendations
   * @param {Array} userTopics - User topics
   * @param {Set} existingContentIds - Existing content IDs
   * @returns {Promise<Array>} Topic-based recommendations
   * @private
   */
  async _generateTopicBasedRecommendations(userTopics, existingContentIds) {
    if (!userTopics || userTopics.length === 0) {
      return [];
    }
    
    const topicNames = userTopics.map(t => t.topic);
    const recommendations = [];
    
    // Find content items related to user topics
    const { data: contentItems, error } = await supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `)
      .filter('topics', 'cs', `{${topicNames.map(t => `"${t}"`).join(',')}}`)
      .limit(20);
    
    if (error) throw error;
    
    // Create recommendations for each content item
    for (const content of contentItems) {
      if (existingContentIds.has(content.id)) {
        continue;
      }
      
      // Calculate relevance score based on topic match
      let relevanceScore = 0;
      const contentTopics = content.topics || [];
      
      for (const userTopic of userTopics) {
        if (contentTopics.includes(userTopic.topic)) {
          relevanceScore += userTopic.interest_level || 5;
        }
      }
      
      // Normalize score to 0-100
      relevanceScore = Math.min(100, Math.round(relevanceScore * 10));
      
      recommendations.push({
        user_id: this.userId,
        content_id: content.id,
        recommendation_type: 'topic_based',
        relevance_score: relevanceScore,
        is_viewed: false,
        is_saved: false,
        is_dismissed: false,
        recommendation_data: {
          matched_topics: contentTopics.filter(t => topicNames.includes(t)),
          generation_time: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      existingContentIds.add(content.id);
    }
    
    return recommendations;
  }
  
  /**
   * Generate activity-based recommendations
   * @param {Array} activities - User activities
   * @param {Set} existingContentIds - Existing content IDs
   * @returns {Promise<Array>} Activity-based recommendations
   * @private
   */
  async _generateActivityBasedRecommendations(activities, existingContentIds) {
    if (!activities || activities.length === 0) {
      return [];
    }
    
    const recommendations = [];
    const contentIds = activities
      .filter(a => a.content_id)
      .map(a => a.content_id);
    
    if (contentIds.length === 0) {
      return [];
    }
    
    // Get content items from user activities
    const { data: activityContent, error } = await supabase
      .from('content_items')
      .select('*')
      .in('id', contentIds)
      .limit(10);
    
    if (error) throw error;
    
    // Extract topics from activity content
    const activityTopics = new Set();
    activityContent.forEach(content => {
      if (content.topics) {
        content.topics.forEach(topic => activityTopics.add(topic));
      }
    });
    
    if (activityTopics.size === 0) {
      return [];
    }
    
    // Find related content
    const { data: relatedContent, error: relatedError } = await supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `)
      .filter('topics', 'cs', `{${Array.from(activityTopics).map(t => `"${t}"`).join(',')}}`)
      .not('id', 'in', `(${contentIds.join(',')})`)
      .limit(10);
    
    if (relatedError) throw relatedError;
    
    // Create recommendations for related content
    for (const content of relatedContent) {
      if (existingContentIds.has(content.id)) {
        continue;
      }
      
      // Calculate relevance score based on topic overlap
      let relevanceScore = 0;
      const contentTopics = content.topics || [];
      const matchedTopics = contentTopics.filter(t => activityTopics.has(t));
      
      relevanceScore = Math.min(100, matchedTopics.length * 20);
      
      recommendations.push({
        user_id: this.userId,
        content_id: content.id,
        recommendation_type: 'activity_based',
        relevance_score: relevanceScore,
        is_viewed: false,
        is_saved: false,
        is_dismissed: false,
        recommendation_data: {
          matched_topics: matchedTopics,
          related_to_activities: contentIds.slice(0, 5),
          generation_time: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      existingContentIds.add(content.id);
    }
    
    return recommendations;
  }
  
  /**
   * Generate learning style recommendations
   * @param {Object} learningStyle - User learning style
   * @param {Set} existingContentIds - Existing content IDs
   * @returns {Promise<Array>} Learning style recommendations
   * @private
   */
  async _generateLearningStyleRecommendations(learningStyle, existingContentIds) {
    if (!learningStyle) {
      return [];
    }
    
    const recommendations = [];
    
    // Determine dominant learning style
    let dominantStyle = Object.entries(learningStyle)
      .sort((a, b) => b[1] - a[1])
      .map(([style]) => style)[0];
    
    // Map learning style to content type
    const styleToContentType = {
      visual: 'video',
      auditory: 'audio',
      reading: 'article',
      kinesthetic: 'interactive'
    };
    
    const preferredContentType = styleToContentType[dominantStyle] || 'video';
    
    // Find content matching the preferred type
    const { data: styleContent, error } = await supabase
      .from('content_items')
      .select(`
        *,
        content_analysis(*)
      `)
      .eq('content_type', preferredContentType)
      .limit(10);
    
    if (error) throw error;
    
    // Create recommendations for style-matched content
    for (const content of styleContent) {
      if (existingContentIds.has(content.id)) {
        continue;
      }
      
      // Base relevance score on learning style match
      const relevanceScore = Math.min(100, Math.round(learningStyle[dominantStyle] * 100));
      
      recommendations.push({
        user_id: this.userId,
        content_id: content.id,
        recommendation_type: 'learning_style',
        relevance_score: relevanceScore,
        is_viewed: false,
        is_saved: false,
        is_dismissed: false,
        recommendation_data: {
          learning_style: dominantStyle,
          content_type_match: preferredContentType,
          generation_time: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
      existingContentIds.add(content.id);
    }
    
    return recommendations;
  }
  
  /**
   * Get saved recommendations
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Saved recommendations
   */
  async getSavedRecommendations(options = {}) {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    const { limit = 10, offset = 0 } = options;
    
    const { data, error } = await supabase
      .from('recommendations')
      .select(`
        *,
        content_items(*)
      `)
      .eq('user_id', this.userId)
      .eq('is_saved', true)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    if (error) throw error;
    
    return data;
  }
  
  /**
   * Get recommendation statistics
   * @returns {Promise<Object>} Recommendation statistics
   */
  async getRecommendationStats() {
    if (!this.initialized) {
      throw new Error('Recommendation Service not initialized');
    }
    
    // Get counts for different recommendation states
    const { data: totalCount, error: totalError } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId);
    
    if (totalError) throw totalError;
    
    const { data: viewedCount, error: viewedError } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)
      .eq('is_viewed', true);
    
    if (viewedError) throw viewedError;
    
    const { data: savedCount, error: savedError } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)
      .eq('is_saved', true);
    
    if (savedError) throw savedError;
    
    const { data: dismissedCount, error: dismissedError } = await supabase
      .from('recommendations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', this.userId)
      .eq('is_dismissed', true);
    
    if (dismissedError) throw dismissedError;
    
    // Get counts by recommendation type
    const { data: typeData, error: typeError } = await supabase
      .from('recommendations')
      .select('recommendation_type')
      .eq('user_id', this.userId);
    
    if (typeError) throw typeError;
    
    const typeCount = {};
    typeData.forEach(rec => {
      typeCount[rec.recommendation_type] = (typeCount[rec.recommendation_type] || 0) + 1;
    });
    
    return {
      total: totalCount.length,
      viewed: viewedCount.length,
      saved: savedCount.length,
      dismissed: dismissedCount.length,
      byType: typeCount,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Hook for using the Recommendation Service
 * @returns {Object} Recommendation Service methods
 */
export function useRecommendations() {
  const service = RecommendationService.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    getRecommendations: service.getRecommendations.bind(service),
    markAsViewed: service.markAsViewed.bind(service),
    saveRecommendation: service.saveRecommendation.bind(service),
    dismissRecommendation: service.dismissRecommendation.bind(service),
    generateRecommendations: service.generateRecommendations.bind(service),
    getSavedRecommendations: service.getSavedRecommendations.bind(service),
    getRecommendationStats: service.getRecommendationStats.bind(service)
  };
}
