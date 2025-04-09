/**
 * Adaptive Spaced Repetition Service
 * Implements an advanced algorithm for optimizing memory retention through
 * personalized review scheduling based on individual forgetting curves.
 */

import { supabase } from '@/integrations/supabase/client';
import { AdaptiveAlgorithm, useAdaptiveAlgorithm } from './AdaptiveAlgorithm';

/**
 * Spaced Repetition Service class
 */
export class SpacedRepetitionService {
  static instance;

  /**
   * Private constructor for singleton pattern
   */
  constructor() {
    this.initialized = false;
    this.activeReviewSessions = new Map();
    this.adaptiveAlgorithm = AdaptiveAlgorithm.getInstance();

    // Default parameters for the spaced repetition algorithm
    this.defaultParams = {
      initialEaseFactor: 2.5,
      minEaseFactor: 1.3,
      easeBonusFactor: 0.15,
      easePenaltyFactor: 0.2,
      intervalModifier: 1.0,
      useAdaptiveAlgorithm: true,  // Enable adaptive algorithm by default
      newCardsPerDay: 20,
      reviewCardsPerDay: 100,
      learnAheadTime: 20
    };
  }

  /**
   * Get the singleton instance
   * @returns {SpacedRepetitionService} The singleton instance
   */
  static getInstance() {
    if (!SpacedRepetitionService.instance) {
      SpacedRepetitionService.instance = new SpacedRepetitionService();
    }
    return SpacedRepetitionService.instance;
  }

  /**
   * Initialize the service
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} Success status
   */
  async initialize(userId) {
    try {
      console.log('Initializing Adaptive Spaced Repetition Service for user:', userId);

      // Load user's learning parameters if they exist
      const userParams = await this.getUserLearningParameters(userId);

      if (userParams) {
        this.userParams = userParams;
      } else {
        // Create default parameters for new user
        this.userParams = { ...this.defaultParams };
        await this.saveUserLearningParameters(userId, this.userParams);
      }

      // Initialize adaptive algorithm
      await this.adaptiveAlgorithm.initialize(userId);

      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Spaced Repetition Service:', error);
      return false;
    }
  }

