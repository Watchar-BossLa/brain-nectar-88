
// Define question types
export type QuizQuestion = {
  id: string;
  text: string;
  type: QuestionType;
  difficulty: 1 | 2 | 3; // 1: Easy, 2: Medium, 3: Hard
  options?: string[];
  correctAnswer?: string | string[];
  explanation: string;
  stepByStepExplanation?: string[];  // Array of steps for calculation problems
  topic: string;
  subject?: 'accounting' | 'finance' | 'mathematics'; // New field
  useLatex?: boolean;
};

export type QuestionType = 'multiple-choice' | 'calculation' | 'essay' | 'true-false';

export interface AnsweredQuestion {
  id: string;
  isCorrect: boolean;
  userAnswer: string;
  timeTaken: number;
}

export interface QuizResults {
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  performanceByTopic: Record<string, { correct: number; total: number }>;
  performanceByDifficulty: Record<string, { correct: number; total: number }>;
  timeSpent: number;
}
