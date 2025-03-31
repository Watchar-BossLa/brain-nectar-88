// Define advanced question types
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
  subject?: 'accounting' | 'finance' | 'mathematics' | 'economics';
  useLatex?: boolean;
  image?: string;
  relatedConcepts?: string[];
  tags?: string[];
  pointsValue?: number;
  timeLimit?: number; // Time limit in seconds
  createdAt?: string;
  updatedAt?: string;
};

export type QuestionType = 
  | 'multiple-choice' 
  | 'calculation' 
  | 'essay' 
  | 'true-false'
  | 'matching'
  | 'fill-in-blank'
  | 'drag-drop'
  | 'hotspot'
  | 'numerical';

export interface AnsweredQuestion {
  id: string;
  isCorrect: boolean;
  userAnswer: string;
  timeTaken: number;
  confidenceLevel?: number; // Added this property
  topic?: string; // Added this property
  difficulty?: number;
}

export interface QuizResults {
  questionsAttempted: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedQuestions: number;
  performanceByTopic: Record<string, { correct: number; total: number }>;
  performanceByDifficulty: Record<string, { correct: number; total: number }>;
  timeSpent: number;
  averageConfidence?: number;
  confidenceAccuracy?: number; // Correlation between confidence and correctness
  recommendedTopics?: string[]; // Topics that need more work
  masteryLevel?: number; // Overall mastery level (0-1)
  score?: number; // Add the score property to match usage in quizSessionService.ts
}

// Quiz settings types
export interface QuizSettings {
  difficultyMode: 'fixed' | 'adaptive' | 'progressive';
  initialDifficulty: 1 | 2 | 3;
  topicSelection: string[];
  questionCount: number;
  timeLimit?: number; // Total time limit in minutes
  showExplanations: boolean;
  showConfidenceRating: boolean;
  randomizeQuestions: boolean;
}

// Quiz session types
export interface QuizSession {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  questions: string[]; // Array of question IDs
  settings: QuizSettings;
  results?: QuizResults;
  completed: boolean;
}