  /**
   * Get user's learning parameters
   * @param {string} userId - User ID
   * @returns {Promise<Object|null>} User's learning parameters or null if not found
   * @private
   */
  async getUserLearningParameters(userId) {
    const { data, error } = await supabase
      .from('learning_parameters')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found
        return null;
      }
      throw error;
    }

    return data?.parameters || null;
  }

  /**
   * Save user's learning parameters
   * @param {string} userId - User ID
   * @param {Object} parameters - Learning parameters
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async saveUserLearningParameters(userId, parameters) {
    const { data, error } = await supabase
      .from('learning_parameters')
      .upsert({
        user_id: userId,
        parameters,
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) {
      console.error('Error saving learning parameters:', error);
      return false;
    }

    return true;
  }

  /**
   * Calculate next review date using the adaptive spaced repetition algorithm
   * @param {Object} item - Study item
   * @param {number} rating - Performance rating (0-5)
   * @param {Object} [params] - Algorithm parameters (uses user's parameters if not provided)
   * @param {Object} [reviewData] - Additional data about the review session
   * @returns {Object} Updated item with next review date and learning data
   */
  calculateNextReview(item, rating, params = null, reviewData = {}) {
    // Use provided params or fall back to user params
    const p = params || this.userParams;

    // Initialize learning data if it doesn't exist
    if (!item.learning_data) {
      item.learning_data = {
        repetitions: 0,
        easeFactor: p.initialEaseFactor,
        interval: 0,
        lastReview: new Date().toISOString(),
        nextReview: new Date().toISOString(),
        history: [],
        learningStage: 'new'
      };
    }

    const learningData = item.learning_data;

    // Record this review in history
    const reviewRecord = {
      date: new Date().toISOString(),
      rating,
      interval: learningData.interval,
      timeSpent: reviewData.timeSpent || 0
    };

    learningData.history.push(reviewRecord);

    // Check if we should use the adaptive algorithm
    if (this.adaptiveAlgorithm.initialized && p.useAdaptiveAlgorithm) {
      // Prepare card data for adaptive algorithm
      const cardData = {
        ease_factor: learningData.easeFactor,
        interval: learningData.interval,
        repetitions: learningData.repetitions,
        review_history: learningData.history,
        content_front: item.content || '',
        content_back: item.answer || '',
        content_type: item.content_type || 'text',
        tags: item.tags || [],
        learning_stage: learningData.learningStage || 'new'
      };

      // Calculate next interval using adaptive algorithm
      const result = this.adaptiveAlgorithm.calculateNextInterval(cardData, rating, reviewData);

      // Update learning data with adaptive algorithm results
      learningData.easeFactor = result.easeFactor;
      learningData.interval = result.interval;
      learningData.repetitions = result.repetitions;
      learningData.learningStage = result.learningStage;

      // Calculate next review date
      const now = new Date();
      const nextReview = new Date(result.nextReviewDate);

      // Update review dates
      learningData.lastReview = now.toISOString();
      learningData.nextReview = nextReview.toISOString();

      // Store adaptive factors in history for analysis
      reviewRecord.adaptiveFactors = result.factors;
    } else {
      // Fallback to standard SM-2 algorithm
      // Update learning data based on performance
      if (rating < 3) {
        // If rating is less than 3, reset repetitions but keep ease factor
        learningData.repetitions = 0;
        // Decrease ease factor but ensure it doesn't go below minimum
        learningData.easeFactor = Math.max(
          p.minEaseFactor,
          learningData.easeFactor - p.easePenaltyFactor
        );
        // Set interval to 1 day
        learningData.interval = 1;
        // Update learning stage
        learningData.learningStage = 'learning';
      } else {
        // Increase repetitions
        learningData.repetitions += 1;

        // Adjust ease factor based on performance
        learningData.easeFactor = Math.max(
          p.minEaseFactor,
          learningData.easeFactor + (p.easeBonusFactor * (rating - 3))
        );

        // Calculate next interval
        if (learningData.repetitions === 1) {
          learningData.interval = 1;
          learningData.learningStage = 'learning';
        } else if (learningData.repetitions === 2) {
          learningData.interval = 6;
          learningData.learningStage = 'review';
        } else {
          // For repetitions > 2, use the formula: interval = previous interval * ease factor
          learningData.interval = Math.round(learningData.interval * learningData.easeFactor);
          learningData.learningStage = 'review';
        }
      }

      // Apply interval modifier
      learningData.interval = Math.round(learningData.interval * p.intervalModifier);

      // Ensure minimum interval of 1 day
      learningData.interval = Math.max(1, learningData.interval);

      // Calculate next review date
      const now = new Date();
      const nextReview = new Date(now);
      nextReview.setDate(now.getDate() + learningData.interval);
    }

    // Update review dates
    learningData.lastReview = now.toISOString();
    learningData.nextReview = nextReview.toISOString();

    // Update the item with new learning data
    item.learning_data = learningData;
    item.next_review_date = learningData.nextReview;

    return item;
  }

  /**
   * Get due items for review
   * @param {string} userId - User ID
   * @param {Object} [options] - Options for filtering items
   * @param {number} [options.limit=20] - Maximum number of items to return
   * @param {string} [options.source] - Filter by source (e.g., 'flashcards', 'documents')
   * @param {Array<string>} [options.tags] - Filter by tags
   * @returns {Promise<Array>} Items due for review
   */
  async getDueItems(userId, options = {}) {
    const { limit = 20, source, tags } = options;

    // Get current date
    const now = new Date().toISOString();

    // Build query
    let query = supabase
      .from('study_items')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review_date', now)
      .order('next_review_date');

    // Apply source filter if provided
    if (source) {
      query = query.eq('source', source);
    }

    // Apply tags filter if provided
    if (tags && tags.length > 0) {
      // Filter items that have at least one of the specified tags
      query = query.contains('tags', tags);
    }

    // Apply limit
    query = query.limit(limit);

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error getting due items:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Get review statistics for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Review statistics
   */
  async getReviewStats(userId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    try {
      // Get today's date
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Get start of week
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const startOfWeekStr = startOfWeek.toISOString();

      // Get today's reviews
      const { data: todayReviews, error: todayError } = await supabase
        .from('item_reviews')
        .select('id')
        .eq('user_id', userId)
        .gte('review_time', `${todayStr}T00:00:00`)
        .lte('review_time', `${todayStr}T23:59:59`);

      if (todayError) throw todayError;

      // Get this week's reviews
      const { data: weekReviews, error: weekError } = await supabase
        .from('item_reviews')
        .select('id')
        .eq('user_id', userId)
        .gte('review_time', startOfWeekStr);

      if (weekError) throw weekError;

      // Get total reviews
      const { data: totalReviews, error: totalError } = await supabase
        .from('item_reviews')
        .select('id')
        .eq('user_id', userId);

      if (totalError) throw totalError;

      return {
        today: todayReviews?.length || 0,
        thisWeek: weekReviews?.length || 0,
        total: totalReviews?.length || 0
      };
    } catch (error) {
      console.error('Error getting review stats:', error);
      return {
        today: 0,
        thisWeek: 0,
        total: 0
      };
    }
  }

  /**
   * Get items that will be due in the next few days
   * @param {string} userId - User ID
   * @param {number} [days=7] - Number of days to look ahead
   * @param {Object} [options] - Additional options
   * @returns {Promise<Array>} Upcoming items
   */
  async getUpcomingItems(userId, days = 7, options = {}) {
    // Calculate date range
    const now = new Date();
    const future = new Date(now);
    future.setDate(now.getDate() + days);

    // Build query
    let query = supabase
      .from('study_items')
      .select('*')
      .eq('user_id', userId)
      .gt('next_review_date', now.toISOString())
      .lte('next_review_date', future.toISOString())
      .order('next_review_date');

    // Apply source filter if provided
    if (options.source) {
      query = query.eq('source', options.source);
    }

    // Apply tags filter if provided
    if (options.tags && options.tags.length > 0) {
      query = query.contains('tags', options.tags);
    }

    // Execute query
    const { data, error } = await query;

    if (error) {
      console.error('Error getting upcoming items:', error);
      return [];
    }

    return data || [];
  }

  /**
   * Start a review session
   * @param {string} userId - User ID
   * @param {Object} [options] - Session options
   * @returns {Promise<Object>} Session information
   */
  async startReviewSession(userId, options = {}) {
    if (!this.initialized) {
      await this.initialize(userId);
    }

    // Get due items
    const dueItems = await this.getDueItems(userId, options);

    if (dueItems.length === 0) {
      return {
        sessionId: null,
        message: 'No items due for review',
        itemCount: 0
      };
    }

    // Create session ID
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    // Create session
    const session = {
      id: sessionId,
      userId,
      items: dueItems,
      currentIndex: 0,
      startTime: new Date(),
      itemStartTime: new Date().toISOString(), // Track when first item is shown
      completedItems: [],
      options
    };

    // Store session
    this.activeReviewSessions.set(sessionId, session);

    // Create session record in database
    await supabase
      .from('review_sessions')
      .insert({
        id: sessionId,
        user_id: userId,
        item_count: dueItems.length,
        start_time: session.startTime.toISOString(),
        options,
        status: 'in_progress'
      });

    return {
      sessionId,
      itemCount: dueItems.length,
      firstItem: dueItems[0]
    };
  }

  /**
   * Get the current item in a review session
   * @param {string} sessionId - Session ID
   * @returns {Object|null} Current item or null if session not found
   */
  getCurrentItem(sessionId) {
    const session = this.activeReviewSessions.get(sessionId);

    if (!session) {
      return null;
    }

    return session.items[session.currentIndex];
  }

  /**
   * Submit a review for the current item
   * @param {string} sessionId - Session ID
   * @param {number} rating - Performance rating (0-5)
   * @param {Object} [reviewData={}] - Additional review data
   * @returns {Promise<Object>} Next item or session summary if complete
   */
  async submitReview(sessionId, rating, reviewData = {}) {
    const session = this.activeReviewSessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Get current item
    const currentItem = session.items[session.currentIndex];

    // Calculate time spent on this item
    const timeSpent = reviewData.timeSpent || (session.itemStartTime ?
      (new Date().getTime() - new Date(session.itemStartTime).getTime()) / 1000 : 0);

    // Calculate next review date
    const updatedItem = this.calculateNextReview(currentItem, rating, null, {
      timeSpent,
      ...reviewData
    });

    // Update item in database
    await supabase
      .from('study_items')
      .update({
        learning_data: updatedItem.learning_data,
        next_review_date: updatedItem.next_review_date,
        last_review_date: updatedItem.learning_data.lastReview
      })
      .eq('id', updatedItem.id);

    // Record review in database
    await supabase
      .from('item_reviews')
      .insert({
        session_id: sessionId,
        item_id: updatedItem.id,
        user_id: session.userId,
        rating,
        time_spent: timeSpent,
        review_time: new Date().toISOString(),
        review_data: reviewData
      });

    // Add to completed items
    session.completedItems.push({
      item: updatedItem,
      rating,
      timeSpent,
      reviewTime: new Date().toISOString(),
      reviewData
    });

    // Move to next item
    session.currentIndex += 1;

    // Check if session is complete
    if (session.currentIndex >= session.items.length) {
      // Session complete
      return await this.completeSession(sessionId);
    }

    // Track when this item is shown
    session.itemStartTime = new Date().toISOString();

    // Update session
    this.activeReviewSessions.set(sessionId, session);

    // Return next item
    return {
      complete: false,
      nextItem: session.items[session.currentIndex],
      progress: {
        current: session.currentIndex + 1,
        total: session.items.length
      }
    };
  }

  /**
   * Complete a review session
   * @param {string} sessionId - Session ID
   * @returns {Promise<Object>} Session summary
   * @private
   */
  async completeSession(sessionId) {
    const session = this.activeReviewSessions.get(sessionId);

    if (!session) {
      throw new Error(`Session not found: ${sessionId}`);
    }

    // Calculate session duration
    const endTime = new Date();
    const duration = (endTime - session.startTime) / 1000; // in seconds

    // Calculate performance metrics
    const ratings = session.completedItems.map(item => item.rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    const perfectCount = ratings.filter(rating => rating === 5).length;

    // Create session summary
    const summary = {
      sessionId,
      itemCount: session.items.length,
      duration,
      averageRating,
      perfectCount,
      completionRate: session.completedItems.length / session.items.length
    };

    // Update session record in database
    await supabase
      .from('review_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration,
        metrics: {
          averageRating,
          perfectCount,
          completionRate: summary.completionRate
        },
        status: 'completed'
      })
      .eq('id', sessionId);

    // Remove session from active sessions
    this.activeReviewSessions.delete(sessionId);

    // Update user's learning parameters based on performance
    await this.updateLearningParameters(session.userId, summary);

    return {
      complete: true,
      summary
    };
  }

  /**
   * Update user's learning parameters based on performance
   * @param {string} userId - User ID
   * @param {Object} sessionSummary - Session summary
   * @returns {Promise<boolean>} Success status
   * @private
   */
  async updateLearningParameters(userId, sessionSummary) {
    // Get current parameters
    const params = await this.getUserLearningParameters(userId);

    if (!params) {
      return false;
    }

    // Adjust interval modifier based on performance
    // If average rating is high, we can increase the interval modifier
    // If average rating is low, we should decrease the interval modifier
    if (sessionSummary.averageRating > 4.5) {
      // Excellent performance, increase intervals
      params.intervalModifier = Math.min(1.5, params.intervalModifier * 1.05);
    } else if (sessionSummary.averageRating < 3) {
      // Poor performance, decrease intervals
      params.intervalModifier = Math.max(0.5, params.intervalModifier * 0.95);
    }

    // Save updated parameters
    await this.saveUserLearningParameters(userId, params);

    return true;
  }

  /**
   * Get user's learning statistics
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Learning statistics
   */
  async getLearningStats(userId) {
    // Get total item count
    const { count: totalItems, error: countError } = await supabase
      .from('study_items')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (countError) {
      console.error('Error getting item count:', countError);
      return null;
    }

    // Get items due today
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);

    const { data: dueToday, error: dueError } = await supabase
      .from('study_items')
      .select('id')
      .eq('user_id', userId)
      .gte('next_review_date', now.toISOString())
      .lt('next_review_date', tomorrow.toISOString());

    if (dueError) {
      console.error('Error getting due items:', dueError);
      return null;
    }

    // Get recent sessions
    const { data: recentSessions, error: sessionsError } = await supabase
      .from('review_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('end_time', { ascending: false })
      .limit(10);

    if (sessionsError) {
      console.error('Error getting recent sessions:', sessionsError);
      return null;
    }

    // Calculate retention score (percentage of items with rating >= 4)
    const { data: reviews, error: reviewsError } = await supabase
      .from('item_reviews')
      .select('rating')
      .eq('user_id', userId)
      .gte('review_time', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    if (reviewsError) {
      console.error('Error getting reviews:', reviewsError);
      return null;
    }

    const goodReviews = reviews?.filter(review => review.rating >= 4).length || 0;
    const retentionScore = reviews?.length > 0 ? (goodReviews / reviews.length) * 100 : 0;

    // Calculate streak
    const streak = await this.calculateStudyStreak(userId);

    return {
      totalItems: totalItems || 0,
      dueToday: dueToday?.length || 0,
      retentionScore,
      streak,
      recentSessions: recentSessions || []
    };
  }

  /**
   * Calculate user's study streak
   * @param {string} userId - User ID
   * @returns {Promise<number>} Current streak
   * @private
   */
  async calculateStudyStreak(userId) {
    // Get all completed sessions ordered by end time
    const { data: sessions, error } = await supabase
      .from('review_sessions')
      .select('end_time')
      .eq('user_id', userId)
      .eq('status', 'completed')
      .order('end_time', { ascending: false });

    if (error || !sessions || sessions.length === 0) {
      return 0;
    }

    // Check if user studied today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const latestSession = new Date(sessions[0].end_time);
    const latestDay = new Date(latestSession);
    latestDay.setHours(0, 0, 0, 0);

    // If latest session is before today, streak is 0
    if (latestDay < today) {
      return 0;
    }

    // Calculate streak by checking consecutive days
    let streak = 1; // Start with 1 for today
    let currentDay = new Date(today);
    currentDay.setDate(currentDay.getDate() - 1); // Start checking from yesterday

    // Group sessions by day
    const sessionsByDay = new Map();

    for (const session of sessions) {
      const sessionDate = new Date(session.end_time);
      const dayKey = `${sessionDate.getFullYear()}-${sessionDate.getMonth()}-${sessionDate.getDate()}`;

      if (!sessionsByDay.has(dayKey)) {
        sessionsByDay.set(dayKey, true);
      }
    }

    // Check consecutive days
    while (true) {
      const dayKey = `${currentDay.getFullYear()}-${currentDay.getMonth()}-${currentDay.getDate()}`;

      if (sessionsByDay.has(dayKey)) {
        streak++;
        currentDay.setDate(currentDay.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}

/**
 * Hook for using the Spaced Repetition Service
 * @returns {Object} Spaced Repetition Service methods
 */
export function useSpacedRepetition() {
  const service = SpacedRepetitionService.getInstance();

  return {
    initialize: service.initialize.bind(service),
    getDueItems: service.getDueItems.bind(service),
    getUpcomingItems: service.getUpcomingItems.bind(service),
    startReviewSession: service.startReviewSession.bind(service),
    getCurrentItem: service.getCurrentItem.bind(service),
    submitReview: service.submitReview.bind(service),
    getLearningStats: service.getLearningStats.bind(service)
  };
}
