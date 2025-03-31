
import { supabase } from '@/integrations/supabase/client';
import { QuestionFeedback } from '@/components/quiz/components/results/types';

// Create feedback for a question
export const createQuestionFeedback = async (feedback: Omit<QuestionFeedback, 'timestamp'>) => {
  try {
    // Create a custom insert operation since question_feedback table might not exist in the schema
    const { data, error } = await supabase
      .from('question_feedback')
      .insert({
        questionId: feedback.questionId,
        feedback: feedback.feedback,
        rating: feedback.rating,
        timestamp: new Date().toISOString(),
        userId: feedback.userId || null,
        questionText: feedback.questionText || null,
        feedbackType: feedback.feedbackType || 'general',
        feedbackText: feedback.feedbackText || feedback.feedback
      })
      .select();
      
    return { data, error };
  } catch (err) {
    console.error('Error creating question feedback:', err);
    return { data: null, error: err };
  }
};

// Get feedback for questions
export const getQuestionFeedback = async (questionId?: string) => {
  try {
    // Handle query for question_feedback table
    let query = supabase
      .from('question_feedback')
      .select('*');
      
    if (questionId) {
      query = query.eq('questionId', questionId);
    }
    
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    console.error('Error fetching question feedback:', err);
    return { data: null, error: err };
  }
};
