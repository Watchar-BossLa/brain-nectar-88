
/**
 * Quiz component prop types
 */

export interface ActiveQuizCardProps {
  question?: any;
  onAnswer?: (answerId: string) => void;
  currentQuestionIndex?: number;
  totalQuestions?: number;
}
