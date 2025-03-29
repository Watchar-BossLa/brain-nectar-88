
import { QuizQuestion } from '@/types/quiz';
import { AssessmentGenerationOptions } from './types';

export class QuestionAdapter {
  static adaptQuestionsToUser(options: AssessmentGenerationOptions): QuizQuestion[] {
    const { previousPerformance = [], topics = [], difficulty = 2, questionCount = 10 } = options;
    
    // Import questions from our question bank
    const { quizQuestions } = require('@/components/quiz/data/quizQuestions');
    
    // Filter questions by topic if specified
    let availableQuestions = topics.length > 0
      ? quizQuestions.filter(q => topics.includes(q.topic))
      : quizQuestions;

    // Sort by difficulty match and topics
    availableQuestions.sort((a, b) => {
      return Math.abs(a.difficulty - difficulty) - Math.abs(b.difficulty - difficulty);
    });

    // Select the specified number of questions
    return availableQuestions.slice(0, questionCount);
  }
}
