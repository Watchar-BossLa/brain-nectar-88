
import { supabase } from '@/integrations/supabase/client';
import { QuestionFeedback } from '../components/results/types';

export const submitQuestionFeedback = async (feedback: QuestionFeedback) => {
  try {
    // This is a mock implementation - in a real app, you would need to create this table
    console.log('Submitting feedback:', feedback);
    
    // Return success mock as we can't use question_feedback table yet
    return { success: true, data: { id: 'mock-id', ...feedback } };
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return { success: false, error };
  }
};

export const getFeedbackData = async (): Promise<QuestionFeedback[]> => {
  try {
    // This is a mock implementation - in a real app, would fetch from the database
    // Simulating feedback data
    const mockFeedbackData: QuestionFeedback[] = [
      {
        questionId: '1',
        feedback: 'This question was very clear.',
        rating: 5,
        timestamp: new Date().toISOString(),
        feedbackType: 'praise',
        feedbackText: 'Very clear question',
        createdAt: new Date().toISOString()
      },
      {
        questionId: '2',
        feedback: 'The wording was confusing.',
        rating: 3,
        timestamp: new Date().toISOString(),
        feedbackType: 'issue',
        feedbackText: 'Confusing wording',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        questionId: '3',
        feedback: 'Consider adding an example.',
        rating: 4,
        timestamp: new Date().toISOString(),
        feedbackType: 'suggestion',
        feedbackText: 'Add an example',
        createdAt: new Date(Date.now() - 172800000).toISOString()
      }
    ];
    
    return mockFeedbackData;
  } catch (error) {
    console.error("Error getting feedback data:", error);
    return [];
  }
};
