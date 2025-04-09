/**
 * Adaptive Spaced Repetition Algorithm
 * This service implements an enhanced adaptive spaced repetition algorithm
 * that adjusts to the user's learning patterns and performance.
 */

import { supabase } from '@/integrations/supabase/client';

/**
 * Adaptive Algorithm Service class
 */
export class AdaptiveAlgorithm {
  static instance;
  
  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
  }
  
  /**
   * Get the singleton instance
   * @returns {AdaptiveAlgorithm} The singleton instance
   */
  static getInstance() {
    if (!AdaptiveAlgorithm.instance) {
      AdaptiveAlgorithm.instance = new AdaptiveAlgorithm();
    }
    return AdaptiveAlgorithm.instance;
  }
  
  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Adaptive Algorithm Service for user:', userId);
      this.userId = userId;
      
      // Load user settings
      await this.loadUserSettings();
      
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Adaptive Algorithm Service:', error);
      return false;
    }
  }
  
  /**
   * Load user settings
   * @returns {Promise<Object>} User settings
   * @private
   */
  async loadUserSettings() {
    if (!this.userId) {
      throw new Error('User ID not set');
    }
    
    // Get user settings
    const { data: settings, error } = await supabase
      .from('spaced_repetition_settings')
      .select('*')
      .eq('user_id', this.userId)
      .maybeSingle();
    
    if (error) throw error;
    
    // Create default settings if they don't exist
    if (!settings) {
      const { data: newSettings, error: createError } = await supabase
        .from('spaced_repetition_settings')
        .insert({
          user_id: this.userId,
          algorithm_type: 'adaptive',
          new_cards_per_day: 20,
          review_cards_per_day: 100,
          learn_ahead_time: 20,
          timezone: 'UTC',
          learn_steps: [1, 10],
          relearn_steps: [10],
          initial_ease: 250,
          easy_bonus: 1.3,
          interval_modifier: 1.0,
          maximum_interval: 36500,
          settings_data: {
            difficulty_weight: 1.0,
            retention_target: 0.9,
            adaptive_interval_scaling: true,
            time_weight: 0.5,
            error_weight: 1.5,
            pattern_recognition: true
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) throw createError;
      
      this.settings = newSettings;
    } else {
      this.settings = settings;
    }
    
    return this.settings;
  }
  
  /**
   * Update user settings
   * @param {Object} settingsData - Settings data to update
   * @returns {Promise<Object>} Updated settings
   */
  async updateSettings(settingsData) {
    if (!this.initialized) {
      throw new Error('Adaptive Algorithm Service not initialized');
    }
    
    // Update settings
    const { data: updatedSettings, error } = await supabase
      .from('spaced_repetition_settings')
      .update({
        ...settingsData,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', this.userId)
      .select()
      .single();
    
    if (error) throw error;
    
    this.settings = updatedSettings;
    
    return updatedSettings;
  }
  
  /**
   * Calculate next interval using adaptive algorithm
   * @param {Object} card - Card data
   * @param {number} rating - Rating (1-5)
   * @param {Object} reviewData - Review data
   * @returns {Object} Next interval data
   */
  calculateNextInterval(card, rating, reviewData) {
    if (!this.initialized) {
      throw new Error('Adaptive Algorithm Service not initialized');
    }
    
    // Convert rating to SM-2 quality (0-5)
    const quality = rating - 1;
    
    // Get current card state
    const easeFactor = card.ease_factor || this.settings.initial_ease / 100;
    const interval = card.interval || 0;
    const repetitions = card.repetitions || 0;
    
    // Get settings
    const settings = this.settings;
    const settingsData = settings.settings_data || {};
    
    // Calculate time factor (how long it took to answer relative to expected time)
    const expectedTime = this.calculateExpectedTime(card);
    const actualTime = reviewData.timeSpent || 0;
    const timeFactor = this.calculateTimeFactor(actualTime, expectedTime, settingsData.time_weight || 0.5);
    
    // Calculate error factor (based on previous errors on this card)
    const errorFactor = this.calculateErrorFactor(card, settingsData.error_weight || 1.5);
    
    // Calculate difficulty weight (personalized difficulty adjustment)
    const difficultyWeight = this.calculateDifficultyWeight(card, settingsData.difficulty_weight || 1.0);
    
    // Calculate retention target adjustment
    const retentionTarget = settingsData.retention_target || 0.9;
    const retentionFactor = this.calculateRetentionFactor(card, retentionTarget);
    
    // Calculate new ease factor
    let newEaseFactor = easeFactor;
    if (quality >= 3) {
      // Correct response
      newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      // Incorrect response
      newEaseFactor = easeFactor - 0.2;
    }
    
    // Apply adaptive factors
    newEaseFactor *= difficultyWeight;
    newEaseFactor *= retentionFactor;
    
    // Ensure ease factor is within bounds
    newEaseFactor = Math.max(1.3, Math.min(2.5, newEaseFactor));
    
    // Calculate new interval
    let newInterval;
    let newLearningStage;
    
    if (quality < 3) {
      // Incorrect response - reset to learning
      newInterval = 0;
      newLearningStage = 'learning';
    } else if (interval === 0) {
      // First correct response
      newInterval = 1;
      newLearningStage = 'learning';
    } else if (repetitions === 1) {
      // Second correct response
      newInterval = 6;
      newLearningStage = 'review';
    } else {
      // Subsequent correct responses
      newInterval = Math.round(interval * newEaseFactor);
      newLearningStage = 'review';
      
      // Apply interval modifier
      newInterval = Math.round(newInterval * (settings.interval_modifier / 100));
      
      // Apply time factor
      if (settingsData.adaptive_interval_scaling) {
        newInterval = Math.round(newInterval * timeFactor);
      }
      
      // Apply error factor
      newInterval = Math.round(newInterval / errorFactor);
    }
    
    // Ensure interval is within bounds
    newInterval = Math.min(settings.maximum_interval, Math.max(1, newInterval));
    
    // Calculate next review date
    const now = new Date();
    const nextReviewDate = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);
    
    // Return new state
    return {
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: quality >= 3 ? repetitions + 1 : 0,
      nextReviewDate: nextReviewDate.toISOString(),
      learningStage: newLearningStage,
      factors: {
        timeFactor,
        errorFactor,
        difficultyWeight,
        retentionFactor
      }
    };
  }
  
  /**
   * Calculate expected time to answer
   * @param {Object} card - Card data
   * @returns {number} Expected time in seconds
   * @private
   */
  calculateExpectedTime(card) {
    // Base expected time
    let expectedTime = 10; // 10 seconds base
    
    // Adjust based on card complexity (length of content)
    const frontLength = (card.content_front || '').length;
    const backLength = (card.content_back || '').length;
    const contentLength = frontLength + backLength;
    
    if (contentLength > 500) {
      expectedTime += 10; // Add 10 seconds for long content
    } else if (contentLength > 200) {
      expectedTime += 5; // Add 5 seconds for medium content
    }
    
    // Adjust based on card type
    if (card.content_type === 'image') {
      expectedTime += 5; // Images take longer to process
    } else if (card.content_type === 'math') {
      expectedTime += 15; // Math formulas take longer to process
    }
    
    // Adjust based on previous review times if available
    if (card.review_history && card.review_history.length > 0) {
      const lastReviews = card.review_history.slice(-3); // Last 3 reviews
      const avgTime = lastReviews.reduce((sum, review) => sum + (review.time_spent || 0), 0) / lastReviews.length;
      
      if (avgTime > 0) {
        // Blend historical average with base expectation
        expectedTime = (expectedTime + avgTime) / 2;
      }
    }
    
    return expectedTime;
  }
  
  /**
   * Calculate time factor
   * @param {number} actualTime - Actual time spent
   * @param {number} expectedTime - Expected time
   * @param {number} weight - Weight factor
   * @returns {number} Time factor
   * @private
   */
  calculateTimeFactor(actualTime, expectedTime, weight) {
    if (actualTime <= 0 || expectedTime <= 0) {
      return 1.0;
    }
    
    // Calculate ratio of actual to expected time
    const ratio = actualTime / expectedTime;
    
    // If actual time is much longer than expected, it indicates difficulty
    if (ratio > 2.0) {
      // Reduce interval (slower review pace)
      return Math.max(0.7, 1.0 - (ratio - 2.0) * 0.1 * weight);
    } 
    // If actual time is much shorter than expected, it indicates ease
    else if (ratio < 0.5) {
      // Increase interval (faster review pace)
      return Math.min(1.3, 1.0 + (0.5 - ratio) * 0.2 * weight);
    }
    
    // Otherwise, no significant adjustment
    return 1.0;
  }
  
  /**
   * Calculate error factor based on previous errors
   * @param {Object} card - Card data
   * @param {number} weight - Error weight
   * @returns {number} Error factor
   * @private
   */
  calculateErrorFactor(card, weight) {
    if (!card.review_history || card.review_history.length === 0) {
      return 1.0;
    }
    
    // Count recent errors (last 5 reviews)
    const recentReviews = card.review_history.slice(-5);
    const errorCount = recentReviews.filter(review => review.rating < 3).length;
    
    // Calculate error rate
    const errorRate = errorCount / recentReviews.length;
    
    // Apply error factor (higher error rate = shorter intervals)
    return 1.0 + (errorRate * weight);
  }
  
  /**
   * Calculate difficulty weight based on user performance
   * @param {Object} card - Card data
   * @param {number} weight - Difficulty weight
   * @returns {number} Difficulty weight
   * @private
   */
  calculateDifficultyWeight(card, weight) {
    // Default to neutral weight
    let difficultyWeight = 1.0;
    
    // If card has tags, check if user has difficulty with these tags
    if (card.tags && card.tags.length > 0) {
      // This would ideally use a user difficulty model per tag
      // For now, we'll use a simplified approach
      const difficultTags = this.settings.settings_data?.difficult_tags || [];
      
      const matchingTags = card.tags.filter(tag => difficultTags.includes(tag));
      if (matchingTags.length > 0) {
        // Reduce interval for difficult tags (more frequent review)
        difficultyWeight -= 0.1 * matchingTags.length * weight;
      }
    }
    
    // Ensure weight is within reasonable bounds
    return Math.max(0.7, Math.min(1.3, difficultyWeight));
  }
  
  /**
   * Calculate retention factor based on target retention
   * @param {Object} card - Card data
   * @param {number} target - Target retention rate
   * @returns {number} Retention factor
   * @private
   */
  calculateRetentionFactor(card, target) {
    if (!card.review_history || card.review_history.length < 5) {
      return 1.0;
    }
    
    // Calculate actual retention rate
    const totalReviews = card.review_history.length;
    const successfulReviews = card.review_history.filter(review => review.rating >= 3).length;
    const actualRetention = successfulReviews / totalReviews;
    
    // Calculate adjustment factor
    if (actualRetention < target) {
      // Retention too low, reduce intervals
      return 0.9;
    } else if (actualRetention > target + 0.1) {
      // Retention higher than needed, increase intervals
      return 1.1;
    }
    
    // Retention is on target
    return 1.0;
  }
  
  /**
   * Analyze user learning patterns
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Learning patterns analysis
   */
  async analyzeLearningPatterns(userId) {
    if (!this.initialized) {
      throw new Error('Adaptive Algorithm Service not initialized');
    }
    
    // Get user review history
    const { data: reviews, error } = await supabase
      .from('spaced_repetition_user_progress')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .limit(500);
    
    if (error) throw error;
    
    if (!reviews || reviews.length === 0) {
      return {
        difficultTags: [],
        optimalReviewTimes: [],
        retentionRate: 0,
        averageEaseFactor: 0,
        recommendedSettings: {}
      };
    }
    
    // Analyze difficult tags
    const tagPerformance = {};
    let totalCards = 0;
    let correctCards = 0;
    let totalEaseFactor = 0;
    
    // Process reviews
    reviews.forEach(review => {
      totalCards++;
      totalEaseFactor += review.ease_factor;
      
      if (review.learning_stage === 'review') {
        correctCards++;
      }
      
      // Process tags
      if (review.tags && review.tags.length > 0) {
        review.tags.forEach(tag => {
          if (!tagPerformance[tag]) {
            tagPerformance[tag] = { total: 0, correct: 0 };
          }
          
          tagPerformance[tag].total++;
          if (review.learning_stage === 'review') {
            tagPerformance[tag].correct++;
          }
        });
      }
    });
    
    // Calculate difficult tags
    const difficultTags = Object.entries(tagPerformance)
      .filter(([_, data]) => data.total >= 5) // Only consider tags with enough data
      .map(([tag, data]) => ({
        tag,
        correctRate: data.correct / data.total
      }))
      .sort((a, b) => a.correctRate - b.correctRate)
      .slice(0, 5)
      .map(item => item.tag);
    
    // Calculate overall retention rate
    const retentionRate = correctCards / totalCards;
    
    // Calculate average ease factor
    const averageEaseFactor = totalEaseFactor / totalCards;
    
    // Analyze optimal review times
    // This would require more sophisticated time-of-day analysis
    // For now, we'll return a placeholder
    const optimalReviewTimes = [
      { hour: 9, performance: 0.85 },
      { hour: 15, performance: 0.9 },
      { hour: 20, performance: 0.8 }
    ];
    
    // Generate recommended settings
    const recommendedSettings = {
      new_cards_per_day: Math.round(Math.min(30, Math.max(5, 20 * averageEaseFactor / 2.5))),
      interval_modifier: Math.round(Math.min(120, Math.max(80, 100 * (retentionRate / 0.9)))),
      settings_data: {
        difficult_tags: difficultTags,
        retention_target: Math.min(0.95, Math.max(0.8, retentionRate)),
        adaptive_interval_scaling: true
      }
    };
    
    return {
      difficultTags,
      optimalReviewTimes,
      retentionRate,
      averageEaseFactor,
      recommendedSettings
    };
  }
  
  /**
   * Apply learning pattern analysis to user settings
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Updated settings
   */
  async applyLearningPatternAnalysis(userId) {
    if (!this.initialized) {
      throw new Error('Adaptive Algorithm Service not initialized');
    }
    
    // Analyze learning patterns
    const analysis = await this.analyzeLearningPatterns(userId);
    
    // Update settings with recommendations
    const { data: updatedSettings, error } = await supabase
      .from('spaced_repetition_settings')
      .update({
        ...analysis.recommendedSettings,
        settings_data: {
          ...this.settings.settings_data,
          ...analysis.recommendedSettings.settings_data,
          last_analysis_date: new Date().toISOString()
        },
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    
    this.settings = updatedSettings;
    
    return {
      settings: updatedSettings,
      analysis
    };
  }
}

/**
 * Hook for using the Adaptive Algorithm Service
 * @returns {Object} Adaptive Algorithm Service methods
 */
export function useAdaptiveAlgorithm() {
  const service = AdaptiveAlgorithm.getInstance();
  
  return {
    initialize: service.initialize.bind(service),
    calculateNextInterval: service.calculateNextInterval.bind(service),
    analyzeLearningPatterns: service.analyzeLearningPatterns.bind(service),
    applyLearningPatternAnalysis: service.applyLearningPatternAnalysis.bind(service),
    updateSettings: service.updateSettings.bind(service),
    loadUserSettings: service.loadUserSettings.bind(service)
  };
}
