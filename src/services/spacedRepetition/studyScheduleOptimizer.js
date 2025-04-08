
/**
 * Study Schedule Optimizer for Spaced Repetition
 * Suggests optimal review times and batches reviews for maximum efficiency
 */
import { calculateFlashcardRetention } from './flashcardRetention';
import { getDueFlashcards } from './flashcardService';

/**
 * @typedef {Object} OptimalStudyTime
 * @property {string} time - The suggested time (e.g., "9:00 AM")
 * @property {number} retention - Expected retention percentage
 * @property {boolean} recommended - Whether this time is highly recommended
 * @property {string} priority - Priority level ("high", "medium", "low")
 */

/**
 * @typedef {Object} StudyBatch
 * @property {string} name - Name of the study batch
 * @property {number} duration - Estimated duration in minutes
 * @property {string} description - Description of the batch
 * @property {Array<string>} flashcardIds - IDs of flashcards in this batch
 * @property {number} count - Number of cards in the batch
 * @property {string} priority - Priority level
 */

/**
 * @typedef {Object} StudySchedule
 * @property {Array<OptimalStudyTime>} optimalTimes - Suggested study times
 * @property {Array<StudyBatch>} batches - Suggested study batches
 * @property {Object} insights - Additional study insights
 * @property {Array<string>} notifications - Recommended notification times
 */

/**
 * Generate optimal study schedule based on user's flashcards and preferences
 * 
 * @param {string} userId - User ID
 * @param {Object} [preferences] - User preferences
 * @param {Array<string>} [preferences.availableTimes] - Times user is typically available
 * @param {number} [preferences.maxSessionLength=30] - Maximum study session length in minutes
 * @param {number} [preferences.targetRetention=0.85] - Target retention rate (0-1)
 * @returns {Promise<StudySchedule>} Optimized study schedule
 */
export const generateOptimalStudySchedule = async (
  userId,
  preferences = {}
) => {
  try {
    // Default preferences
    const prefs = {
      availableTimes: ['morning', 'evening'],
      maxSessionLength: 30,
      targetRetention: 0.85,
      ...preferences
    };
    
    // Get due flashcards and retention data
    const { data: dueFlashcards, error: dueError } = await getDueFlashcards(userId);
    const retention = await calculateFlashcardRetention(userId);
    
    if (dueError) {
      console.error('Error fetching due flashcards:', dueError);
      return buildDefaultSchedule();
    }
    
    // Generate optimal times based on user's typical availability
    const optimalTimes = generateOptimalTimes(prefs.availableTimes);
    
    // Create study batches for different time constraints
    const batches = createStudyBatches(dueFlashcards || [], retention, prefs);
    
    // Generate notification recommendations
    const notifications = generateNotificationTimes(optimalTimes);
    
    // Generate study insights based on retention and due cards
    const insights = generateStudyInsights(dueFlashcards || [], retention);
    
    return {
      optimalTimes,
      batches,
      insights,
      notifications
    };
  } catch (error) {
    console.error('Error generating study schedule:', error);
    return buildDefaultSchedule();
  }
};

/**
 * Build a default schedule when data is unavailable
 * @returns {StudySchedule} Default schedule
 */
const buildDefaultSchedule = () => {
  return {
    optimalTimes: [
      { time: '9:00 AM', retention: 95, recommended: true, priority: 'high' },
      { time: '2:00 PM', retention: 90, recommended: false, priority: 'medium' },
      { time: '7:00 PM', retention: 85, recommended: false, priority: 'low' }
    ],
    batches: [
      {
        name: 'Quick Review',
        duration: 5,
        description: 'Quick 5-minute review of most urgent cards',
        flashcardIds: [],
        count: 0,
        priority: 'high'
      }
    ],
    insights: {
      idealInterval: 24,
      recommendedSessionsPerWeek: 5,
      focusTopics: []
    },
    notifications: ['9:00 AM', '7:00 PM']
  };
};

/**
 * Generate optimal study times based on user's availability
 * 
 * @param {Array<string>} availableTimes - When user is typically available
 * @returns {Array<OptimalStudyTime>} Optimal study times
 */
const generateOptimalTimes = (availableTimes) => {
  const times = [];
  const now = new Date();
  
  // Convert preference into actual times
  if (availableTimes.includes('morning')) {
    const morning = new Date();
    morning.setHours(9, 0, 0);
    times.push({
      time: '9:00 AM',
      retention: 95,
      recommended: true,
      priority: 'high'
    });
  }
  
  if (availableTimes.includes('afternoon')) {
    const afternoon = new Date();
    afternoon.setHours(14, 0, 0);
    times.push({
      time: '2:00 PM',
      retention: 90,
      recommended: morning > now, // Recommend if morning has passed
      priority: 'medium'
    });
  }
  
  if (availableTimes.includes('evening')) {
    const evening = new Date();
    evening.setHours(19, 0, 0);
    times.push({
      time: '7:00 PM',
      retention: 85,
      recommended: afternoon > now && morning > now, // Recommend if other times passed
      priority: 'low'
    });
  }
  
  // If no times match preferences or all times have passed
  if (times.length === 0 || times.every(t => !t.recommended)) {
    // Suggest tomorrow morning
    times.push({
      time: '9:00 AM (tomorrow)',
      retention: 95,
      recommended: true,
      priority: 'high'
    });
  }
  
  return times;
};

