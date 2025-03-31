
import { supabase } from '@/integrations/supabase/client';
import { QuestionFeedback } from '@/components/quiz/components/results/types';

// Create feedback for a question
export const createQuestionFeedback = async (feedback: Omit<QuestionFeedback, 'timestamp'>) => {
  try {
    const { data, error } = await supabase
      .from('question_feedback')
      .insert({
        ...feedback,
        timestamp: new Date().toISOString(),
        // Use timestamp instead of createdAt
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
