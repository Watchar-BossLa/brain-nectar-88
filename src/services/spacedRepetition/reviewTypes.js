
/**
 * Type definitions for the spaced repetition system
 * 
 * @fileoverview This file contains JSDoc type definitions to improve code quality
 */

/**
 * @typedef {Object} FlashcardReviewResult
 * @property {string} flashcardId - ID of the flashcard
 * @property {number} difficulty - Difficulty rating (1-5)
 * @property {string} [reviewedAt] - ISO timestamp of the review
 */

/**
 * @typedef {Object} FlashcardRetentionItem
 * @property {string} id - Flashcard ID
 * @property {number} retention - Current estimated retention (0-1)
 * @property {number} daysSinceReview - Days since last review
 * @property {string} topic_id - Topic ID
 * @property {string} front_content - Front content
 */

/**
 * @typedef {Object} FlashcardRetentionResult
 * @property {FlashcardRetentionItem[]} items - Individual flashcard retention data
 * @property {number} averageRetention - Average retention across all cards
 * @property {Object.<string, number>} retentionByTopic - Average retention by topic
 * @property {number} lowestRetention - Lowest retention value
 */

/**
 * @typedef {Object} FlashcardLearningStats
 * @property {number} totalCards - Total number of flashcards
 * @property {number} masteredCards - Cards with mastery level > 0.8
 * @property {number} dueCards - Cards due for review
 * @property {number} averageDifficulty - Average difficulty across all cards
 * @property {number} reviewsToday - Number of reviews today
 * @property {number} averageRetention - Average retention rate
 * @property {Object.<string, number>} masteryByTopic - Mastery levels by topic
 */
