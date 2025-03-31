
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
    const { data, error } = await supabase
      .from('question_feedback')
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
    const { data, error } = await supabase
      .from('question_feedback')
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
    const { data, error } = await supabase
      .from('question_feedback')
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
