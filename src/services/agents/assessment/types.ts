
import { QuizQuestion } from '@/types/quiz';

export interface AssessmentGenerationOptions {
  previousPerformance?: any[];
  topics?: string[];
  difficulty?: number;
  questionCount?: number;
}

export interface AssessmentResult {
  questions: QuizQuestion[];
  metadata: {
    difficulty: number;
    topicsCovered: string[];
    generatedAt: string;
  };
}

export interface AssessmentResponse {
  status: 'success' | 'error';
  taskId: string;
  data?: {
    assessment: AssessmentResult;
  };
  message?: string;
}
