
import { calculateRetention } from '@/services/spacedRepetition/algorithm';

/**
 * Calculate mastery level for topics based on user progress and flashcards
 * 
 * @param userProgress User progress data
 * @param topics List of topics
 * @returns Map of topic IDs to mastery percentages
 */
export const calculateTopicMastery = (userProgress: any[], topics: any[]) => {
  const topicMasteryMap: Record<string, number> = {};
  
  // Initialize all topics with 0 mastery
  topics.forEach(topic => {
    topicMasteryMap[topic.id] = 0;
  });
  
  // Calculate mastery based on user progress
  userProgress.forEach(progress => {
    const contentId = progress.content_id;
    const content = progress.content;
    
    if (!content || !content.topic_id) return;
    
    const topicId = content.topic_id;
    const progressPercentage = progress.progress_percentage || 0;
    
    // Only update if the progress is higher than current mastery
    if (progressPercentage > (topicMasteryMap[topicId] || 0)) {
      topicMasteryMap[topicId] = progressPercentage;
    }
  });
  
  return topicMasteryMap;
};

/**
 * Calculate mastery level for topics based on flashcard performance
 * 
 * @param flashcards User's flashcards
 * @param topics List of topics
 * @returns Map of topic IDs to mastery percentages
 */
export const calculateFlashcardMastery = (flashcards: any[], topics: any[]) => {
  const topicMasteryMap: Record<string, number> = {};
  const topicFlashcardCounts: Record<string, number> = {};
  
  // Initialize all topics with 0 mastery
  topics.forEach(topic => {
    topicMasteryMap[topic.id] = 0;
    topicFlashcardCounts[topic.id] = 0;
  });
  
  // Group flashcards by topic and calculate retention
  flashcards.forEach(flashcard => {
    if (!flashcard.topic_id) return;
    
    const topicId = flashcard.topic_id;
    if (!topicMasteryMap.hasOwnProperty(topicId)) return;
    
    // Calculate retention for this flashcard
    const now = new Date();
    const nextReviewDate = new Date(flashcard.next_review_date);
    const daysSinceReview = Math.max(0, (now.getTime() - nextReviewDate.getTime()) / (1000 * 60 * 60 * 24));
    const memoryStrength = flashcard.repetition_count * (flashcard.easiness_factor || 2.5);
    const retention = calculateRetention(daysSinceReview, memoryStrength);
    
    // Add to topic mastery
    topicMasteryMap[topicId] += retention * 100; // Convert to percentage
    topicFlashcardCounts[topicId]++;
  });
  
  // Calculate average mastery for each topic
  Object.keys(topicMasteryMap).forEach(topicId => {
    if (topicFlashcardCounts[topicId] > 0) {
      topicMasteryMap[topicId] = Math.round(topicMasteryMap[topicId] / topicFlashcardCounts[topicId]);
    }
  });
  
  return topicMasteryMap;
};

/**
 * Calculate combined mastery level based on content progress and flashcard performance
 * 
 * @param userProgress User progress data
 * @param flashcards User's flashcards
 * @param topics List of topics
 * @returns Map of topic IDs to mastery percentages
 */
export const calculateCombinedMastery = (userProgress: any[], flashcards: any[], topics: any[]) => {
  const progressMastery = calculateTopicMastery(userProgress, topics);
  const flashcardMastery = calculateFlashcardMastery(flashcards, topics);
  const combinedMastery: Record<string, number> = {};
  
  // Calculate weighted average of both mastery types
  topics.forEach(topic => {
    const topicId = topic.id;
    const progressWeight = 0.7; // 70% weight to content progress
    const flashcardWeight = 0.3; // 30% weight to flashcard mastery
    
    const hasProgress = progressMastery[topicId] > 0;
    const hasFlashcards = flashcardMastery[topicId] > 0;
    
    if (hasProgress && hasFlashcards) {
      // If we have both types of data, use weighted average
      combinedMastery[topicId] = Math.round(
        progressMastery[topicId] * progressWeight + 
        flashcardMastery[topicId] * flashcardWeight
      );
    } else if (hasProgress) {
      // If we only have progress data
      combinedMastery[topicId] = progressMastery[topicId];
    } else if (hasFlashcards) {
      // If we only have flashcard data
      combinedMastery[topicId] = flashcardMastery[topicId];
    } else {
      // If we have no data
      combinedMastery[topicId] = 0;
    }
  });
  
  return combinedMastery;
};
