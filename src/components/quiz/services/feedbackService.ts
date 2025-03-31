
import { QuestionFeedback } from '../components/results/types';

// In a real app, this would connect to an API or database
// For now, we'll use localStorage for demo purposes

const FEEDBACK_STORAGE_KEY = 'study-bee-question-feedback';

export const saveFeedback = (feedback: Omit<QuestionFeedback, 'createdAt'>) => {
  const feedbackWithDate: QuestionFeedback = {
    ...feedback,
    createdAt: new Date()
  };
  
  // Get existing feedback from localStorage
  const existingFeedback: QuestionFeedback[] = JSON.parse(
    localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]'
  );
  
  // Add new feedback
  const updatedFeedback = [...existingFeedback, feedbackWithDate];
  
  // Save to localStorage
  localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(updatedFeedback));
  
  return feedbackWithDate;
};

export const getFeedbackForQuestion = (questionId: string): QuestionFeedback[] => {
  const allFeedback: QuestionFeedback[] = JSON.parse(
    localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]'
  );
  
  return allFeedback.filter(feedback => feedback.questionId === questionId);
};

export const getAllFeedback = (): QuestionFeedback[] => {
  return JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
};
