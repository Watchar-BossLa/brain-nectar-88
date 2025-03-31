
import { supabase } from '@/integrations/supabase/client';

/**
 * Submit feedback for a quiz question
 */
export const submitQuestionFeedback = async (feedback: {
  questionId: string;
  userId: string;
  feedbackText: string;
  feedbackType: string;
  rating: number;
}) => {
  try {
    // Using upsert to avoid errors if table doesn't exist yet
    // In a production app, we'd create the table first
    const { data, error } = await supabase
      .from('quiz_feedback')
      .insert({
        question_id: feedback.questionId,
        user_id: feedback.userId,
        feedback_text: feedback.feedbackText,
        feedback_type: feedback.feedbackType,
        rating: feedback.rating,
        created_at: new Date().toISOString()
      });
      
    if (error) throw error;
    
    return { success: true, data };
  } catch (error) {
    console.error('Error submitting question feedback:', error);
    return { success: false, error };
  }
};

/**
 * Get all feedback for a user
 */
export const getUserFeedback = async (userId: string) => {
  try {
    // Using a safer approach by querying a table that should exist
    const { data, error } = await supabase
      .from('quiz_feedback')
      .select('*, questions(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching user feedback:', error);
    return [];
  }
};

/**
 * Get feedback for a specific question
 */
export const getQuestionFeedback = async (questionId: string) => {
  try {
    // Using a safer approach by querying a table that should exist
    const { data, error } = await supabase
      .from('quiz_feedback')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', { ascending: false });
      
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching question feedback:', error);
    return [];
  }
};

/**
 * Get aggregated feedback data for analytics
 */
export const getFeedbackData = async () => {
  try {
    const { data, error } = await supabase
      .from('quiz_feedback')
      .select('*');
      
    if (error) throw error;
    
    // Process the data for analytics
    const feedbackByType: Record<string, number> = {};
    const feedbackByRating: Record<number, number> = {};
    
    data?.forEach(item => {
      // Count by feedback type
      if (item.feedback_type) {
        feedbackByType[item.feedback_type] = (feedbackByType[item.feedback_type] || 0) + 1;
      }
      
      // Count by rating
      if (item.rating) {
        feedbackByRating[item.rating] = (feedbackByRating[item.rating] || 0) + 1;
      }
    });
    
    return {
      total: data?.length || 0,
      byType: feedbackByType,
      byRating: feedbackByRating,
      recentFeedback: data?.slice(0, 5) || []
    };
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    return {
      total: 0,
      byType: {},
      byRating: {},
      recentFeedback: []
    };
  }
};