/**
 * Create study batches based on due cards and time constraints
 * 
 * @param {Array} dueFlashcards - Flashcards due for review
 * @param {Object} retention - Retention data
 * @param {Object} preferences - User preferences
 * @returns {Array<StudyBatch>} Study batches
 */
const createStudyBatches = (dueFlashcards, retention, preferences) => {
  // Calculate approximate time per card (in minutes)
  const timePerCard = 2;
  
  // Sort cards by urgency (combining due date and retention)
  const sortedCards = [...dueFlashcards].sort((a, b) => {
    // Find retention for these cards
    const retentionA = retention.items.find(item => item.id === a.id)?.retention || 0.5;
    const retentionB = retention.items.find(item => item.id === b.id)?.retention || 0.5;
    
    // Calculate urgency score (lower retention = more urgent)
    // Earlier due date = more urgent
    const urgencyA = (1 - retentionA) * 100 + (new Date(a.next_review_date)).getTime();
    const urgencyB = (1 - retentionB) * 100 + (new Date(b.next_review_date)).getTime();
    
    return urgencyA - urgencyB;
  });
  
  // Create batches
  const batches = [];
  
  // Quick batch (5 minutes)
  const quickBatchSize = Math.min(Math.floor(5 / timePerCard), sortedCards.length);
  if (quickBatchSize > 0) {
    batches.push({
      name: 'Quick Review',
      duration: quickBatchSize * timePerCard,
      description: `Quick ${quickBatchSize * timePerCard}-minute review of most urgent cards`,
      flashcardIds: sortedCards.slice(0, quickBatchSize).map(card => card.id),
      count: quickBatchSize,
      priority: 'high'
    });
  }
  
  // Standard batch (15 minutes)
  const standardBatchSize = Math.min(Math.floor(15 / timePerCard), sortedCards.length);
  if (standardBatchSize > 0) {
    batches.push({
      name: 'Standard Session',
      duration: standardBatchSize * timePerCard,
      description: `Review ${standardBatchSize} cards due today`,
      flashcardIds: sortedCards.slice(0, standardBatchSize).map(card => card.id),
      count: standardBatchSize,
      priority: 'medium'
    });
  }
  
  // Focus batch (based on user max session length)
  const focusBatchSize = Math.min(
    Math.floor(preferences.maxSessionLength / timePerCard), 
    sortedCards.length
  );
  if (focusBatchSize > 0 && focusBatchSize > standardBatchSize) {
    batches.push({
      name: 'Focus Session',
      duration: focusBatchSize * timePerCard,
      description: 'Deep dive on lowest retention topics',
      flashcardIds: sortedCards.slice(0, focusBatchSize).map(card => card.id),
      count: focusBatchSize,
      priority: 'low'
    });
  }
  
  return batches;
};

/**
 * Generate recommended notification times
 * 
 * @param {Array<OptimalStudyTime>} optimalTimes - Optimal study times
 * @returns {Array<string>} Notification times
 */
const generateNotificationTimes = (optimalTimes) => {
  // Return a list of recommended notification times
  return optimalTimes
    .filter(time => time.recommended)
    .map(time => time.time);
};

/**
 * Generate study insights based on retention and due cards
 * 
 * @param {Array} dueFlashcards - Flashcards due for review
 * @param {Object} retention - Retention data
 * @returns {Object} Study insights
 */
const generateStudyInsights = (dueFlashcards, retention) => {
  // Calculate ideal interval based on retention
  const idealInterval = retention.averageRetention > 0.8 ? 48 : 
    retention.averageRetention > 0.6 ? 24 : 12;
    
  // Calculate recommended sessions per week
  const recommendedSessionsPerWeek = dueFlashcards.length > 50 ? 7 : 
    dueFlashcards.length > 20 ? 5 : 3;
  
  // Identify focus topics (topics with lowest retention)
  const focusTopics = Object.entries(retention.retentionByTopic || {})
    .map(([topicId, retentionValue]) => ({
      topicId,
      retention: retentionValue
    }))
    .sort((a, b) => a.retention - b.retention)
    .slice(0, 3);
  
  return {
    idealInterval,
    recommendedSessionsPerWeek,
    focusTopics
  };
};

/**
 * Schedule notifications for optimal study times
 * 
 * @param {string} userId - User ID
 * @param {Array<string>} times - Times to schedule notifications
 * @returns {Promise<boolean>} Success status
 */
export const scheduleStudyNotifications = async (userId, times) => {
  // In a real implementation, this would connect to a notification system
  // For this example, we'll just log the scheduled times
  console.log(`Scheduled study notifications for user ${userId} at times:`, times);
  
  // Mock implementation - would connect to push notifications in a real app
  return true;
};
