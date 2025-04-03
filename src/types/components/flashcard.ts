
import { Flashcard } from '../flashcard';
import { FlashcardLearningStats } from '../flashcard';

/**
 * Flashcard component prop types
 */

export interface FlashcardListHeaderProps {
  onAddNew: () => void;
}

export interface EmptyFlashcardStateProps {
  onAddNew: () => void;
}

export interface FlashcardGridProps {
  flashcards: Flashcard[];
  onDelete?: (id: string) => void;
  onCardUpdated?: () => void;
}

export interface FlashcardsHeaderProps {
  isCreating: boolean;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

export interface FlashcardsEmptyStateProps {
  title: string;
  description: string;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

export interface DeleteFlashcardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export interface FlashcardStatsProps {
  stats: {
    totalCards: number;
    masteredCards: number;
    dueCards: number;
    reviewsToday: number;
    averageDifficulty: number;
  };
}

export interface FlashcardPreviewProps {
  frontContent: string;
  backContent: string;
  useLatex?: boolean;
}

// Flashcard component props
export interface DifficultyRatingButtonsProps {
  onRate: (rating: number) => void;
  selectedRating: number | null;
  isSubmitting?: boolean;
}

export interface FlashcardContentProps {
  content: string;
  isAnswer?: boolean;
  onClick?: () => void;
  isFlipped?: boolean;
}

export interface MemoryRetentionIndicatorProps {
  retention: number;
  repetitionCount: number;
}

export interface ContentTypeSelectorProps {
  contentType: 'text' | 'formula' | 'financial';
  setContentType: (type: 'text' | 'formula' | 'financial') => void;
  setUseLatex: (value: boolean) => void;
}

export interface FinancialContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
  financialType: string;
  setFinancialType: (value: string) => void;
}

export interface FormButtonsProps {
  isSubmitting: boolean;
  onCancel: () => void;
  frontContent: string;
  backContent: string;
}

export interface FormulaContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
}

export interface TextContentInputProps {
  frontContent: string;
  setFrontContent: (value: string) => void;
  backContent: string;
  setBackContent: (value: string) => void;
}

// Flashcard review props
export interface EmptyReviewStateProps {
  onRefresh?: () => void;
}

export interface FlashcardViewProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onRating?: (rating: number) => void;
}

export interface LoadingSkeletonProps {
  message?: string;
}

export interface RatingButtonsProps {
  isFlipped: boolean;
  onRating: (rating: number) => void;
  onSkip?: () => void;
  onRevealAnswer: () => void;
}

export interface ReviewHeaderProps {
  reviewsCompleted: number;
  totalToReview: number;
}

export interface ReviewCardProps {
  flashcard?: Flashcard;
  currentCard?: Flashcard;
  isFlipped: boolean;
  onFlip: () => void;
  onRate?: (rating: number) => void;
}

export interface ReviewCompleteProps {
  stats?: {
    easy: number;
    medium: number;
    hard: number;
    averageRating: number;
    totalReviewed: number;
  };
  onComplete?: () => void;
}

export interface ReviewLoadingProps {
  message?: string;
}

export interface ReviewProgressProps {
  currentIndex: number;
  totalCards: number;
}

// Flashcard tab props
export interface AllFlashcardsTabProps {
  isLoading: boolean;
  flashcards: Flashcard[];
  onDeleteFlashcard: (id: string) => void;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}

export interface CreateFlashcardTabProps {
  isAdvancedForm: boolean;
  onFlashcardCreated: () => void;
  onCancel: () => void;
}

export interface DueFlashcardsTabProps {
  flashcards: Flashcard[];
  onStartReview: () => void;
  onDeleteFlashcard: (id: string) => void;
  onCardUpdated: () => void;
  onCreateSimpleFlashcard: () => void;
  onCreateAdvancedFlashcard: () => void;
}
