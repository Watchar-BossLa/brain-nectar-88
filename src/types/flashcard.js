/**
 * Flashcard type definitions for the Study Bee application
 */

/**
 * @typedef {Object} FlashcardLearningStats
 * @property {number} totalCards - Total number of flashcards
 * @property {number} masteredCards - Number of mastered flashcards
 * @property {number} dueCards - Number of flashcards due for review
 * @property {number} reviewsToday - Number of reviews completed today
 * @property {number} averageRetention - Average retention rate
 * @property {number} streakDays - Number of consecutive days with reviews
 */

/**
 * @typedef {Object} Flashcard
 * @property {string} id - Unique identifier
 * @property {string} userId - User identifier
 * @property {string} topicId - Topic identifier
 * @property {string} frontContent - Content for the front of the card
 * @property {string} backContent - Content for the back of the card
 * @property {number} difficulty - Difficulty rating
 * @property {string} nextReviewDate - Date of next scheduled review
 * @property {number} repetitionCount - Number of times reviewed
 * @property {number} masteryLevel - Level of mastery
 * @property {string} createdAt - Creation timestamp
 * @property {string} updatedAt - Last update timestamp
 * @property {number} easinessFactor - Spaced repetition easiness factor
 * @property {number} lastRetention - Last retention score
 * @property {string} lastReviewedAt - Last review timestamp
 * 
 * @property {string} user_id - User identifier (snake_case alias)
 * @property {string} topic_id - Topic identifier (snake_case alias)
 * @property {string} [front] - Front content (legacy alias)
 * @property {string} [back] - Back content (legacy alias)
 * @property {string} front_content - Front content (snake_case alias)
 * @property {string} back_content - Back content (snake_case alias)
 * @property {string} next_review_date - Next review date (snake_case alias)
 * @property {number} repetition_count - Repetition count (snake_case alias)
 * @property {number} mastery_level - Mastery level (snake_case alias)
 * @property {string} created_at - Creation timestamp (snake_case alias)
 * @property {string} updated_at - Update timestamp (snake_case alias)
 * @property {number} easiness_factor - Easiness factor (snake_case alias)
 * @property {number} last_retention - Last retention (snake_case alias)
 * @property {string} last_reviewed_at - Last reviewed timestamp (snake_case alias)
 */

/**
 * Converts a flashcard from any format to a standardized format with both camelCase
 * and snake_case properties for compatibility
 * @param {Object} flashcard - The flashcard to normalize
 * @returns {Flashcard|null} - The normalized flashcard or null
 */
export function normalizeFlashcard(flashcard) {
  if (!flashcard) return null;

  const normalized = {
    // Primary fields in camelCase
    id: flashcard.id || '',
    userId: flashcard.userId || flashcard.user_id || '',
    topicId: flashcard.topicId || flashcard.topic_id || '',
    frontContent: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    backContent: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    difficulty: flashcard.difficulty || 2.5,
    nextReviewDate: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetitionCount: flashcard.repetitionCount || flashcard.repetition_count || 0,
    masteryLevel: flashcard.masteryLevel || flashcard.mastery_level || 0,
    createdAt: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updatedAt: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easinessFactor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    lastRetention: flashcard.lastRetention || flashcard.last_retention || 0,
    lastReviewedAt: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null,
    
    // Also provide snake_case for backward compatibility
    user_id: flashcard.userId || flashcard.user_id || '',
    topic_id: flashcard.topicId || flashcard.topic_id || '',
    front: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    back: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    front_content: flashcard.frontContent || flashcard.front_content || flashcard.front || '',
    back_content: flashcard.backContent || flashcard.back_content || flashcard.back || '',
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date || new Date().toISOString(),
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count || 0,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level || 0,
    created_at: flashcard.createdAt || flashcard.created_at || new Date().toISOString(),
    updated_at: flashcard.updatedAt || flashcard.updated_at || new Date().toISOString(),
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor || 2.5,
    last_retention: flashcard.lastRetention || flashcard.last_retention || 0,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at || null
  };

  return normalized;
}

/**
 * Converts a database flashcard to the application format
 * @param {Object} dbFlashcard - The database flashcard
 * @returns {Flashcard} - The normalized flashcard
 */
export function fromDatabaseFormat(dbFlashcard) {
  return normalizeFlashcard(dbFlashcard);
}

/**
 * Converts an application flashcard to the database format
 * @param {Partial<Flashcard>} flashcard - The flashcard to convert
 * @returns {Object} - The database format
 */
export function toDatabaseFormat(flashcard) {
  return {
    id: flashcard.id,
    user_id: flashcard.userId || flashcard.user_id,
    topic_id: flashcard.topicId || flashcard.topic_id,
    front_content: flashcard.frontContent || flashcard.front_content || flashcard.front,
    back_content: flashcard.backContent || flashcard.back_content || flashcard.back,
    difficulty: flashcard.difficulty,
    next_review_date: flashcard.nextReviewDate || flashcard.next_review_date,
    repetition_count: flashcard.repetitionCount || flashcard.repetition_count,
    mastery_level: flashcard.masteryLevel || flashcard.mastery_level,
    created_at: flashcard.createdAt || flashcard.created_at,
    updated_at: flashcard.updatedAt || flashcard.updated_at,
    easiness_factor: flashcard.easinessFactor || flashcard.easiness_factor,
    last_retention: flashcard.lastRetention || flashcard.last_retention,
    last_reviewed_at: flashcard.lastReviewedAt || flashcard.last_reviewed_at
  };
}
