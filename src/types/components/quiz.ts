
/**
 * Quiz component prop types
 */

export interface ActiveQuizCardProps {
  question: any;  // Changed from optional to required
  onAnswer?: (answerId: string) => void;
  currentQuestionIndex?: number;
  totalQuestions?: number;
  // Add missing props from AdaptiveQuizPlatform
  currentQuestion?: any;
  currentIndex?: number;
  availableQuestions?: any[];
  selectedAnswer?: string;
  setSelectedAnswer?: React.Dispatch<React.SetStateAction<string>>;
  handleAnswerSubmit?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  skipQuestion?: () => void;
}
