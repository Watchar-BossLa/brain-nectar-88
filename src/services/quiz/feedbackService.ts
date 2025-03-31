
import { supabase } from '@/integrations/supabase/client';

// In-memory feedback storage since table doesn't exist
const inMemoryFeedback: any[] = [];

interface QuizFeedback {
  userId: string;
  questionId: string;
  rating: number;
  feedback?: string;
  feedbackType: 'difficulty' | 'clarity' | 'relevance' | 'general';
  createdAt?: string;
}

/**
 * Submit feedback for a quiz question
 */
export const submitQuizFeedback = async (
  userId: string,
  questionId: string,
  rating: number,
  feedbackText?: string,
  feedbackType: 'difficulty' | 'clarity' | 'relevance' | 'general' = 'general'
): Promise<boolean> => {
  try {
    console.log(`Submitting feedback for question ${questionId}`);
    
    // Store in memory instead of database
    const feedbackItem = {
      id: Date.now().toString(),
      userId,
      questionId,
      rating,
      feedback: feedbackText,
      feedbackType,
      createdAt: new Date().toISOString()
    };
    
    inMemoryFeedback.push(feedbackItem);
    
    return true;
  } catch (error) {
    console.error('Error submitting quiz feedback:', error);
    return false;
  }
};

/**
 * Get feedback for a specific question
 */
export const getQuestionFeedback = async (questionId: string): Promise<any[]> => {
  try {
    // Return from in-memory storage
    return inMemoryFeedback.filter(item => item.questionId === questionId);
  } catch (error) {
    console.error('Error fetching question feedback:', error);
    return [];
  }
};

/**
 * Get all feedback submitted by a user
 */
export const getUserFeedback = async (userId: string): Promise<any[]> => {
  try {
    // Return from in-memory storage
    return inMemoryFeedback.filter(item => item.userId === userId);
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    return [];
  }
};

/**
 * Get feedback statistics
 */
export const getFeedbackStats = async (questionIds?: string[]): Promise<any> => {
  try {
    // Filter feedback if question IDs are provided
    const relevantFeedback = questionIds 
      ? inMemoryFeedback.filter(item => questionIds.includes(item.questionId))
      : inMemoryFeedback;
    
    // Calculate statistics
    const totalFeedbackCount = relevantFeedback.length;
    
    // Group by type
    const feedbackByType = {
      difficulty: relevantFeedback.filter(item => item.feedbackType === 'difficulty'),
      clarity: relevantFeedback.filter(item => item.feedbackType === 'clarity'),
      relevance: relevantFeedback.filter(item => item.feedbackType === 'relevance'),
      general: relevantFeedback.filter(item => item.feedbackType === 'general')
    };
    
    // Calculate average ratings by type
    const averageRatings = {
      difficulty: calculateAverageRating(feedbackByType.difficulty),
      clarity: calculateAverageRating(feedbackByType.clarity),
      relevance: calculateAverageRating(feedbackByType.relevance),
      general: calculateAverageRating(feedbackByType.general)
    };
    
    return {
      totalFeedbackCount,
      averageRatings,
      feedbackByType
    };
  } catch (error) {
    console.error('Error fetching feedback stats:', error);
    return {
      totalFeedbackCount: 0,
      averageRatings: {
        difficulty: 0,
        clarity: 0,
        relevance: 0,
        general: 0
      },
      feedbackByType: {
        difficulty: [],
        clarity: [],
        relevance: [],
        general: []
      }
    };
  }
};

// Helper function to calculate average rating
const calculateAverageRating = (feedbackItems: any[]): number => {
  if (feedbackItems.length === 0) return 0;
  
  const total = feedbackItems.reduce((sum, item) => sum + item.rating, 0);
  return total / feedbackItems.length;
};
