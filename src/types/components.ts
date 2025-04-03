
import { Flashcard } from './flashcard';
import { FlashcardLearningStats } from '../services/spacedRepetition/reviewTypes';

// Define interfaces for component props
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
